from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommandeViewSet, LigneCommandeViewSet

router = DefaultRouter()
router.register(r'items', LigneCommandeViewSet, basename='ordered-items')
router.register(r'', CommandeViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),
]
