// 매물 관련 타입 정의
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  region: string;
  transaction_type: 'sale' | 'rent';
  property_type: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

// 매물 생성/수정용 타입
export interface PropertyFormData {
  title: string;
  description: string;
  price: string | number;
  area: string | number;
  region: string;
  transaction_type: 'sale' | 'rent';
  property_type: string;
  images: string[];
}

// 관리자 타입
export interface Admin {
  id: string;
  username: string;
  password: string;
}

// 검색 필터 타입
export interface SearchFilters {
  search?: string;
  region?: string;
  transaction_type?: 'sale' | 'rent';
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  property_type?: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 페이지네이션 타입
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 지역 타입
export type Region = 
  | '호치민시'
  | '하노이'
  | '다낭'
  | '하이퐁'
  | '나트랑'
  | '푸꾸옥'
  | '기타';

// 매물 유형 타입
export type PropertyType = 
  | 'Apartment'
  | 'House_Villa'
  | 'Office_Shop'
  | 'Land_Other'; 