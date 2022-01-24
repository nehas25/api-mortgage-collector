const express = require('express');
const app = express();
const PORT = 3000;
const MortgageCalculator = require('./MortgageCalculator');
const MortgageInputValidator = require('./MortgageInputValidator');
const Constants = require('./Constants');

app.get('/mortgage', (req, res) => {
  const calcMortgageRequest = {
    propertyPrice: req.query.propertyPrice,
    downPayment: req.query.downPayment,
    annualInterestRate: req.query.annualInterestRate,
    amortizationPeriod: req.query.amortizationPeriod,
    paymentSchedule: req.query.paymentSchedule,
  }
  
  const validator = new MortgageInputValidator(calcMortgageRequest);
  const errorMsgs = validator.getErrors();
  
  if(errorMsgs.length) {
    res.status = Constants.RESPONSE_CODE_400;
    return res.json({
      errorMessage: errorMsgs,
    });
  } else {
    let mortgageCalc = new MortgageCalculator(calcMortgageRequest);
    let amount = mortgageCalc.calculatePmtPerPaySchedule();
    res.status = Constants.RESPONSE_CODE_200;
    res.json({
      payment_per_pay_schedule: amount
    });
  }
});

app.listen(PORT, () => {
  console.log(`I am listening on port ${PORT}`);
});