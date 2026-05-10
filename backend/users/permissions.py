from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'role') and request.user.role == 'SUPERADMIN'

class IsAdminOrSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and hasattr(request.user, 'role') and request.user.role in ['ADMIN', 'SUPERADMIN']

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and hasattr(request.user, 'role') and request.user.role in ['ADMIN', 'SUPERADMIN']
