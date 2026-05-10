from rest_framework import generics, permissions, response
from .models import UserPreference
from .serializers import UserPreferenceSerializer
from products.models import Plante
from products.serializers import PlanteSerializer
from django.db.models import Q
from users.permissions import IsAdminOrSuperAdmin

class AdminUserPreferenceListView(generics.ListAPIView):
    queryset = UserPreference.objects.all().select_related('user')
    serializer_class = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrSuperAdmin]

class UserPreferenceDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, created = UserPreference.objects.get_or_create(user=self.request.user)
        return obj

class PlantRecommendationView(generics.ListAPIView):
    serializer_class = PlanteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            pref = self.request.user.preference
        except UserPreference.DoesNotExist:
            return Plante.objects.none()

        queryset = Plante.objects.all()
        
        # 1. Experience Level & Maintenance
        if pref.experience_level == 'BEGINNER':
            queryset = queryset.filter(niveauEntretien__in=['Très facile', 'Facile'])
        elif pref.experience_level == 'INTERMEDIATE':
            queryset = queryset.filter(niveauEntretien__in=['Facile', 'Moyen'])
        
        # 2. Light Level
        if pref.light_level == 'LOW':
            queryset = queryset.filter(
                Q(besoinLumiere__icontains='faible') | 
                Q(besoinLumiere__icontains='ombre') |
                Q(besoinLumiere__icontains='indirecte')
            )
        elif pref.light_level == 'MEDIUM':
            queryset = queryset.filter(
                Q(besoinLumiere__icontains='indirecte') | 
                Q(besoinLumiere__icontains='moyenne')
            )
        elif pref.light_level == 'HIGH':
            queryset = queryset.filter(
                Q(besoinLumiere__icontains='directe') | 
                Q(besoinLumiere__icontains='soleil') |
                Q(besoinLumiere__icontains='vive')
            )

        # 3. Watering Frequency
        if pref.watering_frequency == 'RARE':
            queryset = queryset.filter(
                Q(besoinEau__icontains='mois') | 
                Q(besoinEau__icontains='2-3 semaines') |
                Q(besoinEau__icontains='3 semaines') |
                Q(besoinEau__icontains='2 semaines')
            )
        elif pref.watering_frequency == 'MODERATE':
            queryset = queryset.filter(besoinEau__icontains='Une fois par semaine')
        elif pref.watering_frequency == 'FREQUENT':
            queryset = queryset.filter(
                Q(besoinEau__icontains='Deux fois') | 
                Q(besoinEau__icontains='quotidien')
            )

        # 4. Primary Goal
        if pref.primary_goal == 'AIR_PURIFYING':
            queryset = queryset.filter(
                Q(description__icontains='purifie') | 
                Q(categorie__nom__icontains='Air')
            )
        elif pref.primary_goal == 'MEDICINAL':
            queryset = queryset.filter(categorie__nom__icontains='Aromatiques')
        elif pref.primary_goal == 'COLLECTION':
            queryset = queryset.filter(categorie__nom__icontains='Rares')

        return queryset[:6] # Return top 6 recommendations
