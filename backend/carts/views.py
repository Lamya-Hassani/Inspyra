from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Panier, ArticlePanier
from .serializers import PanierSerializer, ArticlePanierSerializer
from orders.models import Commande, LigneCommande, Paiement
from orders.serializers import CommandeSerializer
from django.db import transaction

class PanierViewSet(viewsets.ModelViewSet):
    serializer_class = PanierSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Panier.objects.filter(utilisateur=self.request.user)

    def get_instance(self):
        panier, created = Panier.objects.get_or_create(utilisateur=self.request.user)
        return panier

    def list(self, request, *args, **kwargs):
        panier = self.get_instance()
        serializer = self.get_serializer(panier)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        panier = self.get_instance()
        plante_id = request.data.get('plante_id')
        quantite = int(request.data.get('quantite', 1))
        
        article, created = ArticlePanier.objects.get_or_create(
            panier=panier, 
            plante_id=plante_id
        )
        if not created:
            article.quantite += quantite
        else:
            article.quantite = quantite
        article.save()
        
        return Response(self.get_serializer(panier).data)

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        panier = self.get_instance()
        plante_id = request.data.get('plante_id')
        quantite = int(request.data.get('quantite'))
        
        try:
            article = ArticlePanier.objects.get(panier=panier, plante_id=plante_id)
            if quantite > 0:
                article.quantite = quantite
                article.save()
            else:
                article.delete()
        except ArticlePanier.DoesNotExist:
            return Response({"error": "Article non trouvé"}, status=status.HTTP_404_NOT_FOUND)
            
        return Response(self.get_serializer(panier).data)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        panier = self.get_instance()
        plante_id = request.data.get('plante_id')
        ArticlePanier.objects.filter(panier=panier, plante_id=plante_id).delete()
        return Response(self.get_serializer(panier).data)

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def checkout(self, request):
        panier = self.get_instance()
        if not panier.articles.exists():
            return Response({"error": "Le panier est vide"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Create Order
        commande = Commande.objects.create(
            utilisateur=request.user,
            statut='PENDING',
            total=panier.total
        )

        # 2. Create Order Lines
        for art in panier.articles.all():
            LigneCommande.objects.create(
                commande=commande,
                plante=art.plante,
                quantite=art.quantite,
                prix=art.plante.prix # Snapshot current price
            )
            # Update Stock
            art.plante.stock -= art.quantite
            art.plante.save()

        # 3. Create Payment record (Initial)
        methode = request.data.get('methode', 'CARD')
        Paiement.objects.create(
            commande=commande,
            montant=commande.total,
            methode=methode,
            statut='PENDING'
        )

        # 4. Clear Cart
        panier.articles.all().delete()

        return Response({
            "message": "Commande créée avec succès",
            "commande_id": commande.id
        }, status=status.HTTP_201_CREATED)
