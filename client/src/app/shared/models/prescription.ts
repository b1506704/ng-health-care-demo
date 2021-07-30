import { Disease } from "./disease";
import { Medicine } from "./medicine";

export interface Prescription {
  customerID: String;
  customerName: String;
  doctorID: String;
  doctorName: String;
  diseaseList: Array<Disease>;
  medicineList: Array<Medicine>;
  htmlMarkUp: String;
  advice: String;
}
