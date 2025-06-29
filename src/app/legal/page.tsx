'use client';

import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <section className="text-center py-16 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          법률자문
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
         베트남 부동산 관련 모든 법적 문제를 전문적으로 해결해드립니다
        </p>
        <button className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
          무료 법률 상담
        </button>
      </section>

      {/* 서비스 소개 */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          전문 법률 서비스
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">부동산 계약</h3>
            <p className="text-gray-600">
              매매, 임대, 분양 등 모든 부동산 계약에 대한 법률 검토 및 작성
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">투자 자문</h3>
            <p className="text-gray-600">
              외국인 투자 관련 법규 및 절차에 대한 전문적인 자문 서비스
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚖️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">분쟁 해결</h3>
            <p className="text-gray-600">
              부동산 관련 분쟁의 조정, 중재, 소송 대리 등 종합적인 해결책 제공
            </p>
          </div>
        </div>
      </section>

      {/* 전문 분야 */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          전문 분야
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">🏢 부동산 투자</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 외국인 부동산 투자 관련 법규</li>
              <li>• 투자 허가 및 등록 절차</li>
              <li>• 세금 및 회계 자문</li>
              <li>• 투자 구조 설계</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">📄 계약 법무</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 매매계약서 검토 및 작성</li>
              <li>• 임대계약서 검토 및 작성</li>
              <li>• 분양계약 관련 법률 자문</li>
              <li>• 계약 위반 시 대응 방안</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">🏗️ 개발 사업</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 부동산 개발 사업 허가</li>
              <li>• 건축 관련 법규 준수</li>
              <li>• 환경 영향 평가</li>
              <li>• 토지 사용권 관련 문제</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-600">💼 기업 법무</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 법인 설립 및 등록</li>
              <li>• 기업 구조 개편</li>
              <li>• 노동법 관련 자문</li>
              <li>• 지적재산권 보호</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 성공 사례 */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          성공 사례
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">호치민 아파트 투자 성공</h3>
            <p className="text-gray-600 text-sm mb-2">한국 투자자 A씨</p>
            <p className="text-gray-500 text-sm">
              호치민 1구역 아파트 투자 시 발생한 법적 문제를 해결하여 
              성공적으로 투자를 완료했습니다. 외국인 투자 허가부터 
              계약 체결까지 전 과정을 법률적으로 지원했습니다.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">다낭 리조트 개발 프로젝트</h3>
            <p className="text-gray-600 text-sm mb-2">일본 개발사 B사</p>
            <p className="text-gray-500 text-sm">
              다낭 해변가 리조트 개발 프로젝트의 모든 법적 절차를 
              지원하여 성공적으로 사업을 완료했습니다. 환경 영향 평가부터 
              건축 허가까지 복잡한 법적 문제들을 해결했습니다.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">하노이 오피스 임대 분쟁 해결</h3>
            <p className="text-gray-600 text-sm mb-2">독일 기업 C사</p>
            <p className="text-gray-500 text-sm">
              하노이 오피스 임대 계약 관련 분쟁을 성공적으로 해결했습니다. 
              중재를 통해 양측이 모두 만족하는 결과를 도출했으며, 
              향후 유사한 문제 발생을 방지할 수 있는 계약 개선안을 제시했습니다.
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-lg font-semibold mb-2">부동산 개발사 법인 설립</h3>
            <p className="text-gray-600 text-sm mb-2">싱가포르 투자자 D씨</p>
            <p className="text-gray-500 text-sm">
              베트남 부동산 개발을 위한 법인 설립을 지원했습니다. 
              최적의 투자 구조를 설계하고, 모든 법적 절차를 완료하여 
              성공적으로 사업을 시작할 수 있도록 도왔습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 상담 프로세스 */}
      <section className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          상담 프로세스
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">초기 상담</h3>
            <p className="text-gray-600 text-sm">
              고객의 상황과 요구사항을 파악하여 적절한 해결 방안을 제시합니다
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">사례 분석</h3>
            <p className="text-gray-600 text-sm">
              관련 법규와 유사 사례를 분석하여 최적의 해결책을 도출합니다
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">해결 방안 제시</h3>
            <p className="text-gray-600 text-sm">
              구체적인 해결 방안과 예상 결과를 상세히 설명드립니다
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              4
            </div>
            <h3 className="text-lg font-semibold mb-2">실행 및 후속 관리</h3>
            <p className="text-gray-600 text-sm">
              선택하신 방안을 실행하고, 완료 후에도 지속적인 관리 서비스를 제공합니다
            </p>
          </div>
        </div>
      </section>

      {/* 문의 및 연락처 */}
      <section className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          법률 상담 문의
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">연락처 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-green-600 mr-3">📞</span>
                <span>+84 28 1234 5679</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-3">📧</span>
                <span>legal@vietnamrealestate.com</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-3">📍</span>
                <span>호치민 1구역, 베트남</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-3">🕒</span>
                <span>월-금: 9:00-18:00</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">무료 초기 상담</h4>
              <p className="text-green-700 text-sm">
                첫 상담은 무료로 제공됩니다. 복잡한 법적 문제도 
                전문 변호사가 직접 상담해드립니다.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">상담 신청</h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="이름"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                placeholder="이메일"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="tel"
                placeholder="전화번호"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">상담 분야 선택</option>
                <option value="investment">부동산 투자</option>
                <option value="contract">계약 법무</option>
                <option value="development">개발 사업</option>
                <option value="corporate">기업 법무</option>
                <option value="dispute">분쟁 해결</option>
              </select>
              <textarea
                placeholder="상담 내용을 간단히 설명해주세요"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
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