import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addToCart } from '../../api/cart';
import { shouldUseMock } from '../../api/client';
import { getMenuDetail } from '../../api/menus';
import { createOrder } from '../../api/orders';
import ProductDetailImages from '../../components/product/ProductDetailImages';
import ProductSummary from '../../components/product/ProductSummary';
import useCartStore from '../../store/useCartStore';
import { useToast } from '../../context/ToastContext';
import { fallbackImage, mockMenus } from '../../mocks/menus.mock';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const addCartItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (shouldUseMock) {
      const defaultMockProduct = Object.values(mockMenus)[0];
      const mockProduct = mockMenus[id] ?? defaultMockProduct;
      setProduct(mockProduct);
      setError('');
      setIsLoading(false);
      return;
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
    return <section className="page">불러오는 중...</section>;
  }

  if (error || !product) {
    return <section className="page">{error || '상품이 없습니다.'}</section>;
  }

  const detailImages =
    product.detailImages && product.detailImages.length > 0
      ? product.detailImages
      : [product.imageUrl];

  const handleAddToCart = async ({ menuId, quantity, selectedSize }) => {
    const payload = {
      menuId: Number(menuId),
      quantity,
    };

    try {
      setIsSubmitting(true);
      let createdCartItem = null;
      if (!shouldUseMock) {
        createdCartItem = await addToCart(payload);
      }
      addCartItem(product, quantity, selectedSize, createdCartItem?.cartItemId);
      showToast('장바구니에 담겼습니다.', 'success', {
        actions: [
          {
            label: '장바구니 이동',
            variant: 'primary',
            onClick: () => navigate('/cart'),
          },
        ],
      });
    } catch {
      showToast('장바구니 담기에 실패했습니다.', 'error');
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
