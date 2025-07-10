import { NextRequest, NextResponse } from 'next/server';
import { Property, PropertyFormData, ApiResponse } from '@/types';

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
let properties: Property[] = [
  {
    id: '1',
    title: '호치민 1구역 럭셔리 아파트',
    description: '호치민 시내 중심가에 위치한 고급 아파트입니다. 완벽한 시설과 보안을 제공합니다.',
    price: 2500000000,
    area: 85,
    region: '호치민시',
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

// 관리자 인증 확인 함수
function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  // 실제로는 JWT 토큰 검증을 해야 함
  // 여기서는 간단히 하드코딩된 토큰으로 확인
  const token = authHeader.substring(7);
  return token === 'admin-token-123';
}

// GET - 모든 매물 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    let filteredProperties = [...properties];
    
    // 검색 필터 적용
    const search = searchParams.get('search');
    const region = searchParams.get('region');
    const transaction_type = searchParams.get('transaction_type');
    const property_type = searchParams.get('property_type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minArea = searchParams.get('minArea');
    const maxArea = searchParams.get('maxArea');
    
    if (search) {
      filteredProperties = filteredProperties.filter(property =>
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (region) {
      filteredProperties = filteredProperties.filter(property =>
        property.region === region
      );
    }
    
    if (transaction_type) {
      filteredProperties = filteredProperties.filter(property =>
        property.transaction_type === transaction_type
      );
    }
    
    if (property_type) {
      filteredProperties = filteredProperties.filter(property =>
        property.property_type === property_type
      );
    }
    
    if (minPrice) {
      filteredProperties = filteredProperties.filter(property =>
        property.price >= parseInt(minPrice)
      );
    }
    
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(property =>
        property.price <= parseInt(maxPrice)
      );
    }
    
    if (minArea) {
      filteredProperties = filteredProperties.filter(property =>
        property.area >= parseInt(minArea)
      );
    }
    
    if (maxArea) {
      filteredProperties = filteredProperties.filter(property =>
        property.area <= parseInt(maxArea)
      );
    }
    
    const response: ApiResponse<Property[]> = {
      success: true,
      data: filteredProperties,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST - 매물 생성 (관리자만)
export async function POST(request: NextRequest) {
  try {
    // 관리자 인증 확인
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body: PropertyFormData = await request.json();
    
    // 필수 필드 검증
    if (!body.title || !body.description || !body.price || !body.area || !body.region) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // 새 매물 생성
    const newProperty: Property = {
      id: Date.now().toString(),
      ...body,
      price: Number(body.price),
      area: Number(body.area),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    properties.push(newProperty);
    
    const response: ApiResponse<Property> = {
      success: true,
      data: newProperty,
      message: 'Property created successfully',
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create property' },
      { status: 500 }
    );
  }
} 