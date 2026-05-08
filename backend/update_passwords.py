import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import Utilisateur
from django.contrib.auth.hashers import make_password

def update_passwords():
    print("🔒 Modification des mots de passe de tous les utilisateurs (Inspyra Password Resetter)...")
    
    users = list(Utilisateur.objects.all())
    
    if not users:
        print("⚠️ Aucun utilisateur trouvé.")
        return

    updated_count = 0
    hashed_password = make_password('azsq')

    for user in users:
        user.password = hashed_password
        user.save(update_fields=['password'])
        updated_count += 1
        print(f"✅ Mdp mis à jour: {user.username} (Role: {user.role})")

    print(f"🎉 Succès ! Le mot de passe de {updated_count} utilisateurs a été changé avec succès.")

if __name__ == '__main__':
    update_passwords()
