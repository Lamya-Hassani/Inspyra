from rest_framework import serializers
from .models import Panier, ArticlePanier
from products.serializers import PlanteSerializer

class ArticlePanierSerializer(serializers.ModelSerializer):
    plante_details = PlanteSerializer(source='plante', read_only=True)
    sous_total = serializers.ReadOnlyField()

    class Meta:
        model = ArticlePanier
        fields = ['id', 'plante', 'plante_details', 'quantite', 'sous_total']

class PanierSerializer(serializers.ModelSerializer):
    articles = ArticlePanierSerializer(many=True, read_only=True)
    total = serializers.ReadOnlyField()

    class Meta:
        model = Panier
        fields = ['id', 'utilisateur', 'articles', 'total', 'date_modification']
