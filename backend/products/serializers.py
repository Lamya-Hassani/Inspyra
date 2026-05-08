from rest_framework import serializers
from .models import Categorie, Plante

class CategorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorie
        fields = ['id', 'nom']

class PlanteSerializer(serializers.ModelSerializer):
    categorie_nom = serializers.ReadOnlyField(source='categorie.nom')

    class Meta:
        model = Plante
        fields = [
            'id', 'nom', 'nomScientifique', 'prix', 'stock', 'description',
            'besoinEau', 'besoinLumiere', 'temperatureMin', 'temperatureMax',
            'humidite', 'typeSol', 'niveauEntretien', 'image', 'categorie', 'categorie_nom'
        ]
