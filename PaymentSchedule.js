class PaymentSchedule {
  static AcceleratedBiWeekly = new PaymentSchedule('accelerated bi-weekly', 26);
  static BiWeekly = new PaymentSchedule('bi-weekly', 26);
  static Monthly = new PaymentSchedule('monthly', 12);
  
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  
  static isValid(name) {
    return Object.values(PaymentSchedule).map(v => v.name).includes(name);
  }
  
  static getValidNames() {
    return Object.values(PaymentSchedule).map(v => v.name).join();
  }
  
  static getPaymentSchedule(name) {
    return Object.freeze(Object.values(PaymentSchedule).find(v => v.name===name));
  }
}

module.exports = PaymentSchedule;