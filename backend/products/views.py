from rest_framework import viewsets, views, status
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from .models import Categorie, Plante
from .serializers import CategorieSerializer, PlanteSerializer
from orders.models import Commande
from users.models import Utilisateur

from rest_framework.permissions import AllowAny
from users.permissions import IsAdminOrSuperAdmin, IsAdminOrReadOnly

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [IsAdminOrReadOnly]

class PlanteViewSet(viewsets.ModelViewSet):
    queryset = Plante.objects.all()
    serializer_class = PlanteSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role in ['ADMIN', 'SUPERADMIN']:
            queryset = Plante.objects.all()
        else:
            queryset = Plante.objects.filter(stock__gt=0)

        # Filter by category
        categorie = self.request.query_params.get('categorie')
        if categorie and categorie != 'all':
            queryset = queryset.filter(categorie_id=categorie)

        # Filter by maximum price
        max_price = self.request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(prix__lte=float(max_price))
            except ValueError:
                pass

        # Filter by search query
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nom__icontains=search) |
                Q(nomScientifique__icontains=search) |
                Q(description__icontains=search)
            )

        # Order by field
        ordering = self.request.query_params.get('ordering')
        if ordering:
            if ordering == '-date':
                queryset = queryset.order_by('-id')
            elif ordering in ['prix', '-prix', 'nom', '-nom']:
                queryset = queryset.order_by(ordering)

        return queryset

class DashboardStatsView(views.APIView):
    permission_classes = [IsAdminOrSuperAdmin]
    def get(self, request):
        total_sales = Commande.objects.filter(statut='DELIVERED').aggregate(Sum('total'))['total__sum'] or 0
        order_count = Commande.objects.count()
        client_count = Utilisateur.objects.filter(role='CLIENT').count()
        plant_count = Plante.objects.count()
        
        # Simple recent activity simulation based on orders
        recent_orders = Commande.objects.select_related('utilisateur', 'paiement').order_by('-date')[:5]
        activity = []
        for order in recent_orders:
            desc = f"Total: {order.total} DH"
            if hasattr(order, 'paiement'):
                desc += f" • {order.paiement.methode} ({order.paiement.statut})"
            
            activity.append({
                "id": order.id,
                "title": f"Commande de {order.utilisateur.username}",
                "desc": desc,
                "status": order.statut,
                "time": order.date.strftime("%Y-%m-%d %H:%M")
            })


        return Response({
            "total_sales": total_sales,
            "order_count": order_count,
            "client_count": client_count,
            "plant_count": plant_count,
            "recent_activity": activity
        })
