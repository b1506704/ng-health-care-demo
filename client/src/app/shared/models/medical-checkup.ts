export interface MedicalCheckup {
  doctorID: String;
  customerID: string;
  customerName: String;
  priority: Number;
  healthInsurance: String;
  // doctor's office
  location: String;
  purpose: String;
  status: String;
  startDate: Date;
}
