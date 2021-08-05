export default function formatCurrency(
  amount: number,
  currency: string
) {
  const integerNum = amount.toFixed(2).split('.')[0];
  const decimalNum = amount.toFixed(2).split('.')[1];
  const reverseString = integerNum.split('').reverse();
  let count = 0;
  let tempString = '';
  for (let i = 0; i < reverseString.length; i++) {
    count++;
    if (count % 3 === 1 && count != 1) {
      tempString = reverseString[i] + ',' + tempString;
    } else {
      tempString = reverseString[i] + tempString;
    }
  }
  return tempString + '.' + decimalNum + currency;
}
