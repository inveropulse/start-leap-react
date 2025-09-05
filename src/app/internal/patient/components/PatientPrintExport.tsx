import { Printer, Download, FileText, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Patient } from "../types/patient.types";
import { format } from "date-fns";

interface PatientPrintExportProps {
  patient: Patient;
  onPrint?: () => void;
  onExport?: (format: 'pdf' | 'csv') => void;
  onEmailSummary?: () => void;
}

export function PatientPrintExport({ 
  patient, 
  onPrint, 
  onExport, 
  onEmailSummary 
}: PatientPrintExportProps) {
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return "Unknown";
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} years old`;
    } catch {
      return "Unknown";
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    
    // Default print functionality
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Summary - ${patient.fullName || `${patient.firstName} ${patient.lastName}`}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .info-item { margin-bottom: 8px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-left: 10px; }
            .badge { background: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Patient Summary</h1>
            <h2>${patient.title ? `${patient.title} ` : ''}${patient.fullName || `${patient.firstName} ${patient.lastName}`}</h2>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="section">
            <h3>Personal Information</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">Date of Birth:</span><span class="value">${formatDate(patient.dateOfBirth)}</span></div>
              <div class="info-item"><span class="label">Age:</span><span class="value">${calculateAge(patient.dateOfBirth)}</span></div>
              <div class="info-item"><span class="label">Sex:</span><span class="value">${patient.sex || 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Occupation:</span><span class="value">${patient.occupation || 'Not specified'}</span></div>
            </div>
          </div>
          
          <div class="section">
            <h3>Contact Information</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">Primary Phone:</span><span class="value">${patient.phoneNumber || 'Not provided'}</span></div>
              <div class="info-item"><span class="label">Email:</span><span class="value">${patient.email || 'Not provided'}</span></div>
              <div class="info-item"><span class="label">Address:</span><span class="value">${patient.address || 'Not provided'}</span></div>
              <div class="info-item"><span class="label">Town/City:</span><span class="value">${patient.town || 'Not provided'}, ${patient.country || ''}</span></div>
            </div>
          </div>
          
          <div class="section">
            <h3>Medical Information</h3>
            <div class="info-item">
              <span class="label">Medical History:</span>
              <div class="value">${patient.medicalHistory || 'No medical history recorded'}</div>
            </div>
            <div class="info-item">
              <span class="label">Allergies:</span>
              <div class="value">${patient.allergies || 'No known allergies'}</div>
            </div>
            <div class="info-item">
              <span class="label">Current Medications:</span>
              <div class="value">${patient.medications || 'No current medications'}</div>
            </div>
            <div class="info-item">
              <span class="label">ASA Classification:</span>
              <div class="value">ASA ${patient.asaClassification || 'Not specified'}</div>
            </div>
          </div>
          
          <div class="section">
            <h3>Physical Stats</h3>
            <div class="info-grid">
              <div class="info-item"><span class="label">Height:</span><span class="value">${patient.height ? `${patient.height} ${patient.heightFormat || 'cm'}` : 'Not specified'}</span></div>
              <div class="info-item"><span class="label">Weight:</span><span class="value">${patient.weight ? `${patient.weight} ${patient.weightFormat || 'kg'}` : 'Not specified'}</span></div>
              <div class="info-item"><span class="label">BMI:</span><span class="value">${patient.bmi ? patient.bmi.toFixed(1) : 'Not calculated'}</span></div>
              <div class="info-item"><span class="label">Smoking Status:</span><span class="value">${patient.smokingStatus || 'Not specified'}</span></div>
            </div>
          </div>
          
          ${patient.notes ? `
            <div class="section">
              <h3>Clinical Notes</h3>
              <div class="value">${patient.notes}</div>
            </div>
          ` : ''}
          
          <div class="section">
            <h3>System Information</h3>
            <div class="info-item"><span class="label">Patient ID:</span><span class="value">${patient.id}</span></div>
            <div class="info-item"><span class="label">Created:</span><span class="value">${formatDate(patient.createdDateTime)}</span></div>
            ${patient.ticketId ? `<div class="info-item"><span class="label">Ticket ID:</span><span class="value">${patient.ticketId}</span></div>` : ''}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Small delay to ensure content is loaded before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    if (onExport) {
      onExport(format);
      return;
    }
    
    if (format === 'csv') {
      // Generate CSV data
      const csvData = [
        ['Field', 'Value'],
        ['Patient ID', patient.id || ''],
        ['Name', patient.fullName || `${patient.firstName} ${patient.lastName}` || ''],
        ['Title', patient.title || ''],
        ['Date of Birth', patient.dateOfBirth || ''],
        ['Age', calculateAge(patient.dateOfBirth)],
        ['Sex', patient.sex || ''],
        ['Phone', patient.phoneNumber || ''],
        ['Email', patient.email || ''],
        ['Address', patient.address || ''],
        ['Town', patient.town || ''],
        ['Country', patient.country || ''],
        ['Occupation', patient.occupation || ''],
        ['Height', patient.height ? `${patient.height} ${patient.heightFormat || 'cm'}` : ''],
        ['Weight', patient.weight ? `${patient.weight} ${patient.weightFormat || 'kg'}` : ''],
        ['BMI', patient.bmi?.toString() || ''],
        ['Medical History', patient.medicalHistory || ''],
        ['Allergies', patient.allergies || ''],
        ['Medications', patient.medications || ''],
        ['ASA Classification', patient.asaClassification?.toString() || ''],
        ['Smoking Status', patient.smokingStatus || ''],
        ['Alcohol Status', patient.alcoholStatus || ''],
        ['Notes', patient.notes || ''],
        ['Created Date', patient.createdDateTime || ''],
      ];
      
      const csvContent = csvData.map(row => 
        row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `patient_${patient.id}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      // For PDF export, we can use the print functionality and let the user save as PDF
      // In a real application, you might use a library like jsPDF or send to server for PDF generation
      alert('PDF export: Please use your browser\'s print function and select "Save as PDF"');
      handlePrint();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Print & Export</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="flex items-center justify-center space-x-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleExport('pdf')}
            className="flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleExport('csv')}
            className="flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onEmailSummary}
            className="flex items-center justify-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p><strong>Print:</strong> Generate a formatted summary for physical records</p>
          <p><strong>PDF:</strong> Export as portable document for digital storage</p>
          <p><strong>CSV:</strong> Export data for spreadsheet analysis</p>
          <p><strong>Email:</strong> Send patient summary to authorized recipients</p>
        </div>
      </CardContent>
    </Card>
  );
}