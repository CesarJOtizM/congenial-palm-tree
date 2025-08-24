/* eslint-disable no-console */
'use client';

import { useAuth } from '@contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@lib/utils';
import apiService from '@services/api';
import { CreateDebtRequest, Debt, UpdateDebtRequest, User } from '@types';
import { Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const debtSchema = z.object({
  description: z
    .string()
    .min(3, 'La descripción debe tener al menos 3 caracteres'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  currency: z.string().min(1, 'La moneda es requerida'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  category: z.string().optional(),
  dueDate: z.string().optional(),
  debtorId: z.string().min(1, 'El deudor es requerido'),
  notes: z.string().optional(),
});

type DebtFormData = z.infer<typeof debtSchema>;

interface DebtFormProps {
  debt?: Debt | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onError?: (error: Error) => void;
}

export function DebtForm({
  debt,
  isOpen,
  onClose,
  onSubmit,
  onError,
}: DebtFormProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      description: '',
      amount: 0,
      currency: 'EUR',
      priority: 'MEDIUM',
      category: '',
      dueDate: '',
      debtorId: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (debt) {
        // Editing mode
        setValue('description', debt.description);
        setValue('amount', debt.amount);
        setValue('currency', debt.currency);
        setValue('priority', debt.priority);
        setValue('category', debt.category || '');
        setValue('dueDate', debt.dueDate ? debt.dueDate.split('T')[0] : '');
        setValue('debtorId', debt.debtorId);
        setValue('notes', debt.notes || '');
      } else {
        // Create mode
        reset();
      }
    } else {
      // Reset form when modal closes
      reset();
    }
  }, [isOpen, debt, setValue, reset]);

  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const response = await apiService.getUsers();
      if (response.success && response.data && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleFormSubmit = async (data: DebtFormData) => {
    try {
      setIsLoading(true);

      // Convert dueDate to ISO string if provided
      const formattedDueDate = data.dueDate
        ? new Date(data.dueDate).toISOString()
        : undefined;

      if (debt) {
        // Update existing debt
        const updateData: UpdateDebtRequest = {
          description: data.description,
          amount: data.amount,
          currency: data.currency,
          priority: data.priority,
          category: data.category,
          dueDate: formattedDueDate,
        };
        const response = await apiService.updateDebt(debt.id, updateData);

        if (response.success) {
          // Success notification will be handled by parent component
          onSubmit();
        } else {
          throw new Error(response.message || 'Error al actualizar la deuda');
        }
      } else {
        // Create new debt
        const createData: CreateDebtRequest = {
          description: data.description,
          amount: data.amount,
          currency: data.currency,
          priority: data.priority,
          category: data.category,
          dueDate: formattedDueDate,
          creditorId: user?.id || '',
          debtorId: data.debtorId,
          notes: data.notes,
        };
        const response = await apiService.createDebt(createData);

        if (response.success) {
          // Success notification will be handled by parent component
          onSubmit();
        } else {
          throw new Error(response.message || 'Error al crear la deuda');
        }
      }
    } catch (error) {
      console.error('Error saving debt:', error);
      // Error notification will be handled by parent component
      onError?.(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 p-4'
      style={{ backgroundColor: '#00000099' }}
    >
      <div className='bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-auto'>
        <div className='flex justify-between items-center p-6 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>
            {debt ? `Editar Deuda: ${debt.description}` : 'Nueva Deuda'}
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 transition-colors'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='p-6 space-y-4'
        >
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Descripción
            </label>
            <input
              {...register('description')}
              type='text'
              className={cn(
                'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 bg-white',
                errors.description
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
              )}
              placeholder='Descripción de la deuda'
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Monto
              </label>
              <input
                {...register('amount', { valueAsNumber: true })}
                type='number'
                step='0.01'
                min='0'
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 bg-white',
                  errors.amount
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                )}
                placeholder='0.00'
              />
              {errors.amount && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Moneda
              </label>
              <select
                {...register('currency')}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white',
                  errors.currency
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                )}
              >
                <option value='EUR'>EUR</option>
                <option value='USD'>USD</option>
                <option value='GBP'>GBP</option>
              </select>
              {errors.currency && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Prioridad
              </label>
              <select
                {...register('priority')}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white',
                  errors.priority
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                )}
              >
                <option value='LOW'>Baja</option>
                <option value='MEDIUM'>Media</option>
                <option value='HIGH'>Alta</option>
                <option value='URGENT'>Urgente</option>
              </select>
              {errors.priority && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                  {errors.priority.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Categoría
              </label>
              <input
                {...register('category')}
                type='text'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white'
                placeholder='Opcional'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Fecha de Vencimiento
            </label>
            <input
              {...register('dueDate')}
              type='date'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Notas
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-500 bg-white'
              placeholder='Notas adicionales (opcional)'
            />
          </div>

          {!debt && (
            <>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Deudor
                </label>
                {isLoadingUsers ? (
                  <div className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center'>
                    <Loader2 className='animate-spin h-4 w-4 text-gray-500' />
                  </div>
                ) : (
                  <select
                    {...register('debtorId')}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-gray-900 bg-white',
                      errors.debtorId
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                    )}
                  >
                    <option value=''>Seleccionar deudor</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </option>
                    ))}
                  </select>
                )}
                {errors.debtorId && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.debtorId.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isLoading ? (
                <>
                  <Loader2 className='animate-spin -ml-1 mr-2 h-4 w-4' />
                  {debt ? 'Actualizando...' : 'Creando...'}
                </>
              ) : debt ? (
                'Actualizar Deuda'
              ) : (
                'Crear Deuda'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
