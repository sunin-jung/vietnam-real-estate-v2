export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-5xl font-bold mb-4 text-primary-600">404</h1>
      <p className="text-lg mb-6">페이지를 찾을 수 없습니다.</p>
      <a href="/" className="bg-primary-600 text-white px-6 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors">홈으로 돌아가기</a>
    </div>
  );
} 