import axios from 'axios';
import { Property, PropertyFormData, ApiResponse } from '@/types';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 관리자 토큰 추가
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('admin-token');
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

// 기본 이미지 URL들 (매물 유형별)
const defaultImages = {
  'Apartment': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
  'House_Villa': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500',
  'Office_Shop': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
  'Land_Other': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500'
};

// 매물 유형 매핑 (영어 -> 한글)
const propertyTypeMapping = {
  'Apartment': '아파트먼트',
  'House_Villa': '주택/빌라',
  'Office_Shop': '상업시설/오피스',
  'Land_Other': '토지/기타'
};

// 기존 매물 유형을 새로운 통합된 유형으로 변환하는 함수
const convertOldPropertyType = (oldType: string): string => {
  const conversionMap: { [key: string]: string } = {
    'House': 'House_Villa',
    'Villa': 'House_Villa',
    'Office': 'Office_Shop',
    'Shop': 'Office_Shop',
    'Land': 'Land_Other',
    'Other': 'Land_Other'
  };
  return conversionMap[oldType] || oldType;
};

// 통합된 매물 유형 그룹
const propertyTypeGroups = {
  'House,Villa': ['House', 'Villa'],
  'Office,Shop': ['Office', 'Shop'],
  'Land,Other': ['Land', 'Other']
};

// 이미지 URL 검증 및 수정
const validateAndFixImages = (property: Property): Property => {
  if (!property.images || property.images.length === 0) {
    // 기본 이미지 자동 추가 제거 - 빈 배열 반환
    return {
      ...property,
      images: []
    };
  }

  // 유효한 이미지들만 필터링
  const validImages = property.images.filter(img => {
    if (!img) return false;
    if (img.startsWith('blob:')) return false; // blob URL 제외
    if (img.startsWith('data:image/')) return true; // Base64 이미지 허용
    if (!img.startsWith('http')) return false; // http로 시작하지 않는 URL 제외
    return true;
  });

  return {
    ...property,
    images: validImages
  };
};

