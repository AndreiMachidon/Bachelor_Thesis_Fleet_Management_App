export interface DecodedTokenAdmin {
    id: number;
    organisationName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    role: string;
    imageData?: string;
    driverDetailsId?: number;
  }