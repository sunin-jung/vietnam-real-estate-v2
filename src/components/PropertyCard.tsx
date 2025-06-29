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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* 이미지 */}
      <div className="relative h-48 bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=이미지+없음';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span>이미지 없음</span>
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
      </div>

      {/* 내용 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(property.price)}
          </span>
          <span className="text-sm text-gray-600">
            {formatArea(property.area)}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="mr-2">📍</span>
          <span>{property.region}</span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {property.description}
        </p>

        {/* 액션 버튼들 */}
        <div className="flex justify-between items-center">
          <Link
            href={`/properties/${property.id}`}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            상세보기
          </Link>
          
          {showActions && (
            <div className="flex space-x-2">
              <Link
                href={`/admin/${property.id}/edit`}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                수정
              </Link>
              <button
                onClick={() => onDelete?.(property.id)}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 