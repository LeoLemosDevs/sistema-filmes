import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#222] border border-[#333] rounded-lg p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Confirmação</h3>
        <p className="text-gray-300 mb-8">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded transition-colors font-medium">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-netflix-red hover:bg-red-700 text-white rounded transition-colors font-medium">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};
