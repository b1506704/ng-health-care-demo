export interface Prescription {
  _id: String;
  prescriptionID: String;
  customerID: String;
  doctorID: String;
  diseaseList: Array<Object>;
  medicineList: Array<Object>;
  htmlMarkUp: String;
  advice: String;
}
