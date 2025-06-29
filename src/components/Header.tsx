'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminStore } from '@/lib/store';

export default function Header() {
  const { isLoggedIn, username, logout, initialize } = useAdminStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 스토어 초기화
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    // 로컬 스토리지에서 토큰도 제거
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin-token');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow-md relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <Link href="/" className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 min-h-[44px] min-w-[44px] justify-center">
              <h1 className="text-xl md:text-2xl font-bold text-primary-600 cursor-pointer">
                Vietnam Real Estate
              </h1>
            </Link>

            {/* 데스크톱 네비게이션 메뉴 */}
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className="group relative flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-700 hover:text-primary-600 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 hover:shadow-lg border border-transparent hover:border-primary-200"
              >
                <span className="text-lg">🏠</span>
                <span>홈</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
              <Link 
                href="/properties" 
                className="group relative flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-700 hover:text-primary-600 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 hover:shadow-lg border border-transparent hover:border-primary-200"
              >
                <span className="text-lg">🔍</span>
                <span>매물 검색</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
              <Link 
                href="/interior" 
                className="group relative flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-700 hover:text-primary-600 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 hover:shadow-lg border border-transparent hover:border-primary-200"
              >
                <span className="text-lg">🎨</span>
                <span>인테리어/시공</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
              <Link 
                href="/legal" 
                className="group relative flex items-center space-x-2 px-4 py-3 rounded-xl text-gray-700 hover:text-primary-600 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-blue-50 hover:shadow-lg border border-transparent hover:border-primary-200"
              >
                <span className="text-lg">⚖️</span>
                <span>법률자문</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </Link>
            </nav>

            {/* 관리자 로그인/로그아웃 */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    href="/admin/dashboard"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    대시보드
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin/dashboard"
                  className="hidden md:block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  관리자 로그인
                </Link>
              )}

              {/* 모바일 햄버거 메뉴 버튼 */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">메뉴 열기</span>
                {/* 햄버거 아이콘 */}
                <svg
                  className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                {/* X 아이콘 */}
                <svg
                  className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 모바일 슬라이드 메뉴 오버레이 */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* 배경 오버레이 */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* 슬라이드 메뉴 */}
        <div 
          className={`absolute top-0 right-0 h-[55vh] w-[49vw] max-w-[196px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out rounded-bl-lg ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* 메뉴 헤더 */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">메뉴</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 메뉴 항목들 */}
            <div className="flex-1 p-3 space-y-2">
              <Link
                href="/"
                className="block w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🏠 홈
              </Link>
              <Link
                href="/properties"
                className="block w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🔍 매물 검색
              </Link>
              <Link
                href="/interior"
                className="block w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🎨 인테리어/시공
              </Link>
              <Link
                href="/legal"
                className="block w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ⚖️ 법률자문
              </Link>
            </div>

            {/* 관리자 섹션 */}
            <div className="border-t border-gray-200 p-3">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <Link
                    href="/admin/dashboard"
                    className="block w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    📊 대시보드
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left p-3 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-100 transition-all duration-200"
                  >
                    🚪 로그아웃
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin/dashboard"
                  className="block w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-100 transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🔐 관리자 로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 