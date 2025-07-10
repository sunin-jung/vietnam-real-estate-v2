'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/lib/store';
import { Property } from '@/types';
import { propertyApi, adminApi } from '@/utils/api';

export default function AdminDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const router = useRouter();
  const { isLoggedIn, username } = useAdminStore();

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = async () => {
      if (!isLoggedIn) {
        router.push('/admin/login');
        return;
      }
      
      // 매물 데이터 로드
      fetchProperties();
    };

    checkAuth();
  }, [isLoggedIn, router]);

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

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 매물을 삭제하시겠습니까?')) {
      return;
    }

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

  // 매물 유형을 한글로 변환 (통합된 형태)
  const getPropertyTypeLabel = (propertyType: string) => {
    const typeMapping = {
      'Apartment': '아파트먼트',
      'House_Villa': '주택/빌라',
      'Office_Shop': '상업시설/오피스',
      'Land_Other': '토지/기타'
    };
    return typeMapping[propertyType as keyof typeof typeMapping] || propertyType;
  };

  // 통합된 매물 유형별 통계 계산
  const getPropertyTypeStats = () => {
    const stats = {
      '아파트먼트': 0,
      '주택/빌라': 0,
      '상업시설/오피스': 0,
      '토지/기타': 0
    };

    properties.forEach(property => {
      const label = getPropertyTypeLabel(property.property_type);
      if (stats[label as keyof typeof stats] !== undefined) {
        stats[label as keyof typeof stats]++;
      }
    });

    return stats;
  };

  const propertyTypeStats = getPropertyTypeStats();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
          <Link
            href="/admin/login"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            관리자 대시보드
          </h1>
          <p className="text-gray-600 mt-2">
            안녕하세요, {username}님! 매물을 관리하세요.
          </p>
        </div>
        <Link
          href="/admin/create"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        >
          + 새 매물 등록
        </Link>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">총 매물</h3>
          <p className="text-3xl font-bold text-primary-600">{properties.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">매매 매물</h3>
          <p className="text-3xl font-bold text-blue-600">
            {properties.filter(p => p.transaction_type === 'sale').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">임대 매물</h3>
          <p className="text-3xl font-bold text-green-600">
            {properties.filter(p => p.transaction_type === 'rent').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900">이번 달 등록</h3>
          <p className="text-3xl font-bold text-purple-600">
            {properties.filter(p => {
              const createdDate = new Date(p.created_at);
              const now = new Date();
              return createdDate.getMonth() === now.getMonth() && 
                     createdDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* 매물 유형별 통계 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">매물 유형별 통계</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{propertyTypeStats['아파트먼트']}</div>
            <div className="text-sm text-gray-600">아파트먼트</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{propertyTypeStats['주택/빌라']}</div>
            <div className="text-sm text-gray-600">주택/빌라</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{propertyTypeStats['상업시설/오피스']}</div>
            <div className="text-sm text-gray-600">상업시설/오피스</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{propertyTypeStats['토지/기타']}</div>
            <div className="text-sm text-gray-600">토지/기타</div>
          </div>
        </div>
      </div>

      {/* 매물 목록 */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">매물 관리</h2>
        </div>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-600">매물을 불러오는 중...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-600">등록된 매물이 없습니다.</p>
            <Link
              href="/admin/create"
              className="inline-block mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              첫 매물 등록하기
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    매물 정보
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    지역
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    거래 유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {property.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getPropertyTypeLabel(property.property_type)} • {property.area}m²
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(property.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {property.region}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.transaction_type === 'sale'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {property.transaction_type === 'sale' ? '매매' : '임대'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(property.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/${property.id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          disabled={isDeleting === property.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {isDeleting === property.id ? '삭제 중...' : '삭제'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 