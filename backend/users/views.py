from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from .models import Utilisateur
from .serializers import UtilisateurSerializer, CustomTokenObtainPairSerializer
from .permissions import IsSuperAdmin, IsAdminOrSuperAdmin

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = Utilisateur.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UtilisateurSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer

    def get_permissions(self):
        if self.action == 'me':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdminOrSuperAdmin()]

    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

