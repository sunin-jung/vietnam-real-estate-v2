'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { Property, SearchFilters } from '@/types';
import { propertyApi } from '@/utils/api';
import { useAdminStore } from '@/lib/store';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn } = useAdminStore();

  useEffect(() => {
    // URL 파라미터에서 필터 가져오기
    const search = searchParams.get('search') || '';
    const region = searchParams.get('region') || '';
    const transaction_type = searchParams.get('transaction_type') as 'sale' | 'rent' | undefined;
    const property_type = searchParams.get('property_type') || '';
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined;
    const minArea = searchParams.get('minArea') ? parseInt(searchParams.get('minArea')!) : undefined;
    const maxArea = searchParams.get('maxArea') ? parseInt(searchParams.get('maxArea')!) : undefined;

    setFilters({
      search,
      region,
      transaction_type,
      property_type,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const data = await propertyApi.getAll(filters);
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  const regions = [
    '호치민',
    '하노이',
    '다낭',
    '하이퐁',
    '나트랑',
    '푸꾸옥',
    '기타'
  ];

  const propertyTypes = [
    'Apartment',
    'House',
    'Villa',
    'Office',
    'Shop',
    'Land',
    'Other'
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

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
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          매물 검색
        </h1>
        <p className="text-lg text-gray-600">
          베트남 전역의 다양한 부동산 매물을 찾아보세요
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 검색어 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색어
            </label>
            <input
              type="text"
              placeholder="매물명 또는 설명"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 지역 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              지역
            </label>
            <select
              value={filters.region || ''}
              onChange={(e) => handleFilterChange('region', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">전체 지역</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* 거래 유형 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거래 유형
            </label>
            <select
              value={filters.transaction_type || ''}
              onChange={(e) => handleFilterChange('transaction_type', e.target.value as 'sale' | 'rent' | undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">전체</option>
              <option value="sale">매매</option>
              <option value="rent">임대</option>
            </select>
          </div>

          {/* 매물 유형 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              매물 유형
            </label>
            <select
              value={filters.property_type || ''}
              onChange={(e) => handleFilterChange('property_type', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">전체</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 가격 및 면적 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최소 가격 (VND)
            </label>
            <input
              type="number"
              placeholder="최소 가격"
              value={filters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대 가격 (VND)
            </label>
            <input
              type="number"
              placeholder="최대 가격"
              value={filters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최소 면적 (m²)
            </label>
            <input
              type="number"
              placeholder="최소 면적"
              value={filters.minArea || ''}
              onChange={(e) => handleFilterChange('minArea', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대 면적 (m²)
            </label>
            <input
              type="number"
              placeholder="최대 면적"
              value={filters.maxArea || ''}
              onChange={(e) => handleFilterChange('maxArea', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* 필터 초기화 버튼 */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            필터 초기화
          </button>
        </div>
      </div>

      {/* 결과 */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            검색 결과 ({properties.length}개)
          </h2>
          {isLoggedIn && (
            <div className="text-sm text-gray-600">
              관리자 모드: 수정/삭제 버튼이 표시됩니다
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">매물을 불러오는 중...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">검색 조건에 맞는 매물이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
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
      </div>
    </div>
  );
} 