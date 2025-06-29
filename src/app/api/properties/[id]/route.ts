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
    region: 'Ho Chi Minh City',
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
    region: 'Hanoi',
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
    region: 'Da Nang',
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
  const token = authHeader.substring(7);
  return token === 'admin-token-123';
}

// GET - 매물 상세 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = properties.find(p => p.id === params.id);
    
    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }
    
    const response: ApiResponse<Property> = {
      success: true,
      data: property,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT - 매물 수정 (관리자만)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 인증 확인
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const propertyIndex = properties.findIndex(p => p.id === params.id);
    
    if (propertyIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
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
    
    // 매물 업데이트
    const updatedProperty: Property = {
      ...properties[propertyIndex],
      ...body,
      updated_at: new Date().toISOString(),
    };
    
    properties[propertyIndex] = updatedProperty;
    
    const response: ApiResponse<Property> = {
      success: true,
      data: updatedProperty,
      message: 'Property updated successfully',
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE - 매물 삭제 (관리자만)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 관리자 인증 확인
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const propertyIndex = properties.findIndex(p => p.id === params.id);
    
    if (propertyIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // 매물 삭제
    properties.splice(propertyIndex, 1);
    
    const response: ApiResponse<void> = {
      success: true,
      message: 'Property deleted successfully',
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete property' },
      { status: 500 }
    );
  }
} 