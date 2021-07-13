export interface Room {
  _id: String;
  number: String;
  vacancyStatus: String;
  totalSlot: Number;
  customerID: Array<String>;
  admissionDate: Date;
  dischargeDate: Date;
}
