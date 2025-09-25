// src/components/Projects/utils.ts

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sk-SK', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const calculateDaysLeft = (endDate: string): number => {
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getProgressColor = (progress: number): string => {
  if (progress === 100) return 'bg-green-500';
  if (progress >= 70) return 'bg-blue-500';
  if (progress >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getBudgetStatusColor = (spent: number, budget: number): string => {
  const percentage = spent / budget;
  if (percentage > 0.9) return 'bg-red-500';
  if (percentage > 0.7) return 'bg-yellow-500';
  return 'bg-green-500';
};

export const getDaysLeftText = (daysLeft: number, status: string): string => {
  if (status !== 'active') return '';
  
  if (daysLeft < 0) {
    return `${Math.abs(daysLeft)} dní po termíne`;
  } else if (daysLeft === 0) {
    return 'Dnes je deadline!';
  } else if (daysLeft === 1) {
    return '1 deň zostáva';
  } else if (daysLeft <= 7) {
    return `${daysLeft} dní zostáva`;
  } else if (daysLeft <= 30) {
    const weeks = Math.floor(daysLeft / 7);
    return `${weeks} ${weeks === 1 ? 'týždeň' : weeks < 5 ? 'týždne' : 'týždňov'} zostáva`;
  } else {
    const months = Math.floor(daysLeft / 30);
    return `${months} ${months === 1 ? 'mesiac' : months < 5 ? 'mesiace' : 'mesiacov'} zostáva`;
  }
};