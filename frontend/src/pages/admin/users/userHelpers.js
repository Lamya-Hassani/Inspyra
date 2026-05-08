export const emptyUser = {
  username: '',
  email: '',
  role: 'CLIENT',
  telephone: '',
  adresse: '',
  ville: '',
  codePostal: '',
  password: '',
  confirmPassword: '',
};

export const getVisibleUsers = (users, currentUserRole) => {
  if (currentUserRole === 'ADMIN') return users.filter((u) => u.role === 'CLIENT');
  return users;
};

export const getFilteredUsers = (users, searchTerm, filter, currentUserRole) =>
  users.filter((u) => {
    const matchesSearch = u.username.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'ALL') return matchesSearch;
    if (currentUserRole === 'SUPERADMIN') return matchesSearch && u.role === filter;
    const activeState = u.is_active !== false;
    if (filter === 'ACTIVE') return matchesSearch && activeState;
    if (filter === 'INACTIVE') return matchesSearch && !activeState;
    return matchesSearch;
  });
