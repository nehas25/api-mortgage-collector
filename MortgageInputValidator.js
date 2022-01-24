const Constants = require('./Constants');
const PaymentScheduleObj = require('./PaymentSchedule.js');
const Dinero = require('dinero.js');
const MinDwnPmtCalc = require('./CanadianMinimumDwnPmtCalculator');

const AMORT_PERIOD_LOWER_BOUND = 5;
const AMORT_PERIOD_UPPER_BOUND = 30;
const AMORT_PERIOD_MULTIPLE = 5;

class MortgageInputValidator {
  propertyPrice;
  downPayment;
  annualInterestRate;
  amortizationPeriod;
  paymentSchedule;
  propertyPriceValid;
  errorMessage = [];
  
  constructor(calcMortgageRequest) {
    this.propertyPrice = calcMortgageRequest.propertyPrice;
    this.downPayment = calcMortgageRequest.downPayment;
    this.annualInterestRate = calcMortgageRequest.annualInterestRate;
    this.amortizationPeriod = calcMortgageRequest.amortizationPeriod;
    this.paymentSchedule = calcMortgageRequest.paymentSchedule;
  }
  
  getErrors() {
    this.propertyPriceValid = this.validatePropertyPrice();
    const downPaymentValid = this.validateDownPayment(); 
    this.validateAnnualInterestRate();
    this.validateAmortizationPeriod();
    this.validatePaymentSchedule();
    console.log('propertyPriceValid=' + this.propertyPriceValid + ' value=' + this.propertyPrice);
    console.log('downPaymentValid=' + downPaymentValid + ' value=' + this.downPayment);
    if(this.propertyPriceValid && downPaymentValid) {
      this.isMinimumDownPayment(this.propertyPrice, this.downPayment);
    }
    return this.errorMessage;
  }

  isInvalidNumber(value) {
    return !value || isNaN(value) || !Number.isFinite(Number(value));
  }
  
  validatePropertyPrice() {
    if(this.isInvalidNumber(this.propertyPrice) || parseFloat(this.propertyPrice)<=0){
      this.errorMessage.push('propertyPrice: Property price must be a positive number.');
      return false;
    }
    return true;
  }
  
  validateDownPayment() {
    if(this.isInvalidNumber(this.downPayment) || parseFloat(this.downPayment)<=0) {
      this.errorMessage.push('downPayment: Down payment must be a positive number.');
      return false;
    }
    if(this.propertyPriceValid) {
      const propertyPriceCurr = Dinero({amount: parseInt(parseFloat(this.propertyPrice)*100), currency: Constants.CURRENCY});
      const downPaymentCurr = Dinero({amount: parseInt(parseFloat(this.downPayment)*100), currency: Constants.CURRENCY});
      console.log('Before If');
      if(downPaymentCurr.greaterThanOrEqual(propertyPriceCurr)) {
        console.log('Entered here');
        this.errorMessage.push('downPayment: Down payment must be a positive value less than the property price.');
        return false;
      }
    }
    return true;
  }
  
  validateAnnualInterestRate() {
    if(this.isInvalidNumber(this.annualInterestRate)  || parseFloat(this.annualInterestRate)<=0) {
      this.errorMessage.push('annualInterestRate: Annual interest rate must be a positive number.');
      return false;
    }
    return true;
  }
  
  isSupportedAmortPeriod(intAmortPeriod) {
    return intAmortPeriod>=AMORT_PERIOD_LOWER_BOUND && intAmortPeriod<=AMORT_PERIOD_UPPER_BOUND && (intAmortPeriod % AMORT_PERIOD_MULTIPLE)===0;
  }
  
  validateAmortizationPeriod() {
    if(this.isInvalidNumber(this.amortizationPeriod) || !Number.isInteger(Number(this.amortizationPeriod)) || !this.isSupportedAmortPeriod(parseInt(this.amortizationPeriod))) {
      this.errorMessage.push('amortizationPeriod: Amortization period invalid. It must be an integer in valid range, which is 5 year increments between 5 and 30 both included.');
      return false;
    }
    return true;
  }
  
  validatePaymentSchedule() {
    if(!PaymentScheduleObj.isValid(this.paymentSchedule)) {
      this.errorMessage.push(`paymentSchedule: Payment schedule is invalid. Valid values are: ${PaymentScheduleObj.getValidNames()}`);
      return false;
    }
    return true;
  }
  
  isMinimumDownPayment() {
    
    const propPriceInCents = parseInt(parseFloat(this.propertyPrice)*100);
    const propertyPriceCurrencyObj = Dinero({amount: propPriceInCents});
    
    const downPaymentInCents = parseInt(parseFloat(this.downPayment)*100);
    const downPaymentCurrencyObj = Dinero({amount: downPaymentInCents});
    
    const expectedMinDownPaymentCurrencyObj = MinDwnPmtCalc.getMinimumDwnPmt(propertyPriceCurrencyObj);
    
    if(downPaymentCurrencyObj.lessThan(expectedMinDownPaymentCurrencyObj)){
      this.errorMessage.push(`Minimum down payment requirement not met. Expected minimum down payment = ${expectedMinDownPaymentCurrencyObj.getAmount()}`);
      return false;
    }
    return true;
  }
}

module.exports = MortgageInputValidator;