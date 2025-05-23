import { headers } from 'next/headers';

/**
 * Lấy pathname từ referer URL trong server-side component
 * @returns Pathname (ví dụ: 'the-infinity-di-an') hoặc chuỗi rỗng nếu không có
 */
export async function getPathnameFromReferer(): Promise<string> {
	try {
		const headersList = await headers();
		const referer = headersList.get('referer') || '';
		
		if (!referer) return '';
		
		// Phân tích URL từ referer
		const url = new URL(referer);
		
		// Lấy pathname và loại bỏ dấu / ở đầu
		let pathname = url.pathname;
		if (pathname.startsWith('/')) {
			pathname = pathname.substring(1);
		}
		
		// Bỏ qua các đường dẫn API hoặc hệ thống
		if (pathname.startsWith('api/') || pathname === 'favicon.ico') {
			return '';
		}

		return pathname;
	} catch (error) {
		console.error('Lỗi khi trích xuất pathname từ referer:', error);
		
		return '';
	}
} 