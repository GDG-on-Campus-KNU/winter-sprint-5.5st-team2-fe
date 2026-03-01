// src/mocks/coupons.mock.js
export const MOCK_COUPON_RESPONSE = {
  success: true,
  data: [
    {
      id: 1,
      couponName: '설날 기념 10% 할인',
      discountType: 'PERCENT', // PERCENT | FIXED
      discountValue: 10,
      isUsed: false,
      expiryDate: '2026-12-31T23:59:59.000Z',
    },
    {
      id: 2,
      couponName: '신규회원 3,000원 할인',
      discountType: 'FIXED',
      discountValue: 3000,
      isUsed: false,
      expiryDate: '2026-06-30T23:59:59.000Z',
    },
    {
      id: 3,
      couponName: '배송비 지원 쿠폰',
      discountType: 'FIXED',
      discountValue: 2500,
      isUsed: true,
      expiryDate: '2025-12-31T23:59:59.000Z',
    },

    // 스크롤 테스트용 자동 생성 (15개)
    ...Array.from({ length: 15 }).map((_, idx) => {
      const n = idx + 4;
      return {
        id: n,
        couponName: `테스트 쿠폰 ${n}`,
        discountType: idx % 2 === 0 ? 'PERCENT' : 'FIXED',
        discountValue: idx % 2 === 0 ? 5 + (idx % 10) : 1000 * ((idx % 5) + 1),
        isUsed: idx % 4 === 0, // 일부 USED
        expiryDate: '2026-12-31T23:59:59.000Z',
      };
    }),
  ],
  error: null,
};
