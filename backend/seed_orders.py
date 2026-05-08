import os
import django
import random
from decimal import Decimal

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import Utilisateur
from products.models import Plante
from orders.models import Commande, LigneCommande

def seed_orders(num_orders=30):
    print("🌿 Démarrage de la génération des commandes (Inspyra Orders Seeder)...")
    
    clients = list(Utilisateur.objects.filter(role='CLIENT'))
    if not clients:
        print("⚠️ Aucun client trouvé. Utilisation de tous les utilisateurs disponibles...")
        clients = list(Utilisateur.objects.all())
        
    plants = list(Plante.objects.all())
    
    if not clients or not plants:
        print("❌ Erreur : Veuillez vous assurer d'avoir des clients et des plantes dans la base de données avant de générer des commandes.")
        return

    statuses = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    # Weights favour delivered and pending for realistic data
    status_weights = [0.25, 0.20, 0.45, 0.10]
    
    print(f"📦 Génération de {num_orders} commandes pour {len(clients)} clients utilisant {len(plants)} plantes disponibles...")
    
    orders_created = 0

    for _ in range(num_orders):
        client = random.choice(clients)
        status = random.choices(statuses, weights=status_weights)[0]
        
        # Initialize order
        commande = Commande.objects.create(
            utilisateur=client,
            statut=status,
            total=Decimal('0.00')
        )
        
        # Add random items to the order (1 to 4 unique plants)
        num_items = random.randint(1, 4)
        selected_plants = random.sample(plants, min(num_items, len(plants)))
        
        order_total = Decimal('0.00')
        
        for plant in selected_plants:
            quantite = random.randint(1, 3)
            # Fetch the snapshot price from the plant
            prix = plant.prix
            
            # Calculate line subtotal
            line_total = prix * quantite
            order_total += line_total
            
            # Create line item
            LigneCommande.objects.create(
                commande=commande,
                plante=plant,
                quantite=quantite,
                prix=prix
            )
            
        # Update order total
        commande.total = order_total
        commande.save()
        orders_created += 1
        print(f"✅ Création: Commande #{commande.id} pour {client.username} | Statut: {status} | Total: {commande.total} DH")

    print(f"🎉 Succès ! {orders_created} commandes ont été générées et insérées dans la base de données.")

if __name__ == '__main__':
    # You can change the number of orders if you want
    seed_orders(num_orders=25)
