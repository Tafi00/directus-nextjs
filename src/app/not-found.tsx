import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 text-center">
      <h1 className="text-4xl font-bold">404 - Không tìm thấy trang</h1>
      <p className="mt-4 text-xl">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Link 
        href="/" 
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Trở về trang chủ
      </Link>
    </div>
  );
} 