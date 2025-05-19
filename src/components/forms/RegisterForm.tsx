'use client';

import { useState, forwardRef } from 'react';
import RegisterModal from '@/components/forms/modals/RegisterModal';
import PdfModal from '@/components/forms/modals/PdfModal';
import { setAttr } from '@directus/visual-editing';

interface RegisterFormProps {
  registerForm?: {
    id: string;
    title?: string | null;
    subtitle?: string | null;
    phone_number?: string | null;
    zalo_number?: string | null;
    buttons?: {
      id: number;
      register_form_id: number;
      text: string;
      type: string;
      sort?: number;
      url?: string | null;
    }[];
  };
}

const RegisterForm = forwardRef<HTMLDivElement, RegisterFormProps>(({ registerForm }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const directusURL = process.env.NEXT_PUBLIC_DIRECTUS_URL;

  // Kiểm tra xem registerForm có tồn tại không 
  console.log('RegisterForm Props:', registerForm);

  const handleButtonClick = (type: string, url?: string | null) => {
    switch (type) {
      case 'modal1':
        setIsModalOpen(true);
        break;
      case 'modal2':
        setIsPdfModalOpen(true);
        break;
      case 'tel':
        if (registerForm?.phone_number) {
          window.location.href = `tel:${registerForm.phone_number}`;
        } else {
          window.location.href = "tel:0707183979";
        }
        break;
      case 'zalo':
        if (registerForm?.zalo_number) {
          window.open(`https://zalo.me/${registerForm.zalo_number}`, "_blank");
        } else {
          window.open("https://zalo.me/0707183979", "_blank");
        }
        break;
      case 'url':
        if (url) {
          window.open(url, "_blank");
        }
        break;
      default:
        setIsModalOpen(true);
    }
  };

  return (
    <div ref={ref} className="form-container hidden md:block w-full lg:w-[400px] xl:w-[440px] 2xl:w-[480px]">
      <h2 
        className="form-title text-lg sm:text-xl lg:text-2xl 2xl:text-[28px] uppercase text-transparent bg-gradient-to-r from-[#FFD08D] to-[#FFECD1] bg-clip-text"
        data-directus={registerForm ? setAttr({
          collection: 'global_register_form',
          item: registerForm.id,
          fields: 'title',
          mode: 'popover',
        }) : undefined}
      >
        {registerForm?.title || '30 suất cam kết\ncho thuê 144 triệu'}
      </h2>
      <p 
        className="form-subtitle text-sm sm:text-base text-[#FFECD1]"
        data-directus={registerForm ? setAttr({
          collection: 'global_register_form',
          item: registerForm.id,
          fields: 'subtitle',
          mode: 'popover',
        }) : undefined}
      >
        {registerForm?.subtitle || 'Liên hệ ngay để được tư vấn và nhận ưu đãi !!!'}
      </p>
      <div 
        className="form-buttons-container space-y-2 sm:space-y-3 lg:space-y-4"
        data-directus={registerForm ? setAttr({
          collection: 'global_register_form',
          item: registerForm.id,
          fields: 'buttons',
          mode: 'modal',
        }) : undefined}
      >
        {registerForm?.buttons && registerForm.buttons.length > 0 ? (
          // Render buttons from the data
          registerForm.buttons
            .sort((a, b) => (a.sort || 0) - (b.sort || 0))
            .map((button) => (
              <button
                key={button.id}
                className="form-button h-[44px] sm:h-[50px] lg:h-[56px] text-sm sm:text-base"
                onClick={() => handleButtonClick(button.type, button.url)}
              >
                {button.text} 
                {button.type === 'tel' && registerForm.phone_number ? ` ${registerForm.phone_number}` : ''}
              </button>
            ))
        ) : (
          // Fallback buttons if no data
          <>
            <button
              className="form-button h-[44px] sm:h-[50px] lg:h-[56px] text-sm sm:text-base"
              onClick={() => setIsModalOpen(true)}
            >
              Nhận chính sách bán hàng
            </button>
            <button
              className="form-button h-[44px] sm:h-[50px] lg:h-[56px] text-sm sm:text-base"
              onClick={() => setIsPdfModalOpen(true)}
            >
              Nhận bảng giá chi tiết
            </button>
            <button
              onClick={() => window.location.href = "tel:0707183979"}
              className="form-button h-[44px] sm:h-[50px] lg:h-[56px] text-sm sm:text-base"
            >
              Gọi 0707 18 39 79
            </button>
            <button
              onClick={() => window.open("https://zalo.me/0707183979", "_blank")}
              className="form-button h-[44px] sm:h-[50px] lg:h-[56px] text-sm sm:text-base"
            >
              Tư vấn qua Zalo
            </button>
            <button
              className="form-button h-[44px] sm:h-[50px] lg:h-[56px] text-sm sm:text-base"
              onClick={() => setIsModalOpen(true)}
            >
              Đăng ký nhận ưu đãi
            </button>
          </>
        )}
      </div>

      <RegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
});

RegisterForm.displayName = 'RegisterForm';
export default RegisterForm; 