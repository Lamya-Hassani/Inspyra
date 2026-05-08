from django.urls import path
from .views import UserPreferenceDetailView, PlantRecommendationView

urlpatterns = [
    path('preferences/', UserPreferenceDetailView.as_view(), name='user-preferences'),
    path('recommendations/', PlantRecommendationView.as_view(), name='plant-recommendations'),
]
