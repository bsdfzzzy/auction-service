// This file is fake code for GoodService. And the logic is a fake one. In fact, we should get the good info from GoodsStorageService.

export const getGoodInfo = async (goodId: string) => {
  return {
    id: '1',
    name: 'good1',
    totalPrice: 10000,
    securityDeposit: 1000,
  };
};
