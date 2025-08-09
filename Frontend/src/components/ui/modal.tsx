import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './button';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto bg-background rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

const ModalContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <div className={cn('p-6', className)} {...props}>
    {children}
  </div>
);

const ModalHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <div className={cn('flex items-center justify-between pb-4 border-b', className)} {...props}>
    {children}
  </div>
);

const ModalTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <h2 className={cn('text-lg font-semibold', className)} {...props}>
    {children}
  </h2>
);

const ModalClose: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <Button variant="ghost" size="icon" onClick={onClose}>
    <X className="h-4 w-4" />
  </Button>
);

const ModalBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <div className={cn('py-4', className)} {...props}>
    {children}
  </div>
);

const ModalFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children, 
  ...props 
}) => (
  <div className={cn('flex justify-end gap-2 pt-4 border-t', className)} {...props}>
    {children}
  </div>
);

export { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalClose, 
  ModalBody, 
  ModalFooter 
};
