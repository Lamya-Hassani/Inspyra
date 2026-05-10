from rest_framework import viewsets, permissions
from .models import Commande, LigneCommande
from .serializers import CommandeSerializer, LigneCommandeSerializer
from users.permissions import IsAdminOrSuperAdmin

class CommandeViewSet(viewsets.ModelViewSet):
    serializer_class = CommandeSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminOrSuperAdmin()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = Commande.objects.all().prefetch_related('lignes__plante')
        if not self.request.user.is_authenticated:
            return Commande.objects.none()
        if not (self.request.user.is_staff or (hasattr(self.request.user, 'role') and self.request.user.role in ['ADMIN', 'SUPERADMIN'])):
            queryset = queryset.filter(utilisateur=self.request.user)
        
        statut = self.request.query_params.get('statut')
        if statut:
            queryset = queryset.filter(statut=statut)
        return queryset

    def perform_create(self, serializer):
        serializer.save(utilisateur=self.request.user)

class LigneCommandeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminOrSuperAdmin]
    serializer_class = LigneCommandeSerializer
    queryset = LigneCommande.objects.all()
