from django.urls import path
from .views import UserPreferenceDetailView, PlantRecommendationView, AdminUserPreferenceListView

urlpatterns = [
    path('preferences/', UserPreferenceDetailView.as_view(), name='user-preferences'),
    path('admin/all/', AdminUserPreferenceListView.as_view(), name='admin-user-preferences'),
    path('recommendations/', PlantRecommendationView.as_view(), name='plant-recommendations'),
]
