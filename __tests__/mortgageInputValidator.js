const MortInpValidator = require('../MortgageInputValidator');

function getTestReqObj() {
  let calcMortgageRequest = {
    propertyPrice: 200000,
    downPayment: 100000,
    annualInterestRate: 6,
    amortizationPeriod: 25,
    paymentSchedule: 'monthly',
    propertyPriceValid: true,
  }
  return calcMortgageRequest;
}

test("Sanity check", () => {
    expect(true).toBe(true);
});

describe("MortInpValidator", ()=>{

  const badValuesPropPrice = ['a', -1000, -1.2, 0, undefined, null, Infinity];
  test.each(badValuesPropPrice)(
    "validatePropertyPrice() returns false for invalid propertyPrice values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.propertyPrice = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validatePropertyPrice()).toBe(false);
    }
  );

  const goodValuesPropPrice = [1.1, 1, 123456789000000, '5000'];
  test.each(goodValuesPropPrice)(
    "validatePropertyPrice() returns true for valid propertyPrice values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.propertyPrice = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validatePropertyPrice()).toBe(true);
    }
  );

  const badValuesDownPmt = ['a', -1000, -1.2, 0, undefined, null, Infinity];
  test.each(badValuesDownPmt)(
    "validateDownPayment() returns false for invalid downPayment values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.downPayment = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validateDownPayment()).toBe(false);
    }
  );

  const goodValuesDownPmt = [1.1, 1, 123456789000000, '5000'];
  test.each(goodValuesDownPmt)(
    "validateDownPayment() returns true for valid downPayment values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.downPayment = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validateDownPayment()).toBe(true);
    }
  );

  // const valuesDwnPmtGreaterThanEqualToPropPrice = [
  //   [200000, 200000],
  //   [200000, 200001],
  // ];
  // test.each(valuesDwnPmtGreaterThanEqualToPropPrice)(
  //   "validateDownPayment() returns false for downPayment greater than or equal to propertyPrice",
  //   (fixture1, fixture2) => {
  //     let calcMortgageRequest = getTestReqObj();
  //     calcMortgageRequest.propertyPrice = fixture1;
  //     calcMortgageRequest.downPayment = fixture2;
  //     calcMortgageRequest.propertyPriceValid = true;
  //     expect(new MortInpValidator(calcMortgageRequest).validateDownPayment()).toBe(false);
  //   }
  // );
  // test("validateDownPayment() returns false for downPayment equal to propertyPrice", () => {
  //   let calcMortgageRequest = getTestReqObj();
  //   calcMortgageRequest.propertyPrice = 200000;
  //   calcMortgageRequest.downPayment = 200000;
  //   expect(new MortInpValidator(calcMortgageRequest).validateDownPayment()).toBe(false);
  // });

  // test("validateDownPayment() returns false for downPayment greater than propertyPrice", () => {
  //   expect(new MortInpValidator(1000, 1000.5, 2, 20, 'monthly').validateDownPayment()).toBe(false);
  // });

  const badValuesAnnualIntRate = ['a', -1000, -1.2, 0, undefined, null];
  test.each(badValuesAnnualIntRate)(
    "validateAnnualInterestRate() returns false for invalid annualInterestRate values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.annualInterestRate = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validateAnnualInterestRate()).toBe(false);
    }
  );

  const goodValuesAnnualIntRate = [4.231, 0.0001, 123456789000000, '5000'];
  test.each(goodValuesAnnualIntRate)(
    "validateAnnualInterestRate() returns true for valid annualInterestRate values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.annualInterestRate = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validateAnnualInterestRate()).toBe(true);
    }
  );

  const badValuesAmortizationPeriod = ['a', -1000, -1.2, 0, 5.00003, 7, 4, 31, undefined, null];
  test.each(badValuesAmortizationPeriod)(
    "validateAmortizationPeriod() returns false for invalid amortizationPeriod values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.amortizationPeriod = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validateAmortizationPeriod()).toBe(false);
    }
  );

  const goodValuesAmortizationPeriod = [5, 10, 25, 30, '20'];
  test.each(goodValuesAmortizationPeriod)(
    "validateAmortizationPeriod() returns true for valid amortizationPeriod values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.amortizationPeriod = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validateAmortizationPeriod()).toBe(true);
    }
  );
  
  const badValuesPmtSch = ['a', -1000, 0, 1, 'Accelerated bi-weekly', 'accelerated  bi-weekly', undefined, null];
  test.each(badValuesPmtSch)(
    "validatePaymentSchedule() returns false for invalid paymentSchedule values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.paymentSchedule = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validatePaymentSchedule()).toBe(false);
    }
  );

  const goodValuesPmtSch = ['accelerated bi-weekly', 'bi-weekly', 'monthly'];
  test.each(goodValuesPmtSch)(
    "validatePaymentSchedule() returns true for valid paymentSchedule values",
    (fixture) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.paymentSchedule = fixture;
      expect(new MortInpValidator(calcMortgageRequest).validatePaymentSchedule()).toBe(true);
    }
  );

  const badValuesMinDwnPmt = [
    [200000, 9999.99],
    [500000, 24999],
    [500323, 25031],
    [999999, 74999.8],
    [1000000, 199999],
  ];
  test.each(badValuesMinDwnPmt)(
    "isMinimumDownPayment() returns false when minimum down payment requirement is not met",
    (fixture1, fixture2) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.propertyPrice = fixture1;
      calcMortgageRequest.downPayment = fixture2;
      expect(new MortInpValidator(calcMortgageRequest).isMinimumDownPayment()).toBe(false);
    }
  );

  const goodValuesMinDwnPmt = [
    [200000, 10000],
    [500000, 25000],
    [500323, 25033],
    [999999, 75000],
    [1000000, 200000],
  ];  
  test.each(goodValuesMinDwnPmt)(
    "isMinimumDownPayment() returns true when minimum down payment requirement is met",
    (fixture1, fixture2) => {
      let calcMortgageRequest = getTestReqObj();
      calcMortgageRequest.propertyPrice = fixture1;
      calcMortgageRequest.downPayment = fixture2;
      expect(new MortInpValidator(calcMortgageRequest).isMinimumDownPayment()).toBe(true);
    }
  );
});