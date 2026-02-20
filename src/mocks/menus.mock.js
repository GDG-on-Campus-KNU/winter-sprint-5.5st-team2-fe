export const fallbackImage =
  'https://image.msscdn.net/thumbnails/images/goods_img/20250911/5445378/5445378_17586088969585_big.jpg?w=1200';

const baseMockMenus = [
  {
    id: '101',
    brand: '사일프레이',
    category: '상의',
    name: 'Graphic Zip Up Hoodie / Ivory',
    rating: 4.8,
    color: 'Ivory',
    colorHex: '#F6F1E6',
    sizes: ['S', 'M', 'L', 'XL'],
    originalPrice: 148000,
    discountRate: 23,
    imageUrl:
      'https://image.msscdn.net/thumbnails/images/goods_img/20250911/5445378/5445378_17586088969585_big.jpg?w=1200',
    stock: 12,
    available: true,
    description: '데일리로 입기 좋은 그래픽 후드 집업입니다.',
  },
  {
    id: '102',
    brand: '미드나잇 무브',
    category: '상의',
    name: 'horse hood zip up (white)',
    rating: 4.6,
    color: 'White',
    colorHex: '#FFFFFF',
    sizes: ['S', 'M', 'L'],
    originalPrice: 99000,
    discountRate: 25,
    imageUrl:
      'https://image.msscdn.net/thumbnails/images/goods_img/20251229/5859932/5859932_17670103254685_big.jpg?w=1200',
    stock: 8,
    available: true,
    description: '부드러운 원단감과 루즈한 실루엣이 특징인 후드 집업입니다.',
  },
  {
    id: '103',
    brand: '게인스보로',
    category: '상의',
    name: '아플리케 스타로고 후드집업_오트밀',
    rating: 4.5,
    color: 'Oatmeal',
    colorHex: '#DED5C4',
    sizes: ['M', 'L', 'XL'],
    originalPrice: 85000,
    discountRate: 51,
    imageUrl:
      'https://image.msscdn.net/thumbnails/images/goods_img/20240117/3800636/3800636_17425227643808_big.jpg?w=1200',
    stock: 20,
    available: true,
    description: '스타 로고 포인트가 들어간 캐주얼 무드의 후드집업입니다.',
  },
  {
    id: '104',
    brand: '피지컬 디파트먼트',
    category: '상의',
    name: '체크 스타테일 엘보우 패치 후드집업_그레이',
    rating: 4.7,
    color: 'Gray',
    colorHex: '#8D9097',
    sizes: ['S', 'M', 'L'],
    originalPrice: 89000,
    discountRate: 45,
    imageUrl:
      'https://image.msscdn.net/thumbnails/images/goods_img/20250122/4738347/4738347_17567941187869_big.jpg?w=1200',
    stock: 5,
    available: true,
    description: '엘보우 패치 디테일이 돋보이는 그래이 컬러 후드집업입니다.',
  },
  {
    id: '105',
    brand: '미드나잇 무브',
    category: '상의',
    name: 'horse hood zip up (white) 2nd',
    rating: 4.4,
    color: 'White',
    colorHex: '#FFFFFF',
    sizes: ['S', 'M', 'L'],
    originalPrice: 99000,
    discountRate: 25,
    imageUrl:
      'https://image.msscdn.net/thumbnails/images/goods_img/20251229/5859932/5859932_17670103254685_big.jpg?w=1200',
    stock: 0,
    available: false,
    description: '동일 라인의 추가 컬러/물량 상품입니다.',
  },
  {
    id: '106',
    brand: '피지컬 디파트먼트',
    category: '상의',
    name: '체크 스타테일 엘보우 패치 후드집업_그레이 2nd',
    rating: 4.3,
    color: 'Gray',
    colorHex: '#8D9097',
    sizes: ['M', 'L'],
    originalPrice: 89000,
    discountRate: 45,
    imageUrl:
      'https://image.msscdn.net/thumbnails/images/goods_img/20250122/4738347/4738347_17567941187869_big.jpg?w=1200',
    stock: 11,
    available: true,
    description: '인기 상품 리오더 버전입니다.',
  },
];

const enrichMenu = (menu) => {
  const price = Math.round(menu.originalPrice * (1 - menu.discountRate / 100));
  const galleryImages = [menu.imageUrl, menu.imageUrl, menu.imageUrl];
  return {
    ...menu,
    price,
    galleryImages,
    detailImages: galleryImages,
  };
};

export const mockMenuList = baseMockMenus.map(enrichMenu);

export const mockMenus = Object.fromEntries(
  mockMenuList.map((menu) => [menu.id, menu]),
);