// localStorage에서 매물 데이터 로드
const loadPropertiesFromStorage = (): Property[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('vietnam-properties');
  if (stored) {
    try {
      const properties = JSON.parse(stored);
      
      // 기존 데이터에서 '호치민시'를 '호치민'으로 업데이트하고 이미지 검증, 매물 유형 변환
      const updatedProperties = properties.map((property: Property) => {
        const fixedProperty = {
          ...property,
          region: property.region === '호치민시' ? '호치민' : property.region,
          property_type: convertOldPropertyType(property.property_type)
        };
        return validateAndFixImages(fixedProperty);
      });
      
      // 변경사항이 있으면 localStorage에 저장
      if (JSON.stringify(properties) !== JSON.stringify(updatedProperties)) {
        localStorage.setItem('vietnam-properties', JSON.stringify(updatedProperties));
      }
      
      return updatedProperties;
    } catch (error) {
      console.error('Error parsing stored properties:', error);
    }
  }
  
  // 초기 데이터 (localStorage에 없을 때만)
  const initialProperties: Property[] = [
    {
      id: '1',
      title: '호치민 1구역 럭셔리 아파트',
      description: '호치민 시내 중심가에 위치한 고급 아파트입니다. 완벽한 시설과 보안을 제공합니다.',
      price: 2500000000,
      area: 85,
      region: '호치민',
      transaction_type: 'sale',
      property_type: 'Apartment',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500'],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: '하노이 2구역 오피스 빌딩',
      description: '하노이 비즈니스 중심가의 현대적인 오피스 빌딩입니다.',
      price: 5000000000,
      area: 200,
      region: '하노이',
      transaction_type: 'sale',
      property_type: 'Office_Shop',
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500'],
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
    {
      id: '3',
      title: '다낭 해변가 빌라',
      description: '다낭 해변가에 위치한 럭셔리 빌라입니다. 바다 전망을 즐길 수 있습니다.',
      price: 15000000,
      area: 150,
      region: '다낭',
      transaction_type: 'rent',
      property_type: 'House_Villa',
      images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500'],
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  ];
  
  // 초기 데이터를 localStorage에 저장
  localStorage.setItem('vietnam-properties', JSON.stringify(initialProperties));
  return initialProperties;
};

// localStorage 용량 확인 및 정리
const checkStorageQuota = () => {
  try {
    const stored = localStorage.getItem('vietnam-properties');
    if (stored) {
      const properties = JSON.parse(stored);
      
      // 매물이 30개를 초과하면 오래된 매물 삭제
      if (properties.length > 30) {
        const sortedProperties = properties.sort((a: Property, b: Property) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        // 최신 20개만 유지
        const cleanedProperties = sortedProperties.slice(0, 20);
        localStorage.setItem('vietnam-properties', JSON.stringify(cleanedProperties));
        console.log('localStorage 정리 완료: 오래된 매물 삭제됨');
        return cleanedProperties;
      }
    }
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('localStorage 정리 중 오류:', error);
    return [];
  }
};

// 매물 데이터를 localStorage에 저장
const savePropertiesToStorage = (properties: Property[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    console.log('localStorage 저장 시작:', {
      propertyCount: properties.length,
      firstProperty: properties[0]?.title
    });
    
    // 데이터 검증
    if (!Array.isArray(properties)) {
      throw new Error('properties는 배열이어야 합니다.');
    }
    
    // 각 매물의 필수 필드 검증
    for (let i = 0; i < properties.length; i++) {
      const property = properties[i];
      if (!property.id || !property.title || !property.property_type) {
        throw new Error(`매물 ${i + 1}의 필수 필드가 누락되었습니다.`);
      }
    }
    
    // localStorage 용량 확인 및 정리
    checkStorageQuota();
    
    // 저장 시도
    try {
      localStorage.setItem('vietnam-properties', JSON.stringify(properties));
      console.log('localStorage 저장 완료');
    } catch (quotaError) {
      console.error('localStorage 용량 초과, 오래된 데이터 정리 후 재시도');
      
      // 용량 초과 시 오래된 매물 삭제 후 재시도
      const cleanedProperties = checkStorageQuota();
      const newProperties = [properties[0], ...cleanedProperties.slice(0, 19)];
      
      localStorage.setItem('vietnam-properties', JSON.stringify(newProperties));
      console.log('localStorage 정리 후 저장 완료');
    }
  } catch (error) {
    console.error('localStorage 저장 중 오류:', error);
    throw error;
  }
};

// 매물 데이터 가져오기 (localStorage에서)
let mockProperties: Property[] = loadPropertiesFromStorage();

// 매물 관련 API 함수들
export const propertyApi = {
  // 모든 매물 조회
  getAll: async (filters?: any): Promise<Property[]> => {
    const q = collection(db, 'properties');
    const querySnapshot = await getDocs(q);
    let properties = querySnapshot.docs.map(doc => ({
      ...(doc.data() as Omit<Property, 'id'>),
      id: doc.id
    }));
    // (필요시 filters 적용)
    return properties;
  },

  // 매물 상세 조회
  getById: async (id: string): Promise<Property | null> => {
    const docRef = doc(db, 'properties', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { ...(docSnap.data() as Omit<Property, 'id'>), id: docSnap.id } : null;
  },

  // 매물 등록
  create: async (data: PropertyFormData): Promise<Property> => {
    const docRef = await addDoc(collection(db, 'properties'), {
      ...data,
      price: Number(data.price),
      area: Number(data.area),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    const docSnap = await getDoc(docRef);
    return { ...(docSnap.data() as Omit<Property, 'id'>), id: docSnap.id };
  },

  // 매물 수정
  update: async (id: string, data: PropertyFormData) => {
    const docRef = doc(db, 'properties', id);
    await updateDoc(docRef, {
      ...data,
      price: Number(data.price),
      area: Number(data.area),
      updated_at: new Date().toISOString(),
    });
    return true;
  },

  // 매물 삭제
  delete: async (id: string) => {
    const docRef = doc(db, 'properties', id);
    await deleteDoc(docRef);
    return true;
  },

  // 이미지 문제 해결을 위한 유틸리티 함수
  fixAllImages: async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem('vietnam-properties');
    if (stored) {
      try {
        const properties = JSON.parse(stored);
        const fixedProperties = properties.map((property: Property) => validateAndFixImages(property));
        localStorage.setItem('vietnam-properties', JSON.stringify(fixedProperties));
        console.log('모든 매물의 이미지가 수정되었습니다.');
      } catch (error) {
        console.error('이미지 수정 중 오류:', error);
      }
    }
  },

  // 매물 유형 매핑 가져오기
  getPropertyTypeMapping: () => propertyTypeMapping,
  
  // 통합된 매물 유형 옵션 가져오기
  getPropertyTypeOptions: () => [
    { value: 'Apartment', label: '아파트먼트' },
    { value: 'House_Villa', label: '주택/빌라' },
    { value: 'Office_Shop', label: '상업시설/오피스' },
    { value: 'Land_Other', label: '토지/기타' }
  ],
};

// 이미지 업로드 함수
export async function uploadImage(file: File) {
  const storageRef = ref(storage, `property-images/${file.name}_${Date.now()}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// 관리자 관련 API 함수들
export const adminApi = {
  // 관리자 로그인
  login: async (username: string, password: string): Promise<boolean> => {
    try {
      // 하드코딩된 인증 (실제로는 API 호출)
      if (username === 'admin' && password === 'admin1234') {
        localStorage.setItem('admin-token', 'admin-token-123');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  // 관리자 로그아웃
  logout: () => {
    localStorage.removeItem('admin-token');
  },

  // 관리자 인증 확인
  checkAuth: async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('admin-token');
      if (!token) return false;
      
      // 간단한 토큰 확인
      return token === 'admin-token-123';
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },
}; 