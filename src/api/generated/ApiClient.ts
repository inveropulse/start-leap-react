/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest';
import { AuthService } from './services/AuthService';
import { ClinicBookingService } from './services/ClinicBookingService';
import { ClinicsService } from './services/ClinicsService';
import { DashboardService } from './services/DashboardService';
import { DiaryService } from './services/DiaryService';
import { DrugsService } from './services/DrugsService';
import { HealthService } from './services/HealthService';
import { LogService } from './services/LogService';
import { MonitorsService } from './services/MonitorsService';
import { PatientService } from './services/PatientService';
import { PatientPackService } from './services/PatientPackService';
import { ReportService } from './services/ReportService';
import { SedationDetailService } from './services/SedationDetailService';
import { SedationistService } from './services/SedationistService';
import { SedationMeasurementService } from './services/SedationMeasurementService';
import { SedationReportReceiptService } from './services/SedationReportReceiptService';
import { SyncService } from './services/SyncService';
import { TemplateService } from './services/TemplateService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class ApiClient {
    public readonly auth: AuthService;
    public readonly clinicBooking: ClinicBookingService;
    public readonly clinics: ClinicsService;
    public readonly dashboard: DashboardService;
    public readonly diary: DiaryService;
    public readonly drugs: DrugsService;
    public readonly health: HealthService;
    public readonly log: LogService;
    public readonly monitors: MonitorsService;
    public readonly patient: PatientService;
    public readonly patientPack: PatientPackService;
    public readonly report: ReportService;
    public readonly sedationDetail: SedationDetailService;
    public readonly sedationist: SedationistService;
    public readonly sedationMeasurement: SedationMeasurementService;
    public readonly sedationReportReceipt: SedationReportReceiptService;
    public readonly sync: SyncService;
    public readonly template: TemplateService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '1',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.auth = new AuthService(this.request);
        this.clinicBooking = new ClinicBookingService(this.request);
        this.clinics = new ClinicsService(this.request);
        this.dashboard = new DashboardService(this.request);
        this.diary = new DiaryService(this.request);
        this.drugs = new DrugsService(this.request);
        this.health = new HealthService(this.request);
        this.log = new LogService(this.request);
        this.monitors = new MonitorsService(this.request);
        this.patient = new PatientService(this.request);
        this.patientPack = new PatientPackService(this.request);
        this.report = new ReportService(this.request);
        this.sedationDetail = new SedationDetailService(this.request);
        this.sedationist = new SedationistService(this.request);
        this.sedationMeasurement = new SedationMeasurementService(this.request);
        this.sedationReportReceipt = new SedationReportReceiptService(this.request);
        this.sync = new SyncService(this.request);
        this.template = new TemplateService(this.request);
    }
}

