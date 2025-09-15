import { useQuery } from "@tanstack/react-query";

// Types specific to this endpoint
export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  description?: string;
  category: "medical" | "radiology" | "laboratory" | "legacy" | "migrated";
  fileType?: string;
  fileSize?: number;
  createdDate: string;
  doctorName?: string;
  doctorId?: string;
  isLegacy: boolean;
  appointmentId?: string;
  tags?: string[];
  content?: string;
}

// Mock data for this endpoint
const MOCK_MEDICAL_RECORDS: Record<string, MedicalRecord[]> = {
  "1": [
    {
      id: "record-1-1",
      patientId: "1",
      title: "Dental X-Ray Report - 2024",
      description:
        "Panoramic dental radiograph showing overall oral health status",
      category: "radiology",
      fileType: "jpg",
      fileSize: 2500000,
      createdDate: "2024-08-15T10:30:00Z",
      doctorName: "Sarah Johnson",
      doctorId: "doc-1",
      isLegacy: false,
      appointmentId: "apt-123",
      tags: ["routine", "follow-up"],
      content:
        "This is the content for Dental X-Ray Report. Panoramic dental radiograph showing overall oral health status",
    },
    {
      id: "record-1-2",
      patientId: "1",
      title: "Blood Test Results - 2024",
      description: "Complete blood count and basic metabolic panel",
      category: "laboratory",
      fileType: "pdf",
      fileSize: 850000,
      createdDate: "2024-07-20T14:15:00Z",
      doctorName: "Michael Chen",
      doctorId: "doc-2",
      isLegacy: false,
      appointmentId: "apt-122",
      tags: ["routine"],
      content:
        "This is the content for Blood Test Results. Complete blood count and basic metabolic panel",
    },
    {
      id: "record-1-3",
      patientId: "1",
      title: "Medical History Form - 2024",
      description: "Initial patient intake and medical history documentation",
      category: "medical",
      fileType: "pdf",
      fileSize: 1200000,
      createdDate: "2024-06-10T09:00:00Z",
      doctorName: "Sarah Johnson",
      doctorId: "doc-1",
      isLegacy: false,
      appointmentId: "apt-121",
      tags: ["intake", "new-patient"],
      content:
        "This is the content for Medical History Form. Initial patient intake and medical history documentation",
    },
    {
      id: "record-1-4",
      patientId: "1",
      title: "Procedure Notes - 2024",
      description: "Clinical notes from dental procedure",
      category: "medical",
      fileType: "doc",
      fileSize: 450000,
      createdDate: "2024-05-22T11:20:00Z",
      doctorName: "Emma Williams",
      doctorId: "doc-3",
      isLegacy: false,
      appointmentId: "apt-120",
      tags: ["procedure", "notes"],
      content:
        "This is the content for Procedure Notes. Clinical notes from dental procedure",
    },
    {
      id: "record-1-5",
      patientId: "1",
      title: "Anesthesia Record - 2024",
      description: "Sedation monitoring and medication administration record",
      category: "medical",
      fileType: "pdf",
      fileSize: 680000,
      createdDate: "2024-04-18T13:45:00Z",
      doctorName: "David Rodriguez",
      doctorId: "doc-4",
      isLegacy: false,
      appointmentId: "apt-119",
      tags: ["sedation", "monitoring"],
      content:
        "This is the content for Anesthesia Record. Sedation monitoring and medication administration record",
    },
    {
      id: "record-1-legacy-1",
      patientId: "1",
      title: "Historical Dental Records - 2019",
      description:
        "Complete dental history from previous practice. Could not be linked to specific appointments.",
      category: "legacy",
      fileType: "pdf",
      fileSize: 2500000,
      createdDate: "2019-03-15T00:00:00Z",
      doctorName: "Dr. Previous Practice",
      isLegacy: true,
      tags: ["historical", "unlinked"],
      content:
        "Historical patient records that were migrated from the previous dental practice system. These records contain valuable medical history but could not be automatically linked to specific appointment entities during the migration process.",
    },
    {
      id: "record-1-legacy-2",
      patientId: "1",
      title: "Insurance Claims History - Pre-2020",
      description:
        "Historical insurance and billing records from legacy system.",
      category: "migrated",
      fileType: "xlsx",
      fileSize: 850000,
      createdDate: "2018-11-22T00:00:00Z",
      isLegacy: true,
      tags: ["billing", "insurance", "historical"],
      content:
        "Legacy billing and insurance records that were preserved during system migration but could not be associated with current appointment structure.",
    },
  ],
};

// API function
const fetchPatientRecords = async (
  patientId: string
): Promise<MedicalRecord[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const records = MOCK_MEDICAL_RECORDS[patientId] || [];

  // Sort by creation date (newest first)
  return records.sort(
    (a, b) =>
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
};

// Custom hook
export const usePatientRecordsRequest = (patientId: string) => {
  return useQuery({
    queryKey: ["patient-records", patientId],
    queryFn: () => fetchPatientRecords(patientId),
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
