// Mock medical record service
export interface MedicalRecord {
  id: string;
  patientId: string;
  title: string;
  description?: string;
  category: 'medical' | 'radiology' | 'laboratory' | 'legacy' | 'migrated';
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

// Mock data generator
function generateMockRecords(patientId: string): MedicalRecord[] {
  const doctors = [
    'Sarah Johnson', 'Michael Chen', 'Emma Williams', 'David Rodriguez', 
    'Lisa Thompson', 'James Wilson', 'Maria Garcia', 'Robert Taylor'
  ];
  
  const medicalRecordTypes = [
    { title: 'Dental X-Ray Report', category: 'radiology', description: 'Panoramic dental radiograph showing overall oral health status' },
    { title: 'Blood Test Results', category: 'laboratory', description: 'Complete blood count and basic metabolic panel' },
    { title: 'Medical History Form', category: 'medical', description: 'Initial patient intake and medical history documentation' },
    { title: 'Procedure Notes', category: 'medical', description: 'Clinical notes from dental procedure' },
    { title: 'Anesthesia Record', category: 'medical', description: 'Sedation monitoring and medication administration record' },
    { title: 'Post-Op Instructions', category: 'medical', description: 'Patient discharge instructions and follow-up care' },
    { title: 'CT Scan Report', category: 'radiology', description: 'Detailed computed tomography scan analysis' },
    { title: 'Allergy Test Results', category: 'laboratory', description: 'Comprehensive allergy panel results' },
    { title: 'Legacy Patient File', category: 'legacy', description: 'Historical patient data from previous system' },
    { title: 'Migrated Records', category: 'migrated', description: 'Patient data transferred from old database' }
  ];
  
  const records: MedicalRecord[] = [];
  const recordCount = Math.floor(Math.random() * 15) + 5; // 5-20 records per patient
  
  for (let i = 0; i < recordCount; i++) {
    const recordType = medicalRecordTypes[Math.floor(Math.random() * medicalRecordTypes.length)];
    const isLegacy = Math.random() > 0.7; // 30% chance of being legacy
    
    // Generate date (last 5 years)
    const daysAgo = Math.floor(Math.random() * 1825); // 5 years in days
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - daysAgo);
    
    records.push({
      id: `record-${patientId}-${i + 1}`,
      patientId,
      title: `${recordType.title} - ${createdDate.getFullYear()}`,
      description: recordType.description,
      category: isLegacy ? (Math.random() > 0.5 ? 'legacy' : 'migrated') : recordType.category as MedicalRecord['category'],
      fileType: ['pdf', 'jpg', 'png', 'doc'][Math.floor(Math.random() * 4)],
      fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
      createdDate: createdDate.toISOString(),
      doctorName: doctors[Math.floor(Math.random() * doctors.length)],
      doctorId: `doc-${Math.floor(Math.random() * 100)}`,
      isLegacy,
      appointmentId: !isLegacy ? `apt-${Math.floor(Math.random() * 1000)}` : undefined,
      tags: Math.random() > 0.5 ? ['routine', 'follow-up'] : ['urgent', 'priority'],
      content: `This is the content for ${recordType.title}. ${recordType.description}`,
    });
  }
  
  // Ensure we have some legacy records that couldn't be linked
  const legacyRecords = [
    {
      id: `record-${patientId}-legacy-1`,
      patientId,
      title: 'Historical Dental Records - 2019',
      description: 'Complete dental history from previous practice. Could not be linked to specific appointments.',
      category: 'legacy' as const,
      fileType: 'pdf',
      fileSize: 2500000,
      createdDate: new Date('2019-03-15').toISOString(),
      doctorName: 'Dr. Previous Practice',
      isLegacy: true,
      tags: ['historical', 'unlinked'],
      content: 'Historical patient records that were migrated from the previous dental practice system. These records contain valuable medical history but could not be automatically linked to specific appointment entities during the migration process.',
    },
    {
      id: `record-${patientId}-legacy-2`,
      patientId,
      title: 'Insurance Claims History - Pre-2020',
      description: 'Historical insurance and billing records from legacy system.',
      category: 'migrated' as const,
      fileType: 'xlsx',
      fileSize: 850000,
      createdDate: new Date('2018-11-22').toISOString(),
      isLegacy: true,
      tags: ['billing', 'insurance', 'historical'],
      content: 'Legacy billing and insurance records that were preserved during system migration but could not be associated with current appointment structure.',
    }
  ];
  
  return [...records, ...legacyRecords].sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
}

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory cache for records
const recordCache = new Map<string, MedicalRecord[]>();

export const medicalRecordService = {
  async getPatientRecords(patientId: string): Promise<MedicalRecord[]> {
    await delay(500);
    
    // Check cache first
    if (recordCache.has(patientId)) {
      return recordCache.get(patientId)!;
    }
    
    // Generate and cache mock data
    const records = generateMockRecords(patientId);
    recordCache.set(patientId, records);
    
    return records;
  },
  
  async uploadRecord(patientId: string, recordData: Omit<MedicalRecord, 'id' | 'patientId' | 'createdDate'>): Promise<MedicalRecord> {
    await delay(800);
    
    const newRecord: MedicalRecord = {
      id: `record-${Date.now()}`,
      patientId,
      createdDate: new Date().toISOString(),
      ...recordData,
    };
    
    // Update cache
    const cached = recordCache.get(patientId) || [];
    cached.unshift(newRecord);
    recordCache.set(patientId, cached);
    
    return newRecord;
  },
  
  async deleteRecord(recordId: string): Promise<void> {
    await delay(300);
    
    // In a real implementation, this would delete the record from the database
    // For now, we'll remove it from all cached records
    recordCache.forEach((records, patientId) => {
      const filtered = records.filter(r => r.id !== recordId);
      recordCache.set(patientId, filtered);
    });
  },
  
  async updateRecord(recordId: string, updates: Partial<MedicalRecord>): Promise<MedicalRecord> {
    await delay(400);
    
    // In a real implementation, this would update the record in the database
    return {
      id: recordId,
      ...updates,
    } as MedicalRecord;
  }
};