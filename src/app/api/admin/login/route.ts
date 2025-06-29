import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

// 관리자 인증 정보 (실제로는 데이터베이스에서 관리)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'VnRealEstate2024!', // 더 안전한 비밀번호로 변경
};

// POST - 관리자 로그인
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // 필수 필드 검증
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // 관리자 인증 확인
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // 실제로는 JWT 토큰을 생성해야 함
      const token = 'admin-token-123';
      
      const response: ApiResponse<{ token: string }> = {
        success: true,
        data: { token },
        message: 'Login successful',
      };
      
      return NextResponse.json(response);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
} 