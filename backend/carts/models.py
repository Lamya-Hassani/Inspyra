from django.db import models
from django.conf import settings
from products.models import Plante

class Panier(models.Model):
    utilisateur = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='panier')
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Panier de {self.utilisateur.username}"

    @property
    def total(self):
        return sum(item.sous_total for item in self.articles.all())

class ArticlePanier(models.Model):
    panier = models.ForeignKey(Panier, related_name='articles', on_delete=models.CASCADE)
    plante = models.ForeignKey(Plante, on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantite} x {self.plante.nom}"

    @property
    def sous_total(self):
        return self.plante.prix * self.quantite
