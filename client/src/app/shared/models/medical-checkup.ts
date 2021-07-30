export interface MedicalCheckup {
  doctorID: String;
  customerID: String;
  customerName: String;
  priority: Number;
  healthInsurance: String;
  // doctor's office
  location: String;
  purpose: String;
  status: String;
  startDate: Date;
}
