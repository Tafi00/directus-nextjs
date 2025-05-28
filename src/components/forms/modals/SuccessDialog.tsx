import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SuccessDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SuccessDialog({ isOpen, onClose }: SuccessDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white sm:max-w-[400px] p-0 overflow-hidden outline-none border-none rounded-2xl max-h-[90vh] w-[90vw] sm:w-auto">
                <div className="p-4 sm:p-6 flex flex-col items-center">
                    <DialogHeader>
                        <DialogTitle>
                        </DialogTitle>
                    </DialogHeader>
                    {/* Success Animation */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-[scale-up_0.3s_ease-in-out]">
                        <svg
                            className="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                                className="animate-[check-mark_0.4s_ease-in-out_0.3s_forwards] custom-check-mark"
                            ></path>
                        </svg>
                    </div>

                    {/* Success Message */}
                    <div className="text-center space-y-2 animate-[fade-up_0.4s_ease-in-out_0.2s_forwards] opacity-0">
                        <div className="text-xl sm:text-2xl font-bold !text-gray-900">Đăng ký thành công!</div>
                        <div className="!text-gray-500 text-sm sm:text-base">
                            Chúng tôi sẽ liên hệ với Quý khách hàng trong thời gian sớm nhất để tư vấn thông tin chi tiết về dự án.
                        </div>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        style={{ background: "linear-gradient(180deg, #1D705D 0%, #129463 100%)" }}
                        className="mt-6 sm:mt-8 px-6 sm:px-8 py-2 sm:py-2.5 text-white rounded-full font-medium hover:opacity-90 transition-opacity animate-[fade-up_0.4s_ease-in-out_0.5s_forwards] opacity-0"
                    >
                        Đóng
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
