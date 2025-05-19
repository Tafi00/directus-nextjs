'use client';

import React from 'react';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessDialog: React.FC<SuccessDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose}></div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl z-10 w-[90%] max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
            Đăng ký thành công!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Cảm ơn bạn đã đăng ký. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
          </p>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessDialog; 