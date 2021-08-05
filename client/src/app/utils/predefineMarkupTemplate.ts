import { MarkupTemplate } from '../shared/models/markupTemplate';
import formatCurrency from './formatCurrency';

export default function predefineMarkupTemplate(input: MarkupTemplate) {
  const title = 'TESLA CLINIC PRESCRIPTION';
  const date = new Date().toLocaleDateString();
  let diseaseList = '';
  let medicineList = '';
  let sum = 0;
  input.diseaseList.forEach((e: any) => {
    diseaseList += `${e.name}, `;
  });
  let index = 0;
  input.medicineList.forEach((e: any) => {
    sum += e.totalCost;
    medicineList += `<tr>
    <td>
      ${index + 1}
    </td>
    <td>
      ${e.name}
    </td>
    <td>
      ${e.quantity}
    </td>
    <td>
      ${e.advice}
    </td>
    <td>
      ${formatCurrency(e.totalCost, '$')}
    </td>
  </tr>`;
    index += 1;
  });
  //todo: style this
  return `<h2 style="text-align: center;">${title}</h2>
    <div>Diagnose Date: ${date}</div>
    <div>Patient Name: ${input.customerName}</div>
    <div>Doctor Name:${input.doctorName}<div>
    <div style="margin-bottom: 15px">Diagnosed Illness:${diseaseList}<div>    
    <table>
            <thead>
              <tr>
                <th>
                  Index
                </th>
                <th>
                  Name
                </th>
                <th>
                  Quantity
                </th>
                <th>
                  Advice
                </th>
                <th>
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
            ${medicineList}
            <p><strong>Total Cost: ${formatCurrency(sum, '$')}</strong></p>
            </tbody>
          </table>
    `;
}
