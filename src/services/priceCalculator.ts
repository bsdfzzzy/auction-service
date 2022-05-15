// This file is fake code for price calculator. And the logic is a fake one. In fact, we should also care about 图录费、个人所得税、运输费等。

export const calculatePrice = (good) => {
  return good.totalPrice - good.securityDeposit;
};
