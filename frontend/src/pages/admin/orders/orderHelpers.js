import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export const statusMap = {
  PENDING: 'Preparation',
  SHIPPED: 'Expedie',
  DELIVERED: 'Livre',
  CANCELLED: 'Annule',
  ALL: 'Tous les Statuts',
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'DELIVERED':
      return { icon: CheckCircle, className: 'text-emerald-500' };
    case 'SHIPPED':
      return { icon: Truck, className: 'text-blue-500' };
    case 'PENDING':
      return { icon: Clock, className: 'text-amber-500' };
    default:
      return { icon: Package, className: 'text-gray-500' };
  }
};

export const exportOrdersCsv = (orders, statusFilter) => {
  const headers = ['Commande ID', 'Client', 'Date', 'Total (DH)', 'Statut'];
  const rows = orders.map((o) => [
    `ORD-${o.id}`,
    o.utilisateur_username,
    o.date.split('T')[0],
    o.total,
    statusMap[o.statut],
  ]);

  const csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n${rows.map((e) => e.join(',')).join('\n')}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Inspyra_Orders_${statusFilter}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
