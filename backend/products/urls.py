from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategorieViewSet, PlanteViewSet, DashboardStatsView

router = DefaultRouter()
router.register(r'categories', CategorieViewSet)
router.register(r'plantes', PlanteViewSet)

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('', include(router.urls)),
]
