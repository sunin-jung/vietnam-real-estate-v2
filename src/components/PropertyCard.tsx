'use client';

import Link from 'next/link';
import { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export default function PropertyCard({ property, showActions = false, onDelete, isDeleting = false }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number) => {
    return `${area}m²`;
  };

  // 매물 유형을 한글로 변환
  const getPropertyTypeLabel = (propertyType: string) => {
    const typeMapping = {
      'Apartment': '아파트먼트',
      'House_Villa': '주택/빌라',
      'Office_Shop': '상업시설/오피스',
      'Land_Other': '토지/기타'
    };
    return typeMapping[propertyType as keyof typeof typeMapping] || propertyType;
  };

  // 기본 이미지 URL들
  const defaultImages = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500',
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500'
  ];

  // 이미지 URL 검증 및 기본 이미지 제공
  const getValidImageUrl = (images: string[] | undefined) => {
    console.log('PropertyCard 이미지 처리:', {
      propertyId: property.id,
      title: property.title,
      imageCount: images?.length,
      firstImage: images?.[0]?.substring(0, 50) + '...'
    });

    if (!images || images.length === 0) {
      // 기본 이미지 사용하지 않음 - null 반환
      console.log('이미지가 없음');
      return null;
    }
    
    // 첫 번째 이미지가 유효한지 확인
    const firstImage = images[0];
    if (firstImage) {
      // Base64 이미지인지 확인
      if (firstImage.startsWith('data:image/')) {
        console.log('Base64 이미지 사용');
        return firstImage;
      }
      // HTTP URL인지 확인
      if (firstImage.startsWith('http')) {
        console.log('HTTP URL 이미지 사용');
        return firstImage;
      }
    }
    
    // 유효하지 않으면 null 반환
    console.log('유효하지 않은 이미지');
    return null;
  };

  const imageUrl = getValidImageUrl(property.images);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* 이미지 - 클릭 가능한 링크로 감싸기 */}
      <Link href={`/properties/${property.id}`} className="block">
        <div className="relative h-48 bg-gray-200 cursor-pointer group">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // 에러 발생 시 이미지 영역을 숨김
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          
          {/* 이미지가 없을 때 표시할 메시지 */}
          {!imageUrl && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-2">📷</div>
                <div className="text-sm">이미지 없음</div>
              </div>
            </div>
          )}
          
          {/* 거래 유형 배지 */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              property.transaction_type === 'sale' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {property.transaction_type === 'sale' ? '매매' : '임대'}
            </span>
          </div>
          
          {/* 호버 효과 - 상세보기 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
              상세보기
            </span>
          </div>
        </div>
      </Link>

      {/* 매물 정보 */}
      <div className="p-4">
        <Link href={`/properties/${property.id}`} className="block">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors cursor-pointer">
            {property.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-600 mb-2">
          <span className="mr-2">📍</span>
          <span>{property.region}</span>
          <span className="mx-2">•</span>
          <span>{getPropertyTypeLabel(property.property_type)}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary-600">
            {formatPrice(property.price)}
          </span>
          <span className="text-sm text-gray-600">
            {formatArea(property.area)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {property.description}
        </p>
      </div>

      {/* 관리자 액션 버튼 */}
      {showActions && onDelete && (
        <div className="px-4 pb-4">
          <div className="flex space-x-2">
            <Link
              href={`/admin/${property.id}/edit`}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-md text-sm font-medium transition-colors"
            >
              ✏️ 수정
            </Link>
            <button
              onClick={() => onDelete(property.id)}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? '삭제 중...' : '🗑️ 삭제'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}