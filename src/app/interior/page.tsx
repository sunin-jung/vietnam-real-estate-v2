'use client';

import Link from 'next/link';

export default function InteriorPage() {
  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          인테리어 & 시공
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          베트남에서 최고의 인테리어 디자인과 시공 서비스를 제공합니다
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
          무료 상담 신청
        </button>
      </section>

      {/* 서비스 소개 */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          우리의 서비스
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">인테리어 디자인</h3>
            <p className="text-gray-600">
              전문 디자이너가 고객의 취향과 예산에 맞는 맞춤형 인테리어 디자인을 제공합니다
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔨</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">전문 시공</h3>
            <p className="text-gray-600">
              베트남 현지 전문 시공팀이 정확하고 깔끔한 시공을 보장합니다
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">품질 관리</h3>
            <p className="text-gray-600">
              시공 전후 철저한 품질 검사를 통해 완벽한 결과물을 제공합니다
            </p>
          </div>
        </div>
      </section>

      {/* 포트폴리오 */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          포트폴리오
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
                alt="모던 아파트 인테리어"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">모던 아파트 인테리어</h3>
              <p className="text-gray-600 text-sm mb-2">호치민 1구역</p>
              <p className="text-sm text-gray-500">
                미니멀한 디자인과 기능성을 모두 만족하는 현대적인 아파트 인테리어
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500"
                alt="럭셔리 빌라 인테리어"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">럭셔리 빌라 인테리어</h3>
              <p className="text-gray-600 text-sm mb-2">다낭 해변가</p>
              <p className="text-sm text-gray-500">
                고급스러운 마감재와 세련된 디자인으로 완성된 럭셔리 빌라
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=500"
                alt="오피스 인테리어"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">모던 오피스 인테리어</h3>
              <p className="text-gray-600 text-sm mb-2">하노이 비즈니스 센터</p>
              <p className="text-sm text-gray-500">
                효율적인 공간 활용과 세련된 디자인이 조화를 이룬 오피스
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 프로세스 */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          서비스 프로세스
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">상담</h3>
            <p className="text-gray-600 text-sm">
              고객의 요구사항과 예산을 파악하여 맞춤형 솔루션을 제안합니다
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">디자인</h3>
            <p className="text-gray-600 text-sm">
              전문 디자이너가 3D 모델링과 상세 도면을 제작합니다
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">시공</h3>
            <p className="text-gray-600 text-sm">
              전문 시공팀이 정확한 일정과 품질로 시공을 진행합니다
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              4
            </div>
            <h3 className="text-lg font-semibold mb-2">완료</h3>
            <p className="text-gray-600 text-sm">
              최종 점검 후 고객에게 완성된 공간을 인도합니다
            </p>
          </div>
        </div>
      </section>

      {/* 문의 및 연락처 */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          문의하기
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">연락처 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">📞</span>
                <span>+84 28 1234 5678</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">📧</span>
                <span>interior@vietnamrealestate.com</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">📍</span>
                <span>호치민 1구역, 베트남</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">🕒</span>
                <span>월-금: 9:00-18:00</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">무료 상담 신청</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="이름"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="이메일"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="전화번호"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="상담 내용"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                상담 신청하기
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
} 