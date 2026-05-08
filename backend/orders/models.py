from django.db import models
from django.conf import settings
from products.models import Plante

class Commande(models.Model):
    STATUT_CHOICES = [
        ('PENDING', 'Pending'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    utilisateur = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='commandes')
    date = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='PENDING')
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def update_total(self):
        self.total = sum(item.prix * item.quantite for item in self.lignes.all())
        self.save()

    def __str__(self):
        return f"Commande {self.id} - {self.utilisateur.username}"

class LigneCommande(models.Model):
    commande = models.ForeignKey(Commande, on_delete=models.CASCADE, related_name='lignes')
    plante = models.ForeignKey(Plante, on_delete=models.CASCADE, related_name='lignes_commande')
    quantite = models.IntegerField(default=1)
    prix = models.DecimalField(max_digits=10, decimal_places=2) # Snapshotted price

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.commande.update_total()

    def delete(self, *args, **kwargs):
        commande = self.commande
        super().delete(*args, **kwargs)
        commande.update_total()

    def __str__(self):
        return f"{self.quantite}x {self.plante.nom}"

class Paiement(models.Model):
    METHODE_CHOICES = [
        ('CARD', 'Carte Bancaire'),
        ('PAYPAL', 'PayPal'),
        ('COD', 'Paiement à la livraison'),
    ]
    STATUT_CHOICES = [
        ('PENDING', 'En attente'),
        ('COMPLETED', 'Terminé'),
        ('FAILED', 'Échoué'),
        ('REFUNDED', 'Remboursé'),
    ]

    commande = models.OneToOneField(Commande, on_delete=models.CASCADE, related_name='paiement')
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    methode = models.CharField(max_length=20, choices=METHODE_CHOICES)
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='PENDING')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Paiement {self.id} - Commande {self.commande.id}"
