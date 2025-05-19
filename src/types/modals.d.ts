declare module '@/components/forms/modals/RegisterModal' {
  interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  const RegisterModal: React.FC<RegisterModalProps>;
  export default RegisterModal;
}

declare module '@/components/forms/modals/PdfModal' {
  interface PdfModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  const PdfModal: React.FC<PdfModalProps>;
  export default PdfModal;
} 