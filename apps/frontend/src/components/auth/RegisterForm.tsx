'use client';

import { useAuth } from '@contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@lib/utils';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );
    } catch (error) {
      setError('root', {
        type: 'manual',
        message:
          error instanceof Error ? error.message : 'Error en el registro',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md space-y-8'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold text-gray-900'>Crear Cuenta</h2>
        <p className='mt-2 text-sm text-gray-600'>
          Regístrate para comenzar a gestionar tus deudas
        </p>
      </div>

      <form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label
                htmlFor='firstName'
                className='block text-sm font-medium text-gray-700'
              >
                Nombre
              </label>
              <input
                {...register('firstName')}
                type='text'
                id='firstName'
                className={cn(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500',
                  errors.firstName
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
                placeholder='Tu nombre'
              />
              {errors.firstName && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='lastName'
                className='block text-sm font-medium text-gray-700'
              >
                Apellido
              </label>
              <input
                {...register('lastName')}
                type='text'
                id='lastName'
                className={cn(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500',
                  errors.lastName
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
                placeholder='Tu apellido'
              />
              {errors.lastName && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              {...register('email')}
              type='email'
              id='email'
              className={cn(
                'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500',
                errors.email
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              )}
              placeholder='tu@email.com'
            />
            {errors.email && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Contraseña
            </label>
            <div className='relative'>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id='password'
                className={cn(
                  'mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500',
                  errors.password
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
                placeholder='••••••••'
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5 text-gray-400' />
                ) : (
                  <Eye className='h-5 w-5 text-gray-400' />
                )}
              </button>
            </div>
            {errors.password && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700'
            >
              Confirmar Contraseña
            </label>
            <div className='relative'>
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                className={cn(
                  'mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500',
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                )}
                placeholder='••••••••'
              />
              <button
                type='button'
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5 text-gray-400' />
                ) : (
                  <Eye className='h-5 w-5 text-gray-400' />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {errors.root && (
          <div className='rounded-md bg-red-50 p-4'>
            <p className='text-sm text-red-600'>{errors.root.message}</p>
          </div>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? (
            <>
              <Loader2 className='animate-spin -ml-1 mr-2 h-4 w-4' />
              Creando cuenta...
            </>
          ) : (
            'Crear Cuenta'
          )}
        </button>

        <div className='text-center'>
          <button
            type='button'
            onClick={onSwitchToLogin}
            className='text-sm text-blue-600 hover:text-blue-500'
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </button>
        </div>
      </form>
    </div>
  );
}
