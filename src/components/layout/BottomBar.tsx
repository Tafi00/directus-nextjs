'use client';

import { useState } from 'react';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import RegisterForm from '@/components/forms/RegisterForm';
import RegisterModal from '@/components/forms/modals/RegisterModal';

export default function BottomBar() {
  const [openDialog, setOpenDialog] = useState(false);
  
  return (
    <>
      {/* Bottom bar only visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-2 px-4 lg:hidden z-50">
        <div className="flex justify-between items-center">
          <a 
            href="tel:0707183979" 
            className="flex flex-col items-center text-primary"
          >
            <Phone className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Gọi ngay</span>
          </a>
          
          <a 
            href="mailto:info@example.com" 
            className="flex flex-col items-center text-primary"
          >
            <Mail className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Email</span>
          </a>
          
          <a 
            href="https://zalo.me/0707183979" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center text-primary"
          >
            <MessageCircle className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Zalo</span>
          </a>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white rounded-full px-4 py-1 text-sm font-medium">
                Đăng ký ngay
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-auto">
              <DialogHeader>
                <DialogTitle className="text-center text-xl">Đăng ký nhận thông tin</DialogTitle>
              </DialogHeader>
              <RegisterModal 
                isOpen={true} 
                onClose={() => setOpenDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
} 