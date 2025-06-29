'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/lib/store';
import { PropertyFormData } from '@/types';
import { propertyApi } from '@/utils/api';

// 동적 렌더링 설정
export const dynamic = 'force-dynamic';

export default function AdminCreatePage() {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    area: 0,
    region: '',
    transaction_type: 'sale',
    property_type: 'Apartment',
    images: [],
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isLoggedIn } = useAdminStore();

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 로그인 상태 확인
  useEffect(() => {
    if (isClient && !isLoggedIn) {
      router.push('/admin/login');
    }
  }, [isClient, isLoggedIn, router]);

  // 컴포넌트 언마운트 시 URL 객체 정리
  useEffect(() => {
    return () => {
      if (isClient) {
        imagePreviewUrls.forEach(url => {
          if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });
      }
    };
  }, [isClient, imagePreviewUrls]);

  if (!isClient || !isLoggedIn) {
    return null;
  }

  const regions = [
    '호치민',
    '하노이',
    '다낭',
    '하이퐁',
    '나트랑',
    '푸꾸옥',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'area' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isClient) return;
    
    const files = Array.from(e.target.files || []);
    
    // 이미지 파일만 필터링
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (5MB)
    const validFiles = imageFiles.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== imageFiles.length) {
      alert('일부 파일이 5MB 제한을 초과하여 제외되었습니다.');
    }

    // 기존 파일과 새 파일 합치기
    const newFiles = [...imageFiles, ...validFiles];
    setImageFiles(newFiles);

    // 미리보기 URL 생성 (클라이언트 사이드에서만)
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);

    // formData에 이미지 URL 추가 (실제로는 파일을 업로드하지만, 여기서는 임시 URL 사용)
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newPreviewUrls],
    }));
  };

  const handleImageRemove = (index: number) => {
    if (!isClient) return;
    
    // 파일 제거
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    
    // 미리보기 URL 제거 및 메모리 해제 (클라이언트 사이드에서만)
    const urlToRemove = imagePreviewUrls[index];
    if (urlToRemove) {
      URL.revokeObjectURL(urlToRemove);
    }
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // formData에서 제거
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 필수 필드 검증
      if (!formData.title || !formData.description || !formData.price || !formData.area || !formData.region) {
        setError('모든 필수 필드를 입력해주세요.');
        return;
      }

      // 실제 구현에서는 파일을 서버에 업로드하고 URL을 받아와야 함
      // 여기서는 임시로 미리보기 URL을 사용
      const newProperty = await propertyApi.create(formData);
      
      if (newProperty) {
        alert('매물이 성공적으로 등록되었습니다.');
        router.push('/?refresh=' + Date.now());
      } else {
        setError('매물 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      setError('매물 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            새 매물 등록
          </h1>
          <p className="text-gray-600 mt-2">
            새로운 매물 정보를 입력하세요.
          </p>
        </div>
        <Link
          href="/admin/dashboard"
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          ← 대시보드로 돌아가기
        </Link>
      </div>

      {/* 매물 등록 폼 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                매물명 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="매물명을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                지역 *
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">지역을 선택하세요</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                거래 유형 *
              </label>
              <select
                name="transaction_type"
                value={formData.transaction_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="sale">매매</option>
                <option value="rent">임대</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                매물 유형 *
              </label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                가격 (VND) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="가격을 입력하세요"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                면적 (m²) *
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="면적을 입력하세요"
                min="0"
                required
              />
            </div>
          </div>

          {/* 매물 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              매물 설명 *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="매물에 대한 상세한 설명을 입력하세요"
              required
            />
          </div>

          {/* 이미지 관리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              매물 이미지
            </label>
            <div className="space-y-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  📁 이미지 파일 선택
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  최대 5MB까지, 여러 파일 선택 가능
                </p>
              </div>
              
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`매물 이미지 ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 left-2 bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {imagePreviewUrls.length === 0 && (
                <p className="text-sm text-gray-500">
                  이미지 파일을 선택하여 매물 사진을 등록할 수 있습니다.
                </p>
              )}
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/dashboard"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '등록 중...' : '매물 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 