import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/Home/HeroBanner';
import BannerImg from '../assets/BannerImage.png';
import RecommendSection from '../components/Home/RecommendSection';
import { shouldUseMock } from '../api/client';
import { getProducts } from '../api/products';
import { mockMenuList } from '../mocks/menus.mock';

const PAGE_SIZE = 8;

export default function HomePage() {
  const navigate = useNavigate();

  const [sort, setSort] = useState('Newest');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (shouldUseMock) {
      setProducts(mockMenuList);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts(undefined, controller.signal);

        const normalized = (data ?? []).map((item) => ({
          id: String(item.id),
          imageUrl: item.imageUrl,
          brand: item.brand,
          name: item.name,
          discountRate: Number(item.discountRate ?? 0),
          price: Number(item.price ?? 0),
          createdAt: item.createdAt ?? null,
        }));

        setProducts(normalized);
      } catch (error) {
        console.error('상품 목록 조회 실패', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  const recommendProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        if (sort === 'Oldest') {
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
          return Number(a.id) - Number(b.id);
        }

        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return Number(b.id) - Number(a.id);
      }),
    [products, sort],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(recommendProducts.length / PAGE_SIZE),
  );
  const pagedProducts = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return recommendProducts.slice(startIndex, startIndex + PAGE_SIZE);
  }, [page, recommendProducts]);

  useEffect(() => {
    setPage(1);
  }, [sort]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div>
      <HeroBanner
        imageSrc={BannerImg}
        title="New Collection"
        sectionTitle="새로운 S/S 시즌을 경험하다"
        onClick={() => navigate('/event/ss')}
        isLoading={isLoading}
      />

      <RecommendSection
        title="오늘 들어온 상품"
        products={pagedProducts}
        isLoading={isLoading}
        sort={sort}
        onSortChange={(nextSort) => {
          setSort(nextSort);
        }}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onCardClick={(product) => navigate(`/products/${product.id}`)}
      />
    </div>
  );
}
