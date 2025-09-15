import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { usePatientRecordsRequest } from "@/api/patients";
import { useState } from "react";
import { format } from "date-fns";

interface PatientRecordsTabProps {
  patientId: string;
}

export function PatientRecordsTab({ patientId }: PatientRecordsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { data: records, isLoading } = usePatientRecordsRequest(patientId);

  const getRecordTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "medical":
        return "bg-blue-100 text-blue-800";
      case "radiology":
        return "bg-purple-100 text-purple-800";
      case "laboratory":
        return "bg-green-100 text-green-800";
      case "legacy":
        return "bg-orange-100 text-orange-800";
      case "migrated":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const filteredRecords =
    records?.filter((record) => {
      const matchesSearch =
        !searchQuery ||
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" ||
        record.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    }) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload and Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Document Management</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload Record
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Import Legacy Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export All Records
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="medical">Medical Records</SelectItem>
                <SelectItem value="radiology">Radiology</SelectItem>
                <SelectItem value="laboratory">Laboratory</SelectItem>
                <SelectItem value="legacy">Legacy Records</SelectItem>
                <SelectItem value="migrated">Migrated Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Patient Records ({filteredRecords.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery || categoryFilter !== "all"
                  ? "No records match your search criteria"
                  : "No medical records found for this patient"}
              </p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div key={record.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{record.title}</h4>
                      <Badge className={getRecordTypeColor(record.category)}>
                        {record.category}
                      </Badge>
                      {record.isLegacy && (
                        <Badge variant="outline">Legacy</Badge>
                      )}
                    </div>

                    {record.description && (
                      <p className="text-sm text-muted-foreground">
                        {record.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(record.createdDate)}</span>
                      </div>
                      {record.doctorName && (
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>Dr. {record.doctorName}</span>
                        </div>
                      )}
                      {record.fileSize && (
                        <span>{formatFileSize(record.fileSize)}</span>
                      )}
                    </div>

                    {record.isLegacy && (
                      <div className="bg-orange-50 border border-orange-200 rounded p-2 text-sm">
                        <strong>Legacy Record:</strong> This record couldn't be
                        linked to a specific appointment entity and was migrated
                        from the previous system.
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Record Categories Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Records by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {["Medical", "Radiology", "Laboratory", "Legacy", "Migrated"].map(
              (category) => {
                const count =
                  records?.filter(
                    (r) => r.category.toLowerCase() === category.toLowerCase()
                  ).length || 0;
                return (
                  <div key={category} className="text-center">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground">
                      {category}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
