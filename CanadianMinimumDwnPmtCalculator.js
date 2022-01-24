const Dinero = require('dinero.js');

const FIVE = 5;
const TEN = 10;
const TWENTY = 20;
const HALF_MILLION = Dinero({amount: 50000000});
const LESS_THAN_1_MILLION = Dinero({amount: 99999999});

//Reference: https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html

class CanadianMinimumDwnPmtCalculator {
  static between(currencyObj, minValCurrencyObj, maxValCurrencyObj) {
    return currencyObj.greaterThan(minValCurrencyObj) && currencyObj.lessThanOrEqual(maxValCurrencyObj);
  }

  static getMinimumDwnPmt(propPriceCurrencyObj) {
    const ZERO = Dinero({amount: 0});
    if(this.between(propPriceCurrencyObj, ZERO, HALF_MILLION)) {
      return propPriceCurrencyObj.percentage(FIVE);
    } else if(this.between(propPriceCurrencyObj, HALF_MILLION, LESS_THAN_1_MILLION)) {
      const firstPart = HALF_MILLION.percentage(FIVE);
      const secondPart = (propPriceCurrencyObj.subtract(HALF_MILLION)).percentage(TEN);
      return (firstPart).add(secondPart);
    } else {
      return propPriceCurrencyObj.percentage(TWENTY);
    }
  }
}

module.exports = CanadianMinimumDwnPmtCalculator;
