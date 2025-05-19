'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Vui lòng nhập họ tên' }),
  phone: z.string().min(10, { message: 'Số điện thoại không hợp lệ' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
});

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
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
      console.log(values);
      
      // Giả lập API call thành công
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
          <DialogTitle className="text-center text-xl font-bold">
            Đăng ký nhận thông tin ưu đãi
          </DialogTitle>
        </DialogHeader>
        
        {isSuccess ? (
          <div className="text-center p-4">
            <p className="text-green-600 font-medium mb-4">Đăng ký thành công!</p>
            <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
            <Button 
              className="mt-4"
              onClick={handleClose}
            >
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
              
              <Button 
                type="submit" 
                className="w-full bg-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Đăng ký ngay'}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
} 