from django.db import models

class Categorie(models.Model):
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom

class Plante(models.Model):
    nom = models.CharField(max_length=100)
    nomScientifique = models.CharField(max_length=200, blank=True, null=True)
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    besoinEau = models.CharField(max_length=100, blank=True, null=True)
    besoinLumiere = models.CharField(max_length=100, blank=True, null=True)
    temperatureMin = models.FloatField(blank=True, null=True)
    temperatureMax = models.FloatField(blank=True, null=True)
    humidite = models.FloatField(blank=True, null=True)
    typeSol = models.CharField(max_length=100, blank=True, null=True)
    niveauEntretien = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='plantes/', blank=True, null=True)
    categorie = models.ForeignKey(Categorie, on_delete=models.CASCADE, related_name='plantes')

    def __str__(self):
        return self.nom
