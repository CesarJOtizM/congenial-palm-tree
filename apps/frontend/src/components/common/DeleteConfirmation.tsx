'use client';

import { AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

export function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <div className='flex items-center mb-4'>
          <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100'>
            <AlertTriangle className='h-6 w-6 text-red-600' />
          </div>
        </div>

        <div className='text-center'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>{title}</h3>
          <p className='text-sm text-gray-500 mb-6'>{message}</p>

          <div className='flex justify-center space-x-3'>
            <button
              onClick={onClose}
              disabled={isLoading}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className='px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <>
                  <Loader2 className='animate-spin -ml-1 mr-2 h-4 w-4' />
                  Eliminando...
                </>
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          disabled={isLoading}
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50'
        >
          <X className='h-6 w-6' />
        </button>
      </div>
    </div>
  );
}
