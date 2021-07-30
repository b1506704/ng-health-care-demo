import { Disease } from '../shared/models/disease';
import { MarkupTemplate } from '../shared/models/markupTemplate';
import { Medicine } from '../shared/models/medicine';

export default function predefineMarkupTemplate(input: MarkupTemplate) {
  const title = 'TESLA CLINIC PRESCRIPTION';
  const date = new Date().toLocaleDateString();
  let diseaseList = '';
  let medicineList = '';
  input.diseaseList.forEach((e: Disease) => {
    diseaseList += `${e.name}, `;
  });
  input.medicineList.forEach((e: Medicine) => {
    medicineList += `${e.name}, `;
  });
  //todo: style this
  return `<h2>${title}</h2>
    <div>Diagnose Date: ${date}</div>
    <div>Patient Name: ${input.customerName}</div>
    <div>Doctor Name:${input.doctorName}<div>
    <div>Diagnosed Illness:${diseaseList}<div>
    <div>Diagnosed Medicine:${medicineList}<div>
    `;
}
