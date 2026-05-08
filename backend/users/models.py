from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('role', 'CLIENT')
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'SUPERADMIN')
        return self.create_user(username, email, password, **extra_fields)

class Utilisateur(AbstractUser):
    ROLE_CHOICES = [
        ('SUPERADMIN', 'Super Admin'),
        ('ADMIN', 'Admin'),
        ('CLIENT', 'Client'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CLIENT')
    telephone = models.CharField(max_length=20, blank=True, null=True)
    adresse = models.CharField(max_length=255, blank=True, null=True)
    ville = models.CharField(max_length=100, blank=True, null=True)
    codePostal = models.CharField(max_length=20, blank=True, null=True)
    pays = models.CharField(max_length=100, blank=True, null=True)
    dateCreation = models.DateTimeField(auto_now_add=True)
    
    objects = UserManager()

    def __str__(self):
        return f"{self.username} ({self.role})"
