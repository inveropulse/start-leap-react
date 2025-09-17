import { useState, useEffect, useCallback } from "react";
import { Search, User, Star, Award, TrendingUp, Users } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/shared/components/ui/avatar";
import { WizardStepProps } from "../../../types/wizard.types";
import { SedationistCertification } from "@/shared/types/domains/sedationist";
import { searchSedationists } from "../../../data/mockWizardData";

export function SedationistSelectionStep({
  data,
  onDataChange,
  onNext,
  onPrevious,
}: WizardStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState(
    searchSedationists("", 1, 6)
  );
  const [selectedSedationistId, setSelectedSedationistId] = useState(
    data.sedationist?.id || ""
  );

  // Search sedationists with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const results = searchSedationists(searchQuery, currentPage, 6);
      setSearchResults(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, currentPage]);

  const handleSedationistSelect = useCallback(
    (sedationist: any) => {
      setSelectedSedationistId(sedationist.id);
      onDataChange({ sedationist });
    },
    [onDataChange]
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleNext = useCallback(() => {
    if (selectedSedationistId) {
      onNext();
    }
  }, [selectedSedationistId, onNext]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Select Sedationist
        </h2>
        <p className="text-muted-foreground">
          Choose a sedationist for the procedure
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sedationists by name, specialty, or certification..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Sedationists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {searchResults.data.map((sedationist) => (
          <Card
            key={sedationist.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedSedationistId === sedationist.id
                ? "ring-2 ring-portal-internal-primary bg-portal-internal-secondary"
                : "hover:ring-1 hover:ring-border"
            }`}
            onClick={() => handleSedationistSelect(sedationist)}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={sedationist.avatar}
                    alt={`${sedationist.firstName} ${sedationist.lastName}`}
                  />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-foreground truncate">
                      {sedationist.firstName} {sedationist.lastName}
                    </h3>
                    {selectedSedationistId === sedationist.id && (
                      <Badge className="bg-portal-internal-primary text-white ml-2">
                        Selected
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Experience and Rating */}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{sedationist.experience} years</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 fill-current text-yellow-500" />
                        <span>{sedationist.rating}</span>
                      </div>
                    </div>

                    {/* Success Rate and Caseload */}
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>{sedationist.successRate}% success</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{sedationist.currentCaseload} cases</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <div className="text-sm font-medium text-foreground mb-1">
                        Specialties:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sedationist.specialties
                          .slice(0, 2)
                          .map((specialty: string) => (
                            <Badge
                              key={specialty}
                              variant="outline"
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        {sedationist.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{sedationist.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <div className="text-sm font-medium text-foreground mb-1">
                        Certifications:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {sedationist.certifications
                          .slice(0, 2)
                          .map((cert: SedationistCertification, i: number) => (
                            <Badge
                              key={cert.id || i}
                              variant="secondary"
                              className="text-xs bg-portal-internal-primary/10 text-portal-internal-primary"
                            >
                              {cert.name}
                            </Badge>
                          ))}
                        {sedationist.certifications.length > 2 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-portal-internal-primary/10 text-portal-internal-primary"
                          >
                            +{sedationist.certifications.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {searchResults.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex space-x-1">
            {Array.from(
              { length: Math.min(5, searchResults.totalPages) },
              (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                );
              }
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(searchResults.totalPages, prev + 1)
              )
            }
            disabled={currentPage === searchResults.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {searchResults.data.length} of {searchResults.total}{" "}
        sedationists
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedSedationistId}
          className="bg-portal-internal-primary hover:bg-portal-internal-primary/90"
        >
          Continue to Appointment Details
        </Button>
      </div>
    </div>
  );
}
