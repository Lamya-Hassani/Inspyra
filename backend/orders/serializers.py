from rest_framework import serializers
from .models import Commande, LigneCommande, Paiement
from products.serializers import PlanteSerializer

class LigneCommandeSerializer(serializers.ModelSerializer):
    plante_details = PlanteSerializer(source='plante', read_only=True)

    class Meta:
        model = LigneCommande
        fields = ['id', 'commande', 'plante', 'plante_details', 'quantite', 'prix']
        extra_kwargs = {'commande': {'required': False}}

class PaiementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement
        fields = '__all__'

class CommandeSerializer(serializers.ModelSerializer):
    lignes = LigneCommandeSerializer(many=True)
    paiement = PaiementSerializer(read_only=True)
    utilisateur_username = serializers.ReadOnlyField(source='utilisateur.username')

    class Meta:
        model = Commande
        fields = ['id', 'utilisateur', 'utilisateur_username', 'date', 'statut', 'total', 'lignes', 'paiement']
        read_only_fields = ['utilisateur', 'total']

    def create(self, validated_data):
        lignes_data = validated_data.pop('lignes')
        commande = Commande.objects.create(**validated_data)
        for ligne_data in lignes_data:
            LigneCommande.objects.create(commande=commande, **ligne_data)
        commande.update_total()
        return commande
