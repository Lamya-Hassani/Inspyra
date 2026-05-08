from rest_framework import viewsets, views, status
from rest_framework.response import Response
from django.db.models import Sum, Count
from .models import Categorie, Plante
from .serializers import CategorieSerializer, PlanteSerializer
from orders.models import Commande
from users.models import Utilisateur

from rest_framework.permissions import AllowAny

class CategorieViewSet(viewsets.ModelViewSet):
    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    permission_classes = [AllowAny]

class PlanteViewSet(viewsets.ModelViewSet):
    queryset = Plante.objects.all()
    serializer_class = PlanteSerializer
    permission_classes = [AllowAny]

class DashboardStatsView(views.APIView):
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
