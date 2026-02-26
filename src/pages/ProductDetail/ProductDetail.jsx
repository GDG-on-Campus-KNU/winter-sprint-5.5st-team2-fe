import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addToCart } from '../../api/cart';
import { shouldUseMock } from '../../api/client';
import { getMenuDetail } from '../../api/menus';
import { createOrder } from '../../api/orders';
import ProductDetailImages from '../../components/product/ProductDetailImages';
import ProductSummary from '../../components/product/ProductSummary';
import { fallbackImage, mockMenus } from '../../mocks/menus.mock';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  //api 연동 전 임시 로직 추가
  useEffect(() => {
    // 1. Mock 데이터 사용 시 로직
    if (shouldUseMock) {
      setIsLoading(true); // 로딩 시작

      const defaultMockProduct = Object.values(mockMenus)[0];
      const mockProduct = mockMenus[id] ?? defaultMockProduct;

      const timer = setTimeout(() => {
        setProduct(mockProduct);
        setError('');
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }

    const controller = new AbortController();

    const fetchProductDetail = async () => {
      try {
        setIsLoading(true);
        setError('');
        const menu = await getMenuDetail(id, controller.signal);

        setProduct({
          id: String(menu?.id ?? id),
          brand: menu?.brand ?? 'GDG SELECT',
          category: menu?.category ?? '카테고리',
          name: menu?.name ?? '상품명',
          rating: Number(menu?.rating ?? 4.5),
          color: menu?.color ?? 'Black',
          colorHex: menu?.colorHex ?? '#111111',
          sizes: menu?.sizes ?? ['S', 'M', 'L'],
          originalPrice: Number(menu?.originalPrice ?? menu?.price ?? 0),
          discountRate: Number(menu?.discountRate ?? 0),
          imageUrl: menu?.imageUrl ?? menu?.image ?? fallbackImage,
          description: menu?.description ?? '',
          stock: Number(menu?.stock ?? 0),
          status: menu?.status ?? '',
          available: menu?.available ?? true,
          detailImages: menu?.detailImages ?? menu?.images ?? [],
          galleryImages: menu?.galleryImages ??
            menu?.productImages ?? [
              menu?.imageUrl ?? menu?.image ?? fallbackImage,
            ],
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('상품 정보를 불러오지 못했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();

    return () => controller.abort();
  }, [id]);

  if (isLoading) {
    return (
      <section className="page">
        <div className="contentWrap">
          <ProductSummary isLoading={true} isSubmitting={false} />
        </div>
      </section>
    );
  }

  if (error || !product) {
    return <section className="page">{error || '상품이 없습니다.'}</section>;
  }

  const detailImages =
    product.detailImages && product.detailImages.length > 0
      ? product.detailImages
      : [product.imageUrl];

  const handleAddToCart = async ({ menuId, quantity }) => {
    const payload = {
      menuId: Number(menuId),
      quantity,
    };

    try {
      setIsSubmitting(true);
      if (!shouldUseMock) {
        await addToCart(payload);
      }
      navigate('/cart', { state: { payload } });
    } catch {
      alert('장바구니 담기에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = async ({ menuId, quantity }) => {
    const payload = {
      orderItems: [
        {
          menuId: Number(menuId),
          quantity,
        },
      ],
      couponId: null,
    };

    try {
      setIsSubmitting(true);
      if (!shouldUseMock) {
        await createOrder(payload);
      }
      navigate('/checkout', { state: { payload } });
    } catch {
      alert('구매 요청에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page">
      <div className="contentWrap">
        <ProductSummary
          product={product}
          isSubmitting={isSubmitting}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
        <ProductDetailImages images={detailImages} name={product.name} />
      </div>
    </section>
  );
};

export default ProductDetail;
