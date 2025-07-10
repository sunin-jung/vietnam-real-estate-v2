'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminStore } from '@/lib/store';
import { PropertyFormData, Property } from '@/types';
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { isLoggedIn } = useAdminStore();

  // 기본 이미지 URL들 (매물 유형별)
  const defaultImages = {
    'Apartment': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
    'House_Villa': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500',
    'Office_Shop': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
    'Land_Other': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500'
  };

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

  // 매물 유형이 변경될 때 기본 이미지 추가
  useEffect(() => {
    // 기본 이미지 자동 추가 기능 제거
  }, [formData.property_type]);

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

  // 매물 유형 옵션 (통합된 형태)
  const propertyTypes = [
    { value: 'Apartment', label: '아파트먼트' },
    { value: 'House_Villa', label: '주택/빌라' },
    { value: 'Office_Shop', label: '상업시설/오피스' },
    { value: 'Land_Other', label: '토지/기타' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'area' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isClient) return;
    
    const files = Array.from(e.target.files || []);
    
    // 이미지 파일만 필터링
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (2MB로 줄임)
    const validFiles = imageFiles.filter(file => file.size <= 2 * 1024 * 1024);
    
    if (validFiles.length !== imageFiles.length) {
      alert('일부 파일이 2MB 제한을 초과하여 제외되었습니다.');
    }

    try {
      // localStorage 정리
      checkAndCleanStorage();
      
      // 파일들을 Base64로 변환
      const base64Images = await Promise.all(
        validFiles.map(async (file) => {
          try {
            return await fileToBase64(file);
          } catch (error) {
            console.error('이미지 변환 오류:', error);
            // 변환 실패 시 기본 이미지 사용
            return defaultImages[formData.property_type as keyof typeof defaultImages];
          }
        })
      );

      // 새 파일 추가
      setImageFiles(prev => [...prev, ...validFiles]);

      // 미리보기 URL 생성 (클라이언트 사이드에서만)
      const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);

      // formData에 Base64 이미지 추가
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));

      console.log('이미지 추가됨:', base64Images.length, '개');
    } catch (error) {
      console.error('이미지 처리 오류:', error);
      alert('이미지 처리 중 오류가 발생했습니다.');
    }
  };

  const handleImageRemove = (index: number) => {
    if (!isClient) return;
    
    // 파일 제거
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    
    // 미리보기 URL 제거 및 메모리 해제 (클라이언트 사이드에서만)
    const urlToRemove = imagePreviewUrls[index];
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    // formData에서 제거
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // 파일을 Base64로 변환하는 함수 (압축 포함)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // 이미지 크기 조정 (최대 800px)
        const maxSize = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // 이미지 그리기 (품질 0.7로 압축)
        ctx?.drawImage(img, 0, 0, width, height);
        
        // JPEG 형식으로 압축 (품질 0.7)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => reject(new Error('이미지 로드 실패'));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsDataURL(file);
    });
  };

  // localStorage 용량 확인 및 정리
  const checkAndCleanStorage = () => {
    try {
      const stored = localStorage.getItem('vietnam-properties');
      if (stored) {
        const properties = JSON.parse(stored);
        
        // 매물이 50개를 초과하면 오래된 매물 삭제
        if (properties.length > 50) {
          const sortedProperties = properties.sort((a: Property, b: Property) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          
          // 최신 30개만 유지
          const cleanedProperties = sortedProperties.slice(0, 30);
          localStorage.setItem('vietnam-properties', JSON.stringify(cleanedProperties));
          console.log('localStorage 정리 완료: 오래된 매물 삭제됨');
        }
      }
    } catch (error) {
      console.error('localStorage 정리 중 오류:', error);
    }
  };

  // 이미지 순서 변경 함수들
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    // 이미지 파일 순서 변경
    setImageFiles(prev => {
      const newFiles = [...prev];
      const [movedFile] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedFile);
      return newFiles;
    });

    // 미리보기 URL 순서 변경
    setImagePreviewUrls(prev => {
      const newUrls = [...prev];
      const [movedUrl] = newUrls.splice(fromIndex, 1);
      newUrls.splice(toIndex, 0, movedUrl);
      return newUrls;
    });

    // formData 이미지 순서 변경
    setFormData(prev => {
      const newImages = [...prev.images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const moveImageUp = (index: number) => {
    if (index > 0) {
      moveImage(index, index - 1);
    }
  };

  const moveImageDown = (index: number) => {
    if (index < imageFiles.length - 1) {
      moveImage(index, index + 1);
    }
  };

  // 드래그 앤 드롭 이벤트 핸들러
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveImage(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('매물 등록 시작:', formData);

      // 필수 필드 검증
      if (!formData.title || !formData.description || !formData.price || !formData.area || !formData.region || !formData.property_type) {
        const missingFields = [];
        if (!formData.title) missingFields.push('매물명');
        if (!formData.description) missingFields.push('매물 설명');
        if (!formData.price) missingFields.push('가격');
        if (!formData.area) missingFields.push('면적');
        if (!formData.region) missingFields.push('지역');
        if (!formData.property_type) missingFields.push('매물 유형');
        
        setError(`다음 필드를 입력해주세요: ${missingFields.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // 가격과 면적이 0보다 큰지 확인
      if (formData.price <= 0) {
        setError('가격은 0보다 커야 합니다.');
        setIsLoading(false);
        return;
      }

      if (formData.area <= 0) {
        setError('면적은 0보다 커야 합니다.');
        setIsLoading(false);
        return;
      }

      // 이미지 처리 - 기본 이미지 자동 추가 제거
      let finalImages = [...formData.images];

      console.log('제출할 이미지 개수:', finalImages.length);
      if (finalImages.length > 0) {
        console.log('첫 번째 이미지:', finalImages[0]?.substring(0, 50) + '...');
        console.log('이미지 타입 확인:', finalImages[0]?.startsWith('data:image/') ? 'Base64' : 'URL');
      } else {
        console.log('등록된 이미지가 없습니다.');
      }

      const submitData = {
        ...formData,
        images: finalImages
      };

      console.log('API 호출 전 데이터:', {
        title: submitData.title,
        property_type: submitData.property_type,
        imageCount: submitData.images.length,
        firstImageType: submitData.images[0]?.startsWith('data:image/') ? 'Base64' : 'URL'
      });

      const newProperty = await propertyApi.create(submitData);
      
      console.log('API 응답:', {
        success: !!newProperty,
        returnedImageCount: newProperty?.images?.length,
        firstReturnedImage: newProperty?.images?.[0]?.substring(0, 50) + '...'
      });
      
      if (newProperty) {
        alert('매물이 성공적으로 등록되었습니다.');
        router.push('/admin/dashboard');
      } else {
        setError('매물 등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      
      // 오류 메시지 개선
      if (error instanceof Error) {
        setError(`매물 등록 중 오류가 발생했습니다: ${error.message}`);
      } else {
        setError('매물 등록 중 알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
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
                  <option key={type.value} value={type.value}>
                    {type.label}
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
                  최대 5MB까지, 여러 파일 선택 가능. 이미지를 선택하지 않으면 매물 유형에 맞는 기본 이미지가 사용됩니다.
                </p>
              </div>
              
              {imagePreviewUrls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div 
                      key={index} 
                      className="relative group"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <img
                        src={url}
                        alt={`매물 이미지 ${index + 1}`}
                        className={`w-full h-32 object-cover rounded-md cursor-move transition-opacity ${
                          draggedIndex === index ? 'opacity-50' : ''
                        }`}
                      />
                      
                      {/* 이미지 순서 표시 */}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                      
                      {/* 순서 변경 버튼들 */}
                      <div className="absolute top-2 left-2 flex space-x-1">
                        <button
                          type="button"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white w-6 h-6 rounded text-xs font-bold transition-colors"
                          title="위로 이동"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImageDown(index)}
                          disabled={index === imagePreviewUrls.length - 1}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white w-6 h-6 rounded text-xs font-bold transition-colors"
                          title="아래로 이동"
                        >
                          ↓
                        </button>
                      </div>
                      
                      {/* 삭제 버튼 */}
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute top-2 left-16 bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                        title="이미지 삭제"
                      >
                        ×
                      </button>
                      
                      {/* 드래그 안내 */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        드래그하여 순서 변경
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {imagePreviewUrls.length === 0 && (
                <p className="text-sm text-gray-500">
                  이미지 파일을 선택하여 매물 사진을 등록할 수 있습니다. 선택하지 않으면 매물 유형에 맞는 기본 이미지가 사용됩니다.
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