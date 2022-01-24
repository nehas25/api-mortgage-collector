const Constants = require('./Constants');
const PaymentScheduleObj = require('./PaymentSchedule.js');
const Dinero = require('dinero.js');

class MortgageCalculator {
  
  propertyPriceInCents;
  downPaymentInCents;
  annualInterestRate;
  amortizationPeriod;
  paymentSchedule;
  
  constructor(calcMortgageRequest) {
    this.propertyPriceInCents = parseInt(parseFloat(calcMortgageRequest.propertyPrice)*100);
    this.downPaymentInCents = parseInt(parseFloat(calcMortgageRequest.downPayment)*100);
    this.annualInterestRate = parseFloat((parseFloat(calcMortgageRequest.annualInterestRate)/100).toFixed(8));
    this.amortizationPeriod = parseInt(calcMortgageRequest.amortizationPeriod);
    this.paymentSchedule = PaymentScheduleObj.getPaymentSchedule(calcMortgageRequest.paymentSchedule);
  }
  
  getPrincipal() {
    const propertyPriceCurrencyObj = Dinero({amount: this.propertyPriceInCents, currency:Constants.CURRENCY, precision: Constants.PRECISION});
    const downPaymentCurrencyObj = Dinero({amount: this.downPaymentInCents, currency:Constants.CURRENCY, precision: Constants.PRECISION});
    return propertyPriceCurrencyObj.subtract(downPaymentCurrencyObj);
  }
  
  geNumPmtsPerAnnum() {
    return this.paymentSchedule.value;
  }
  
  getIntRatePerPmtSch() {
    return (this.annualInterestRate / this.geNumPmtsPerAnnum());
  }
  
  getNumPmtsAmortPeriod() {
    return this.amortizationPeriod * this.geNumPmtsPerAnnum();
  }
  
  getOnePlusIntRatePerPmtSch() {
    return(1.0 + this.getIntRatePerPmtSch());
  }
  
  getFactor() {
    return  Math.pow(this.getOnePlusIntRatePerPmtSch(), this.getNumPmtsAmortPeriod());
  }

  getMonthlyPmtInCents(principalCurrencyObj) {
    const intRatePerPmtSch = this.getIntRatePerPmtSch();
    const factor = this.getFactor();
    return (principalCurrencyObj
      .multiply(intRatePerPmtSch)
      .multiply(factor))
      .divide(factor - 1);
  }

  calculatePmtPerPaySchedule() {
    const principalCurrencyObj = this.getPrincipal();
    const paymentAmtInCents = this.getMonthlyPmtInCents(principalCurrencyObj);
    const amtInDollar = paymentAmtInCents.toUnit();
    return amtInDollar;
  }
  }
  
  module.exports = MortgageCalculator;