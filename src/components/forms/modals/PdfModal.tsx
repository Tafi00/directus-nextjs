'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface PdfModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const formSchema = z.object({
	fullName: z.string().min(2, { message: 'Vui lòng nhập họ tên' }),
	phone: z.string().min(10, { message: 'Số điện thoại không hợp lệ' }),
	email: z.string().email({ message: 'Email không hợp lệ' }),
});

export default function PdfModal({ isOpen, onClose }: PdfModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: '',
			phone: '',
			email: '',
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true);
		try {
			// Gửi dữ liệu form đi
			console.log({ ...values, requestType: 'PDF_PRICE' });

			// Giả lập API call thành công
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Giả lập download file PDF
			// Trong thực tế, có thể sẽ mở một URL mới chứa file PDF hoặc download
			const url = '/sample-price-list.pdf';
			const link = document.createElement('a');
			link.href = url;
			link.target = '_blank';
			link.download = 'bang-gia.pdf';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			setIsSuccess(true);
			form.reset();
		} catch (error) {
			console.error('Đã xảy ra lỗi:', error);
		} finally {
			setIsSubmitting(false);
		}
	}

	const handleClose = () => {
		if (!isSubmitting) {
			if (isSuccess) {
				setIsSuccess(false);
			}
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-md mx-auto">
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-bold">Nhận bảng giá chi tiết</DialogTitle>
				</DialogHeader>

				{isSuccess ? (
					<div className="text-center p-4">
						<p className="text-green-600 font-medium mb-4">Đăng ký thành công!</p>
						<p>Bảng giá đang được tải xuống.</p>
						<p className="mt-2">Chúng tôi sẽ liên hệ với bạn để tư vấn thêm.</p>
						<Button className="mt-4" onClick={handleClose}>
							Đóng
						</Button>
					</div>
				) : (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Họ và tên</FormLabel>
										<FormControl>
											<Input placeholder="Nguyễn Văn A" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Số điện thoại</FormLabel>
										<FormControl>
											<Input placeholder="0707183979" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="example@gmail.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<p className="text-sm text-center text-muted-foreground">
								Vui lòng nhập thông tin để nhận bảng giá mới nhất
							</p>

							<Button type="submit" className="w-full bg-primary" disabled={isSubmitting}>
								{isSubmitting ? 'Đang xử lý...' : 'Tải bảng giá ngay'}
							</Button>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
}
