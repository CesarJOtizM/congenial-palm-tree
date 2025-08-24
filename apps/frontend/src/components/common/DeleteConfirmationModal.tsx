'use client';

import { Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  itemName: string;
  itemType?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  itemName,
  itemType = 'elemento',
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 p-4'
      style={{ backgroundColor: '#00000099' }}
    >
      <div className='bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-auto transform transition-all duration-200 ease-out'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Confirmar eliminación
          </h3>
          <button
            onClick={onCancel}
            className='text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100'
            disabled={isDeleting}
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='p-8'>
          <div className='flex items-center justify-center mb-6'>
            <div className='p-4 bg-red-100 rounded-full'>
              <Trash2 className='h-10 w-10 text-red-600' />
            </div>
          </div>
          <p className='text-gray-600 text-center text-base leading-relaxed mb-4'>
            ¿Estás seguro de que quieres eliminar el {itemType}{' '}
            <span className='font-semibold text-gray-900'>
              &ldquo;{itemName}&rdquo;
            </span>
            ?
          </p>
          <p className='text-sm text-gray-500 text-center leading-relaxed'>
            Esta acción no se puede deshacer.
          </p>
        </div>

        <div className='px-6 pb-6'>
          <div className='flex space-x-4'>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className='flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 disabled:opacity-50 font-medium'
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className='flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 flex items-center justify-center font-medium'
            >
              {isDeleting ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3' />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
