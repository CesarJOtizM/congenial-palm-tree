'use client';

import { DeleteConfirmationModal } from '@components/common/DeleteConfirmationModal';
import { DebtForm } from '@components/debts/DebtForm';
import { DebtsList } from '@components/debts/DebtsList';
import { useNotifications } from '@contexts/NotificationContext';
import { formatCurrency } from '@lib/utils';
import apiService from '@services/api';
import { DashboardSummary, Debt } from '@types';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Plus,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function Dashboard() {
  const { addNotification } = useNotifications();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDebtFormOpen, setIsDebtFormOpen] = useState(false);
  const [debtToEdit, setDebtToEdit] = useState<Debt | null>(null);
  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    debtId: string | null;
    debtName: string;
  }>({
    isOpen: false,
    debtId: null,
    debtName: '',
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await apiService.getDashboardSummary();
        if (response.success && response.data) {
          setSummary(response.data);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar el dashboard';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handleDebtCreated = () => {
    const isEditing = !!debtToEdit;
    setIsDebtFormOpen(false);
    setDebtToEdit(null);

    // Mostrar notificación apropiada
    addNotification({
      type: 'success',
      title: isEditing ? 'Deuda actualizada' : 'Deuda creada',
      message: isEditing
        ? 'La deuda ha sido actualizada exitosamente'
        : 'La deuda ha sido creada exitosamente',
      duration: 3000,
    });

    // Recargar el dashboard para mostrar las nuevas estadísticas
    window.location.reload();
  };

  const handleDebtError = (error: Error) => {
    const isEditing = !!debtToEdit;
    addNotification({
      type: 'error',
      title: isEditing ? 'Error al actualizar' : 'Error al crear',
      message:
        error.message ||
        (isEditing
          ? 'No se pudo actualizar la deuda'
          : 'No se pudo crear la deuda'),
      duration: 5000,
    });
  };

  const refreshDebtsList = () => {
    // Esta función se puede usar para recargar la lista de deudas
    // Por ahora solo recargamos el dashboard completo
    window.location.reload();
  };

  const handleEditDebt = (debt: Debt) => {
    setDebtToEdit(debt);
    setIsDebtFormOpen(true);
  };

  const handleDeleteDebt = (debtId: string, debtName: string) => {
    setDeleteModal({
      isOpen: true,
      debtId,
      debtName,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.debtId) return;

    try {
      setIsDeleting(true);

      const response = await apiService.deleteDebt(deleteModal.debtId);

      if (response.success) {
        // Actualizar el resumen del dashboard
        const updatedSummary = await apiService.getDashboardSummary();
        if (updatedSummary.success && updatedSummary.data) {
          setSummary(updatedSummary.data);
        }

        // Mostrar notificación de éxito
        addNotification({
          type: 'success',
          title: 'Deuda eliminada',
          message: 'La deuda ha sido eliminada exitosamente',
          duration: 3000,
        });

        // Cerrar el modal
        setDeleteModal({
          isOpen: false,
          debtId: null,
          debtName: '',
        });

        // Recargar la lista de deudas
        refreshDebtsList();
      } else {
        // Mostrar notificación de error
        addNotification({
          type: 'error',
          title: 'Error al eliminar',
          message: response.message || 'No se pudo eliminar la deuda',
          duration: 5000,
        });
      }
    } catch (_error) {
      // Mostrar notificación de error
      addNotification({
        type: 'error',
        title: 'Error al eliminar',
        message: 'Ocurrió un error inesperado al eliminar la deuda',
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({
      isOpen: false,
      debtId: null,
      debtName: '',
    });
  };

  const handleMarkAsPaid = async (debtId: string) => {
    try {
      setIsMarkingAsPaid(debtId);

      const response = await apiService.markDebtAsPaid(debtId);

      if (response.success) {
        // Actualizar el resumen del dashboard
        const updatedSummary = await apiService.getDashboardSummary();
        if (updatedSummary.success && updatedSummary.data) {
          setSummary(updatedSummary.data);
        }

        // Mostrar notificación de éxito
        addNotification({
          type: 'success',
          title: 'Deuda marcada como pagada',
          message: 'La deuda ha sido marcada como pagada exitosamente',
          duration: 3000,
        });
      } else {
        // Mostrar notificación de error
        addNotification({
          type: 'error',
          title: 'Error al marcar como pagada',
          message: response.message || 'No se pudo marcar la deuda como pagada',
          duration: 5000,
        });
      }
    } catch (_error) {
      // Mostrar notificación de error
      addNotification({
        type: 'error',
        title: 'Error al marcar como pagada',
        message: 'Ocurrió un error inesperado al marcar la deuda como pagada',
        duration: 5000,
      });
    } finally {
      setIsMarkingAsPaid(null);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4' />
          <p className='text-gray-600'>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-xl p-6'>
        <div className='flex items-center'>
          <AlertTriangle className='h-5 w-5 text-red-600 mr-3' />
          <p className='text-red-600 font-medium'>{error}</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const stats = [
    {
      title: 'Total Deudas',
      value: formatCurrency(summary.totalDebts.totalAmount),
      description: `${summary.totalDebts.count} deudas en total`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pendientes',
      value: summary.pendingDebts.count.toString(),
      description: 'Deudas por cobrar',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Pagadas',
      value: summary.paidDebts.count.toString(),
      description: 'Deudas completadas',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Vencidas',
      value: summary.debtsByStatus.OVERDUE.count.toString(),
      description: 'Requieren atención',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard</h1>
        <p className='text-gray-600'>
          Gestiona tus deudas de forma sencilla y eficiente
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200'
          >
            <div className='flex items-center justify-between mb-4'>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-600 mb-1'>
                {stat.title}
              </p>
              <p className='text-2xl font-bold text-gray-900 mb-1'>
                {stat.value}
              </p>
              <p className='text-sm text-gray-600'>{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contenido principal - Lista de deudas */}
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
        <div className='flex justify-between items-center w-full'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Lista de Deudas
          </h3>
          <button
            onClick={() => setIsDebtFormOpen(true)}
            className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
          >
            <Plus className='h-4 w-4 mr-2' />
            Crear Deuda
          </button>
        </div>
        <DebtsList
          onEditDebt={handleEditDebt}
          onDeleteDebt={handleDeleteDebt}
          onMarkAsPaid={handleMarkAsPaid}
          onRefresh={refreshDebtsList}
          isMarkingAsPaid={isMarkingAsPaid}
        />
      </div>

      {/* Modal de creación de deuda */}
      <DebtForm
        debt={debtToEdit}
        isOpen={isDebtFormOpen}
        onClose={() => {
          setIsDebtFormOpen(false);
          setDebtToEdit(null);
        }}
        onSubmit={handleDebtCreated}
        onError={handleDebtError}
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.debtName}
        itemType='deuda'
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
