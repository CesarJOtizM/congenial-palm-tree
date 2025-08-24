'use client';

import { cn, formatCurrency, formatDate } from '@lib/utils';
import apiService from '@services/api';
import { Debt, DebtQuery } from '@types';
import { CheckCircle, Edit, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DebtsListProps {
  onEditDebt: (debt: Debt) => void;
  onDeleteDebt: (debtId: string, debtName: string) => void;
  onMarkAsPaid: (debtId: string) => void;
  onRefresh?: () => void;
  isMarkingAsPaid: string | null;
}

export function DebtsList({
  onEditDebt,
  onDeleteDebt,
  onMarkAsPaid,
  onRefresh,
  isMarkingAsPaid,
}: DebtsListProps) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DebtQuery>({
    page: 1,
    limit: 20,
    status: undefined,
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  useEffect(() => {
    fetchDebts();
  }, [filters]);

  const fetchDebts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getDebts(filters);
      if (response.success && response.data) {
        setDebts(response.data.debts);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar las deudas'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (
    key: keyof DebtQuery,
    value?: string | boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const getStatusBadge = (
    status: string,
    isPaid: boolean,
    dueDate?: string
  ) => {
    // Si está pagada, mostrar como pagada independientemente del status
    if (isPaid) {
      return (
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
          Pagada
        </span>
      );
    }

    // Si no está pagada y tiene fecha de vencimiento, verificar si está vencida
    if (dueDate && isOverdue(dueDate)) {
      return (
        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
          Vencida
        </span>
      );
    }

    const statusConfig = {
      PENDING: {
        label: 'Pendiente',
        className: 'bg-yellow-100 text-yellow-800',
      },
      OVERDUE: { label: 'Vencida', className: 'bg-red-100 text-red-800' },
      CANCELLED: { label: 'Cancelada', className: 'bg-gray-100 text-gray-800' },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: { label: 'Baja', className: 'bg-gray-100 text-gray-800' },
      MEDIUM: { label: 'Media', className: 'bg-blue-100 text-blue-800' },
      HIGH: { label: 'Alta', className: 'bg-orange-100 text-orange-800' },
      URGENT: { label: 'Urgente', className: 'bg-red-100 text-red-800' },
    };

    const config =
      priorityConfig[priority as keyof typeof priorityConfig] ||
      priorityConfig.MEDIUM;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    );
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today;
  };

  const isDueSoon = (dueDate: string) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0; // Vence en 3 días o menos
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-md p-4'>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Filtros */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-medium text-gray-900'>Filtros</h3>
          <button
            onClick={onRefresh || fetchDebts}
            className='inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
            title='Recargar lista'
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            Recargar
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Buscar
            </label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='Buscar en descripción...'
                value={filters.search || ''}
                onChange={e => handleFilterChange('search', e.target.value)}
                className='pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Estado
            </label>
            <select
              value={filters.status || ''}
              onChange={e =>
                handleFilterChange('status', e.target.value || undefined)
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900'
            >
              <option value=''>Todos</option>
              <option value='PENDING'>Pendientes</option>
              <option value='PAID'>Pagadas</option>
              <option value='OVERDUE'>Vencidas</option>
              <option value='CANCELLED'>Canceladas</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Prioridad
            </label>
            <select
              value={filters.priority || ''}
              onChange={e =>
                handleFilterChange('priority', e.target.value || undefined)
              }
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900'
            >
              <option value=''>Todas</option>
              <option value='LOW'>Baja</option>
              <option value='MEDIUM'>Media</option>
              <option value='HIGH'>Alta</option>
              <option value='URGENT'>Urgente</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Estado de pago
            </label>
            <select
              value={
                filters.isPaid === undefined ? '' : filters.isPaid.toString()
              }
              onChange={e => {
                const value = e.target.value;
                handleFilterChange(
                  'isPaid',
                  value === '' ? undefined : value === 'true'
                );
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900'
            >
              <option value=''>Todos</option>
              <option value='false'>Pendientes</option>
              <option value='true'>Pagadas</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Solo vencidas
            </label>
            <select
              value={
                filters.overdue === undefined ? '' : filters.overdue.toString()
              }
              onChange={e => {
                const value = e.target.value;
                handleFilterChange(
                  'overdue',
                  value === '' ? undefined : value === 'true'
                );
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900'
            >
              <option value=''>Todas</option>
              <option value='true'>Solo vencidas</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Ordenar por
            </label>
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={e => handleFilterChange('sortBy', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900'
            >
              <option value='createdAt'>Fecha de creación</option>
              <option value='amount'>Monto</option>
              <option value='dueDate'>Fecha de vencimiento</option>
              <option value='priority'>Prioridad</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de deudas */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Lista de Deudas ({pagination.total})
              </h3>
            </div>
            <div className='flex items-center space-x-4 text-sm text-gray-600'>
              <span>
                Pendientes: {debts?.filter(d => !d.isPaid).length || 0}
              </span>
              <span className='text-orange-600'>
                Próximas a vencer:{' '}
                {debts?.filter(
                  d => !d.isPaid && d.dueDate && isDueSoon(d.dueDate)
                ).length || 0}
              </span>
              <span className='text-red-600'>
                Vencidas:{' '}
                {debts?.filter(
                  d => !d.isPaid && d.dueDate && isOverdue(d.dueDate)
                ).length || 0}
              </span>
              <span className='text-green-600'>
                Pagadas: {debts?.filter(d => d.isPaid).length || 0}
              </span>
            </div>
          </div>
        </div>

        {!debts || debts.length === 0 ? (
          <div className='px-6 py-12 text-center'>
            <p className='text-gray-500'>No se encontraron deudas</p>
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {debts.map(debt => (
              <div key={debt.id} className='px-6 py-4 hover:bg-gray-50'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-3'>
                      <p className='text-sm font-medium text-gray-900 truncate'>
                        {debt.description}
                      </p>
                      {getStatusBadge(debt.status, debt.isPaid, debt.dueDate)}
                      {getPriorityBadge(debt.priority)}
                    </div>
                    <p className='text-sm text-gray-500 mt-1'>
                      {debt.debtor.fullName} debe a {debt.creditor.fullName}
                    </p>
                    <div className='flex flex-wrap gap-2 mt-2'>
                      {debt.category && (
                        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700'>
                          {debt.category}
                        </span>
                      )}
                      {debt.notes && (
                        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700'>
                          {debt.notes}
                        </span>
                      )}
                    </div>
                    <div className='flex flex-wrap gap-4 mt-2 text-xs text-gray-500'>
                      {debt.dueDate && (
                        <span
                          className={
                            isOverdue(debt.dueDate) && !debt.isPaid
                              ? 'text-red-600 font-medium'
                              : isDueSoon(debt.dueDate) && !debt.isPaid
                                ? 'text-orange-600 font-medium'
                                : ''
                          }
                        >
                          <span className='font-medium'>Vence:</span>{' '}
                          {formatDate(debt.dueDate)}
                          {isOverdue(debt.dueDate) && !debt.isPaid && (
                            <span className='ml-1 text-red-600'>
                              ⚠️ Vencida
                            </span>
                          )}
                          {isDueSoon(debt.dueDate) && !debt.isPaid && (
                            <span className='ml-1 text-orange-600'>
                              ⚠️ Próximo a vencer
                            </span>
                          )}
                        </span>
                      )}
                      <span>
                        <span className='font-medium'>Creada:</span>{' '}
                        {formatDate(debt.createdAt)}
                      </span>
                      {debt.paidAt && (
                        <span>
                          <span className='font-medium'>Pagada:</span>{' '}
                          {formatDate(debt.paidAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='text-right'>
                      <div className='flex items-center gap-2 justify-end'>
                        <p className='text-lg font-semibold text-gray-900'>
                          {formatCurrency(debt.amount)}
                        </p>
                        <span className='text-sm text-gray-500 font-medium'>
                          {debt.currency}
                        </span>
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>
                        {debt.isPaid ? 'Pagada' : 'Pendiente'}
                      </p>
                    </div>

                    <div className='flex items-center space-x-2'>
                      {!debt.isPaid && (
                        <>
                          <button
                            onClick={() => onEditDebt(debt)}
                            className='p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50'
                            title='Editar'
                          >
                            <Edit className='h-4 w-4' />
                          </button>

                          <button
                            onClick={() => onMarkAsPaid(debt.id)}
                            disabled={isMarkingAsPaid === debt.id}
                            className='p-2 text-gray-400 hover:text-green-600 rounded-full hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Marcar como pagada'
                          >
                            {isMarkingAsPaid === debt.id ? (
                              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-green-600' />
                            ) : (
                              <CheckCircle className='h-4 w-4' />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              onDeleteDebt(debt.id, debt.description)
                            }
                            className='p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50'
                            title='Eliminar'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className='bg-white px-6 py-3 rounded-lg shadow'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-700'>
              Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{' '}
              de {pagination.total} resultados
            </div>

            <div className='flex space-x-2'>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className='px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Anterior
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md',
                    page === pagination.page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className='px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
