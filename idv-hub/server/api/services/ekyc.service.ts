export interface eKycService {
    isApplicable(serviceName: string): boolean;
    getVcFromService(key: string): Promise<any>;
}



