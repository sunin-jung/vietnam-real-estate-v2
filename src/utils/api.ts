import axios from 'axios';
import { Property, PropertyFormData, ApiResponse } from '@/types';

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

// localStorage에서 매물 데이터 로드
const loadPropertiesFromStorage = (): Property[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('vietnam-properties');
  if (stored) {
    try {
      const properties = JSON.parse(stored);
      
      // 기존 데이터에서 '호치민시'를 '호치민'으로 업데이트
      const updatedProperties = properties.map((property: Property) => ({
        ...property,
        region: property.region === '호치민시' ? '호치민' : property.region
      }));
      
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
      property_type: 'Office',
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
      property_type: 'Villa',
      images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500'],
      created_at: '2024-01-03T00:00:00Z',
      updated_at: '2024-01-03T00:00:00Z',
    },
  ];
  
  // 초기 데이터를 localStorage에 저장
  localStorage.setItem('vietnam-properties', JSON.stringify(initialProperties));
  return initialProperties;
};

// 매물 데이터를 localStorage에 저장
const savePropertiesToStorage = (properties: Property[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('vietnam-properties', JSON.stringify(properties));
};

// 매물 데이터 가져오기 (localStorage에서)
let mockProperties: Property[] = loadPropertiesFromStorage();

// 매물 관련 API 함수들
export const propertyApi = {
  // 모든 매물 조회
  getAll: async (filters?: any): Promise<Property[]> => {
    // localStorage에서 최신 데이터 로드
    mockProperties = loadPropertiesFromStorage();
    
    // 임시로 지연 효과 추가
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredProperties = [...mockProperties];
    
    if (filters) {
      if (filters.search) {
        filteredProperties = filteredProperties.filter(property =>
          property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          property.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      
      if (filters.region) {
        filteredProperties = filteredProperties.filter(property =>
          property.region === filters.region
        );
      }
      
      if (filters.transaction_type) {
        filteredProperties = filteredProperties.filter(property =>
          property.transaction_type === filters.transaction_type
        );
      }
      
      if (filters.property_type) {
        filteredProperties = filteredProperties.filter(property =>
          property.property_type === filters.property_type
        );
      }
      
      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter(property =>
          property.price >= filters.minPrice
        );
      }
      
      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter(property =>
          property.price <= filters.maxPrice
        );
      }
      
      if (filters.minArea) {
        filteredProperties = filteredProperties.filter(property =>
          property.area >= filters.minArea
        );
      }
      
      if (filters.maxArea) {
        filteredProperties = filteredProperties.filter(property =>
          property.area <= filters.maxArea
        );
      }
    }
    
    // 최신순으로 정렬 (created_at 기준)
    return filteredProperties.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  // 매물 상세 조회
  getById: async (id: string): Promise<Property | null> => {
    // localStorage에서 최신 데이터 로드
    mockProperties = loadPropertiesFromStorage();
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockProperties.find(p => p.id === id) || null;
  },

  // 매물 생성 (관리자만)
  create: async (data: PropertyFormData): Promise<Property | null> => {
    // localStorage에서 최신 데이터 로드
    mockProperties = loadPropertiesFromStorage();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProperty: Property = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // 새 매물을 배열의 맨 앞에 추가하여 최신순으로 표시
    mockProperties.unshift(newProperty);
    
    // localStorage에 저장
    savePropertiesToStorage(mockProperties);
    
    return newProperty;
  },

  // 매물 수정 (관리자만)
  update: async (id: string, data: PropertyFormData): Promise<Property | null> => {
    // localStorage에서 최신 데이터 로드
    mockProperties = loadPropertiesFromStorage();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProperties.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    const updatedProperty: Property = {
      ...mockProperties[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    mockProperties[index] = updatedProperty;
    
    // localStorage에 저장
    savePropertiesToStorage(mockProperties);
    
    return updatedProperty;
  },

  // 매물 삭제 (관리자만)
  delete: async (id: string): Promise<boolean> => {
    // localStorage에서 최신 데이터 로드
    mockProperties = loadPropertiesFromStorage();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockProperties.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProperties.splice(index, 1);
    
    // localStorage에 저장
    savePropertiesToStorage(mockProperties);
    
    return true;
  },
};

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