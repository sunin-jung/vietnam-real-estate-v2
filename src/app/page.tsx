'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Property } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import { propertyApi } from '@/utils/api';
import { useAdminStore } from '@/lib/store';

const regions = [
  '호치민',
  '하노이', 
  '다낭',
  '하이퐁',
  '나트랑',
  '푸꾸옥'
];

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn } = useAdminStore();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const data = await propertyApi.getAll();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // 컴포넌트 마운트 시와 searchParams 변경 시에만 실행
    fetchProperties();
  }, [searchParams]);

  // 최신 매물 3개만 표시 (이미 API에서 최신순으로 정렬됨)
  const latestProperties = properties.slice(0, 3);

  // 매물 삭제 함수
  const handleDelete = async (id: string) => {
    const property = properties.find(p => p.id === id);
    if (!property) return;
    
    const confirmed = window.confirm(
      `"${property.title}" 매물을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );
    
    if (!confirmed) return;
    
    setIsDeleting(id);
    try {
      const success = await propertyApi.delete(id);
      if (success) {
        setProperties(properties.filter(p => p.id !== id));
        alert('매물이 성공적으로 삭제되었습니다.');
      } else {
        alert('매물 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('매물 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* 지역별 카테고리 */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          지역별 매물
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {regions.map((region) => (
            <Link
              key={region}
              href={`/properties?region=${encodeURIComponent(region)}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{region}</h3>
              <p className="text-sm text-gray-600">매물 보기</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 히어로 섹션 */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          베트남 부동산
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          베트남 최고의 부동산 매물을 찾아보세요
        </p>
        <Link
          href="/properties"
          className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          매물 검색하기
        </Link>
      </section>

      {/* 신규 매물 */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            신규 매물
          </h2>
          <div className="flex items-center space-x-4">
            {isLoggedIn && (
              <div className="text-sm text-gray-600">
                관리자 모드
              </div>
            )}
            <Link
              href="/properties"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              전체 보기 →
            </Link>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">매물을 불러오는 중...</p>
          </div>
        ) : latestProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">등록된 매물이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                showActions={isLoggedIn}
                onDelete={handleDelete}
                isDeleting={isDeleting === property.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* 서비스 소개 */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          왜 Vietnam Real Estate인가요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">다양한 매물</h3>
            <p className="text-gray-600">
              베트남 전역의 다양한 부동산 매물을 제공합니다
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">정확한 검색</h3>
            <p className="text-gray-600">
              지역, 가격, 면적 등 세부 조건으로 원하는 매물을 찾으세요
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">전문 서비스</h3>
            <p className="text-gray-600">
              베트남 부동산 전문가들이 신뢰할 수 있는 정보를 제공합니다
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 