from django.db import models
from django.conf import settings

class UserPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='preference')
    
    # Sunlight requirements
    # "Lumière faible", "Lumière moyenne", "Lumière vive/Directe"
    LIGHT_CHOICES = [
        ('LOW', 'Faible Luminosité'),
        ('MEDIUM', 'Lumière Indirecte'),
        ('HIGH', 'Lumière Vive / Directe'),
    ]
    light_level = models.CharField(max_length=10, choices=LIGHT_CHOICES, default='MEDIUM')
    
    # Watering frequency
    # "Fréquent", "Modéré", "Rare"
    WATER_CHOICES = [
        ('FREQUENT', 'Fréquent (2+ fois par semaine)'),
        ('MODERATE', 'Modéré (1 fois par semaine)'),
        ('RARE', 'Rare (Toutes les 2-3 semaines)'),
    ]
    watering_frequency = models.CharField(max_length=10, choices=WATER_CHOICES, default='MODERATE')
    
    # Environment
    has_pets = models.BooleanField(default=False)
    has_children = models.BooleanField(default=False)
    
    # Experience
    EXPERIENCE_CHOICES = [
        ('BEGINNER', 'Débutant'),
        ('INTERMEDIATE', 'Intermédiaire'),
        ('EXPERT', 'Expert'),
    ]
    experience_level = models.CharField(max_length=15, choices=EXPERIENCE_CHOICES, default='BEGINNER')
    
    # Goal
    GOAL_CHOICES = [
        ('DECORATION', 'Décoration'),
        ('AIR_PURIFYING', 'Purification de l\'air'),
        ('MEDICINAL', 'Médicinal / Aromatique'),
        ('COLLECTION', 'Collection de plantes rares'),
    ]
    primary_goal = models.CharField(max_length=20, choices=GOAL_CHOICES, default='DECORATION')

    def __str__(self):
        return f"Préférences de {self.user.username}"
