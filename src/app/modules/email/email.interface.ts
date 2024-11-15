export interface BaseRequest {
    name: string;
    email: string;
    phoneNumber: string;
    to: string;
}
  
export interface RepairRequest extends BaseRequest {
    body: string;
}
  
export interface DonationRequest extends BaseRequest {
    numberOfToys: number;
    donationDetails: string;
}
  
export interface CustomizationRequest extends BaseRequest {
    customizationDetails: string;
}