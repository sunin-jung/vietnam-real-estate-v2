'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Property } from '@/types';
import { propertyApi, adminApi } from '@/utils/api';
import { useAdminStore } from '@/lib/store';

export default function PropertyDetailPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;
  const { isLoggedIn } = useAdminStore();

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const data = await propertyApi.getById(propertyId);
        if (data) {
          setProperty(data);
        } else {
          setError('매물을 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setError('매물 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const nextImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // 매물 삭제 함수
  const handleDelete = async () => {
    if (!property) return;
    
    const confirmed = window.confirm(
      `"${property.title}" 매물을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      const success = await propertyApi.delete(property.id);
      if (success) {
        alert('매물이 성공적으로 삭제되었습니다.');
        router.push('/properties');
      } else {
        alert('매물 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('매물 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-gray-600">매물 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{error || '매물을 찾을 수 없습니다.'}</p>
          <Link
            href="/properties"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            매물 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 뒤로가기 버튼 */}
      <div className="flex justify-between items-center">
        <Link
          href="/properties"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          ← 매물 목록으로 돌아가기
        </Link>
        
        {/* 관리자용 수정/삭제 버튼 */}
        {isLoggedIn && (
          <div className="flex space-x-3">
            <Link
              href={`/admin/${property.id}/edit`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              ✏️ 수정
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? '삭제 중...' : '🗑️ 삭제'}
            </button>
          </div>
        )}
      </div>

      {/* 매물 제목 및 기본 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {property.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(property.price)}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                property.transaction_type === 'sale' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {property.transaction_type === 'sale' ? '매매' : '임대'}
              </span>
              <span className="text-sm text-gray-600">
                {property.area}m²
              </span>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <span className="mr-2">📍</span>
              <span>{property.region}</span>
              <span className="mx-2">•</span>
              <span>{property.property_type}</span>
            </div>
          </div>

          <div className="lg:ml-6 mt-4 lg:mt-0">
            <div className="text-sm text-gray-500">
              <p>등록일: {formatDate(property.created_at)}</p>
              <p>수정일: {formatDate(property.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 이미지 슬라이더 */}
      {property.images && property.images.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            {/* 메인 이미지 */}
            <div className="relative h-96 lg:h-[500px] bg-gray-200">
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.title} - 이미지 ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/800x500?text=이미지+없음';
                }}
              />
              
              {/* 슬라이드 네비게이션 버튼 */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                  >
                    →
                  </button>
                </>
              )}
              
              {/* 이미지 인디케이터 */}
              {property.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex 
                          ? 'bg-white' 
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 썸네일 이미지들 */}
            {property.images.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex 
                          ? 'border-primary-500' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`썸네일 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/80x64?text=이미지+없음';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 매물 상세 정보 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 매물 설명 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              매물 상세 정보
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          </div>
        </div>

        {/* 매물 요약 정보 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              매물 요약
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">거래 유형</span>
                <span className="font-medium">
                  {property.transaction_type === 'sale' ? '매매' : '임대'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">매물 유형</span>
                <span className="font-medium">{property.property_type}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">지역</span>
                <span className="font-medium">{property.region}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">면적</span>
                <span className="font-medium">{property.area}m²</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">가격</span>
                <span className="font-medium text-primary-600">
                  {formatPrice(property.price)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">등록일</span>
                <span className="font-medium">{formatDate(property.created_at)}</span>
              </div>
            </div>

            {/* 문의하기 버튼 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-md font-medium transition-colors">
                📞 문의하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 관련 매물 (같은 지역) */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {property.region} 지역의 다른 매물
        </h2>
        <p className="text-gray-600">
          같은 지역의 다른 매물을 확인해보세요.
        </p>
        <div className="mt-4">
          <Link
            href={`/properties?region=${encodeURIComponent(property.region)}`}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            {property.region} 지역 매물 더 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
} 