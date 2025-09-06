import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Eye,
  Trash2 
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { AppointmentDocument, DocumentType, DocumentStatus } from '../../types/management.types';
import { appointmentManagementService } from '../../services/appointmentManagementService';

interface AppointmentDocumentsTabProps {
  documents: AppointmentDocument[];
  appointmentId: string;
  isLoading: boolean;
  onRefresh: () => void;
}

export function AppointmentDocumentsTab({
  documents,
  appointmentId,
  isLoading,
  onRefresh,
}: AppointmentDocumentsTabProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<DocumentType>(DocumentType.CLINIC_DOCUMENT);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      await appointmentManagementService.uploadDocument(appointmentId, file, uploadType);
      onRefresh();
    } catch (error) {
      console.error('Failed to upload document:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.PATIENT_PACK:
        return <FileText className="h-4 w-4 text-blue-600" />;
      case DocumentType.SEDATION_RECORD:
        return <FileText className="h-4 w-4 text-green-600" />;
      case DocumentType.CLINIC_DOCUMENT:
        return <FileText className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.COMPLETED:
      case DocumentStatus.SIGNED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case DocumentStatus.UPLOADED:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case DocumentStatus.PENDING:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case DocumentStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.COMPLETED:
      case DocumentStatus.SIGNED:
        return <Badge variant="default" className="text-xs">Completed</Badge>;
      case DocumentStatus.UPLOADED:
        return <Badge variant="secondary" className="text-xs">Uploaded</Badge>;
      case DocumentStatus.PENDING:
        return <Badge variant="outline" className="text-xs">Pending</Badge>;
      case DocumentStatus.REJECTED:
        return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getDocumentTypeLabel = (type: DocumentType): string => {
    switch (type) {
      case DocumentType.PATIENT_PACK:
        return 'Patient Pack';
      case DocumentType.CLINIC_DOCUMENT:
        return 'Clinic Document';
      case DocumentType.SEDATION_RECORD:
        return 'Sedation Record';
      case DocumentType.CONSENT_FORM:
        return 'Consent Form';
      case DocumentType.MEDICAL_HISTORY:
        return 'Medical History';
      case DocumentType.OTHER:
        return 'Other';
      default:
        return type;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const groupDocumentsByType = () => {
    const groups: Record<DocumentType, AppointmentDocument[]> = {
      [DocumentType.PATIENT_PACK]: [],
      [DocumentType.CLINIC_DOCUMENT]: [],
      [DocumentType.SEDATION_RECORD]: [],
      [DocumentType.CONSENT_FORM]: [],
      [DocumentType.MEDICAL_HISTORY]: [],
      [DocumentType.OTHER]: [],
    };

    documents.forEach(doc => {
      groups[doc.type].push(doc);
    });

    return groups;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Loading documents...</p>
        </div>
      </div>
    );
  }

  const documentGroups = groupDocumentsByType();

  return (
    <div className="space-y-6">
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Document Management</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="documentType">Document Type</Label>
                <Select
                  value={uploadType}
                  onValueChange={(value: DocumentType) => setUploadType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DocumentType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getDocumentTypeLabel(type)}
                      </SelectItem>
                    ))}</SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file">Select File</Label>
                <Input
                  ref={fileInputRef}
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  disabled={isUploading}
                />
              </div>
              {isUploading && (
                <div className="text-sm text-muted-foreground">
                  Uploading document...
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Document Groups */}
      <div className="space-y-6">
        {/* Patient Pack Section */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            Patient Pack
          </h4>
          {documentGroups[DocumentType.PATIENT_PACK].length === 0 ? (
            <div className="border border-dashed rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Patient pack pending</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documentGroups[DocumentType.PATIENT_PACK].map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </div>

        {/* Clinic Documents Section */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-600" />
            Clinic Documents
          </h4>
          {documentGroups[DocumentType.CLINIC_DOCUMENT].length === 0 ? (
            <div className="border border-dashed rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documentGroups[DocumentType.CLINIC_DOCUMENT].map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </div>

        {/* Sedation Record Section */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-green-600" />
            Sedation Record
          </h4>
          {documentGroups[DocumentType.SEDATION_RECORD].length === 0 ? (
            <div className="border border-dashed rounded-lg p-4 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Auto-generated after sedation completion</p>
            </div>
          ) : (
            <div className="space-y-2">
              {documentGroups[DocumentType.SEDATION_RECORD].map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </div>

        {/* Other Documents */}
        {[DocumentType.CONSENT_FORM, DocumentType.MEDICAL_HISTORY, DocumentType.OTHER].map((type) => {
          const docs = documentGroups[type];
          if (docs.length === 0) return null;
          
          return (
            <div key={type}>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                {getDocumentIcon(type)}
                {getDocumentTypeLabel(type)}
              </h4>
              <div className="space-y-2">
                {docs.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Document Card Component
function DocumentCard({ document }: { document: AppointmentDocument }) {
  const handleDownload = () => {
    // Mock download functionality
    window.open(document.url || '#', '_blank');
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.COMPLETED:
      case DocumentStatus.SIGNED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case DocumentStatus.UPLOADED:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case DocumentStatus.PENDING:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case DocumentStatus.REJECTED:
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.COMPLETED:
      case DocumentStatus.SIGNED:
        return <Badge variant="default" className="text-xs">Completed</Badge>;
      case DocumentStatus.UPLOADED:
        return <Badge variant="secondary" className="text-xs">Uploaded</Badge>;
      case DocumentStatus.PENDING:
        return <Badge variant="outline" className="text-xs">Pending</Badge>;
      case DocumentStatus.REJECTED:
        return <Badge variant="destructive" className="text-xs">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-muted">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{document.name}</span>
            {getStatusIcon(document.status)}
            {getStatusBadge(document.status)}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-4">
            <span>{document.fileName}</span>
            <span>{formatFileSize(document.fileSize)}</span>
            <span>Uploaded {format(new Date(document.uploadedAt), 'MMM dd, yyyy')}</span>
            <span>by {document.uploadedBy}</span>
          </div>
          {document.notes && (
            <div className="text-xs text-muted-foreground mt-1 italic">
              {document.notes}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleDownload}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
