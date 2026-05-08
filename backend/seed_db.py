import os
import django
import requests
import random
from decimal import Decimal
from datetime import timedelta
from collections import defaultdict
from faker import Faker
from django.core.files.base import ContentFile
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from products.models import Categorie, Plante
from users.models import Utilisateur
from orders.models import Commande, LigneCommande

fake = Faker('fr_FR')


# -------------------- UTILITIES --------------------

def download_image(url, filename):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return ContentFile(response.content, name=filename)
    except:
        return None

def get_plant_image_url(name):
    query = name.replace(" ", "+")
    return f"https://source.unsplash.com/600x600/?{query},plant"

def weighted_choice(items, weights):
    return random.choices(items, weights=weights, k=1)[0]

def seasonal_multiplier(date):
    if date.month in [3,4,5]: return 1.4  # Spring boom
    if date.month in [7,8]: return 0.8    # Summer drop
    return 1.0


# -------------------- CLIENT GENERATION --------------------

def generate_clients(n=120):
    clients = []

    first_names = [
        "Yassine","Sara","Omar","Ikram","Mehdi","Fatima","Ahmed","Leila",
        "Hassan","Nadia","Karim","Sofia","Rachid","Amina","Khalid","Meryem",
        "Badr","Zineb","Younes","Salma","Hamza","Imane","Zakaria","Loubna",
        "Anas","Hajar","Soufiane","Nawal","Tarik","Samira","Ayoub","Chaimae"
    ]

    last_names = [
        "Benali","El Idrissi","Bennani","Cherkaoui","Lahlou","Amrani",
        "Zouhair","Hakimi","Rami","Saidi","Tazi","Fassi","Mouline",
        "Boussaid","Kabbaj","El Amrani","Berkani","Mansouri","Alaoui",
        "Skalli","Zerouali","Ouazzani","Chraibi","Berrada"
    ]

    cities = [
        ("Casablanca","20000"),
        ("Rabat","10000"),
        ("Marrakech","40000"),
        ("Fès","30000"),
        ("Tanger","90000"),
        ("Agadir","80000"),
        ("Meknès","50000"),
        ("Oujda","60000")
    ]

    streets = [
        "Rue Zerktouni","Boulevard Anfa","Avenue Hassan II",
        "Rue Mohammed V","Boulevard Abdelmoumen",
        "Avenue FAR","Quartier Maarif","Hay Riad"
    ]

    for _ in range(n):
        fn = random.choice(first_names)
        ln = random.choice(last_names)

        username = f"{fn.lower()}_{ln.lower()[:3]}{random.randint(100,999)}"
        email = f"{username}@gmail.com"

        city, postal = random.choice(cities)
        street = random.choice(streets)

        profile = weighted_choice(['LOW','MEDIUM','HIGH'], [50,35,15])

        user = Utilisateur.objects.create_user(
            username=username,
            email=email,
            password='azsq',
            first_name=fn,
            last_name=ln,
            role='CLIENT',

            telephone=f"+2126{random.randint(10000000,99999999)}",
            adresse=f"{random.randint(1,200)} {street}",
            ville=city,
            codePostal=postal,
            pays="Maroc"
        )

        user.profile_type = profile
        clients.append(user)

    admin_street = random.choice(streets)
    user = Utilisateur.objects.create_user(
        username="lamya",
        email="lamya@gmail.com",
        password='azsq',
        first_name="lamya",
        last_name="hassani",
        role='SUPERADMIN',

        telephone=f"+2126{random.randint(10000000,99999999)}",
        adresse=f"{random.randint(1,200)} {admin_street}",
        ville="Casablanca",
        codePostal="20000",
        pays="Maroc"
    )
    clients.append(user)
    user2 = Utilisateur.objects.create_user(
        username="root",
        email="root@gmail.com",
        password='azsq',
        first_name="root",
        last_name="hassani",
        role='ADMIN',

        telephone=f"+2126{random.randint(10000000,99999999)}",
        adresse=f"{random.randint(1,200)} {admin_street}",
        ville="Casablanca",
        codePostal="20000",
        pays="Maroc"
    )
    clients.append(user2)
    return clients


# -------------------- ORDER GENERATION --------------------

def generate_orders(clients, plants, total_orders=400):
    now = timezone.now()
    plant_sales = defaultdict(int)

    for _ in range(total_orders):
        client = random.choice(clients)

        # Behavior filter
        if hasattr(client, 'profile_type'):
            if client.profile_type == 'LOW' and random.random() > 0.3:
                continue
            if client.profile_type == 'HIGH' and random.random() > 0.8:
                continue

        days_ago = int(random.expovariate(1/20))
        order_date = now - timedelta(days=min(days_ago, 90))

        order = Commande.objects.create(
            utilisateur=client,
            statut=weighted_choice(
                ['PENDING','SHIPPED','DELIVERED','CANCELLED'],
                [10,25,55,10]
            ),
            total=0
        )

        multiplier = seasonal_multiplier(order_date)
        items = random.sample(plants, random.randint(1,4))

        total_price = Decimal("0.00")

        for plant in items:
            if plant.stock <= 0:
                continue

            qty = random.randint(1,2)

            price = plant.prix * Decimal(str(random.uniform(0.9,1.1)))

            LigneCommande.objects.create(
                commande=order,
                plante=plant,
                quantite=qty,
                prix=price
            )

            total_price += price * qty

            # Stock reduction
            plant.stock = max(0, plant.stock - qty)
            plant.save()

            plant_sales[plant.nom] += qty

        total_price *= Decimal(str(multiplier))

        order.total = round(total_price, 2)
        order.save()

        Commande.objects.filter(id=order.id).update(date=order_date)

    print("\n📊 TOP SELLERS:")
    for p,c in sorted(plant_sales.items(), key=lambda x:-x[1])[:5]:
        print(f"{p}: {c} ventes")


# -------------------- MAIN SEED --------------------

def seed():
    print("Cleaning database...")
    LigneCommande.objects.all().delete()
    Commande.objects.all().delete()
    Plante.objects.all().delete()
    Categorie.objects.all().delete()
    Utilisateur.objects.filter(is_superuser=False).delete()

    print("Creating categories...")
    cats = {
        "Intérieur": Categorie.objects.create(nom="Plantes d'Intérieur"),
        "Extérieur": Categorie.objects.create(nom="Plantes d'Extérieur"),
        "Succulentes": Categorie.objects.create(nom="Succulentes & Cactus"),
        "Rares": Categorie.objects.create(nom="Plantes Rares"),
        "Vibrantes": Categorie.objects.create(nom="Feuillages Colorés"),
        "Tropicales": Categorie.objects.create(nom="Plantes Tropicales"),
        "Aromatiques": Categorie.objects.create(nom="Plantes Aromatiques"),
        "Fleurs": Categorie.objects.create(nom="Plantes à Fleurs"),
        "Air": Categorie.objects.create(nom="Plantes Purificatrices d'Air"),
    }

    print("Creating plants...")

    plants_pool = [
        {"nom": "Monstera Deliciosa", "nomScientifique": "Monstera deliciosa", "prix": 450, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600",
         "description": "Plante tropicale emblématique aux grandes feuilles fenêtrées. Idéale pour un intérieur moderne et purifie l'air.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte brillante", 
         "temperatureMin": 18.0, "temperatureMax": 30.0, "humidite": 70.0, 
         "typeSol": "Terreau riche et bien drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Langue de Belle-Mère", "nomScientifique": "Dracaena trifasciata", "prix": 250, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1593482892290-f54927ae1bf7?q=80&w=600",
         "description": "Plante ultra-résistante et purificatrice d'air. Parfaite pour les débutants et les espaces peu lumineux.",
         "besoinEau": "Toutes les 2-3 semaines", "besoinLumiere": "Lumière faible à moyenne", 
         "temperatureMin": 15.0, "temperatureMax": 28.0, "humidite": 40.0, 
         "typeSol": "Terreau pour cactus", "niveauEntretien": "Très facile"},
        
        {"nom": "Ficus Lyrata", "nomScientifique": "Ficus lyrata", "prix": 850, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1597055181300-e3633a90750a?q=80&w=600",
         "description": "Arbre d'intérieur majestueux aux feuilles larges en forme de violon. Apporte une touche élégante.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte vive", 
         "temperatureMin": 18.0, "temperatureMax": 27.0, "humidite": 50.0, 
         "typeSol": "Terreau bien drainé", "niveauEntretien": "Moyen"},
        
        {"nom": "Aloe Vera", "nomScientifique": "Aloe vera", "prix": 120, "cat": "Succulentes", 
         "img": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600",
         "description": "Plante médicinale aux feuilles charnues. Apaise les brûlures et purifie l'air.",
         "besoinEau": "Toutes les 2-3 semaines", "besoinLumiere": "Lumière directe", 
         "temperatureMin": 10.0, "temperatureMax": 30.0, "humidite": 30.0, 
         "typeSol": "Terreau pour cactus", "niveauEntretien": "Très facile"},
        
        {"nom": "Calathea Orbifolia", "nomScientifique": "Calathea orbifolia", "prix": 380, "cat": "Vibrantes", 
         "img": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600",
         "description": "Feuilles rondes rayées magnifiques. Plante tropicale qui bouge avec la lumière.",
         "besoinEau": "Deux fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 18.0, "temperatureMax": 27.0, "humidite": 80.0, 
         "typeSol": "Terreau humide et drainé", "niveauEntretien": "Moyen"},
        
        {"nom": "Philodendron Pink Princess", "nomScientifique": "Philodendron erubescens", "prix": 1200, "cat": "Rares", 
         "img": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600",
         "description": "Variété rare aux feuilles roses et vertes. Très recherchée par les collectionneurs.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte vive", 
         "temperatureMin": 18.0, "temperatureMax": 28.0, "humidite": 60.0, 
         "typeSol": "Terreau aéré", "niveauEntretien": "Moyen"},
        
        {"nom": "Cactus Doré", "nomScientifique": "Echinocactus grusonii", "prix": 550, "cat": "Succulentes", 
         "img": "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?q=80&w=600",
         "description": "Cactus sphérique emblématique, très décoratif et résistant à la sécheresse.",
         "besoinEau": "Une fois par mois", "besoinLumiere": "Plein soleil", 
         "temperatureMin": 10.0, "temperatureMax": 35.0, "humidite": 20.0, 
         "typeSol": "Terreau pour cactus", "niveauEntretien": "Très facile"},
        
        {"nom": "Bonsaï Ficus", "nomScientifique": "Ficus retusa", "prix": 950, "cat": "Rares", 
         "img": "https://images.unsplash.com/photo-1512423175375-a013426ea939?q=80&w=600",
         "description": "Mini-arbre d'art japonais. Requiert taille régulière pour maintenir sa forme.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 15.0, "temperatureMax": 28.0, "humidite": 50.0, 
         "typeSol": "Terreau spécial bonsaï", "niveauEntretien": "Avancé"},
        
        {"nom": "Pothos Doré", "nomScientifique": "Epipremnum aureum", "prix": 180, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1545239351-ef056c0b011c?q=80&w=600",
         "description": "Plante suspendue ultra-facile qui purifie l'air. Tolère l'ombre.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière faible à moyenne", 
         "temperatureMin": 15.0, "temperatureMax": 30.0, "humidite": 50.0, 
         "typeSol": "Terreau ordinaire", "niveauEntretien": "Très facile"},
        
        {"nom": "Palmier Areca", "nomScientifique": "Dypsis lutescens", "prix": 620, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?q=80&w=600",
         "description": "Palmier élégant qui humidifie l'air. Idéal pour les grands espaces.",
         "besoinEau": "Deux fois par semaine", "besoinLumiere": "Lumière indirecte vive", 
         "temperatureMin": 18.0, "temperatureMax": 28.0, "humidite": 60.0, 
         "typeSol": "Terreau riche", "niveauEntretien": "Facile"},
        
        {"nom": "Plante ZZ", "nomScientifique": "Zamioculcas zamiifolia", "prix": 320, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1545239351-ef056c0b011c?q=80&w=600",
         "description": "Plante extrêmement résistante à la négligence. Parfaite pour les bureaux.",
         "besoinEau": "Toutes les 3 semaines", "besoinLumiere": "Lumière faible", 
         "temperatureMin": 15.0, "temperatureMax": 30.0, "humidite": 40.0, 
         "typeSol": "Terreau drainé", "niveauEntretien": "Très facile"},
        
        {"nom": "Lys de la Paix", "nomScientifique": "Spathiphyllum wallisii", "prix": 290, "cat": "Air", 
         "img": "https://images.unsplash.com/photo-1597055181300-e3633a90750a?q=80&w=600",
         "description": "Fleurs blanches élégantes et excellente purificatrice d'air.",
         "besoinEau": "Deux fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 18.0, "temperatureMax": 27.0, "humidite": 70.0, 
         "typeSol": "Terreau humide", "niveauEntretien": "Facile"},
        
        {"nom": "Ficus Caoutchouc", "nomScientifique": "Ficus elastica", "prix": 420, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600",
         "description": "Grandes feuilles brillantes. Très décoratif et robuste.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 18.0, "temperatureMax": 28.0, "humidite": 50.0, 
         "typeSol": "Terreau bien drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Oiseau de Paradis", "nomScientifique": "Strelitzia reginae", "prix": 780, "cat": "Tropicales", 
         "img": "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?q=80&w=600",
         "description": "Fleurs exotiques orange et bleues spectaculaires.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière vive", 
         "temperatureMin": 18.0, "temperatureMax": 30.0, "humidite": 60.0, 
         "typeSol": "Terreau riche", "niveauEntretien": "Moyen"},
        
        {"nom": "Plante Monnaie Chinoise", "nomScientifique": "Pilea peperomioides", "prix": 250, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1545239351-ef056c0b011c?q=80&w=600",
         "description": "Feuilles rondes comme des pièces de monnaie. Très tendance.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 15.0, "temperatureMax": 25.0, "humidite": 50.0, 
         "typeSol": "Terreau léger", "niveauEntretien": "Facile"},
        
        {"nom": "Plante Araignée", "nomScientifique": "Chlorophytum comosum", "prix": 150, "cat": "Air", 
         "img": "https://images.unsplash.com/photo-1593482892290-f54927ae1bf7?q=80&w=600",
         "description": "Plante suspendue qui produit de petites plantules. Purifie l'air.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière moyenne", 
         "temperatureMin": 15.0, "temperatureMax": 28.0, "humidite": 50.0, 
         "typeSol": "Terreau ordinaire", "niveauEntretien": "Très facile"},
        
        {"nom": "Dracaena Marginata", "nomScientifique": "Dracaena marginata", "prix": 350, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600",
         "description": "Tronc fin avec feuilles rouges. Élégante et facile.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière moyenne", 
         "temperatureMin": 18.0, "temperatureMax": 28.0, "humidite": 50.0, 
         "typeSol": "Terreau drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Plante de Jade", "nomScientifique": "Crassula ovata", "prix": 220, "cat": "Succulentes", 
         "img": "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?q=80&w=600",
         "description": "Succulente porte-bonheur aux feuilles charnues. Symbole de prospérité.",
         "besoinEau": "Toutes les 2 semaines", "besoinLumiere": "Plein soleil", 
         "temperatureMin": 10.0, "temperatureMax": 30.0, "humidite": 30.0, 
         "typeSol": "Terreau pour cactus", "niveauEntretien": "Très facile"},
        
        {"nom": "Echeveria", "nomScientifique": "Echeveria elegans", "prix": 180, "cat": "Succulentes", 
         "img": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600",
         "description": "Rosette succulente aux feuilles bleutées. Idéale en pot.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Plein soleil", 
         "temperatureMin": 10.0, "temperatureMax": 32.0, "humidite": 30.0, 
         "typeSol": "Terreau pour cactus", "niveauEntretien": "Facile"},
        
        {"nom": "Lavande", "nomScientifique": "Lavandula angustifolia", "prix": 150, "cat": "Extérieur", 
         "img": "https://images.unsplash.com/photo-1512423175375-a013426ea939?q=80&w=600",
         "description": "Plante aromatique parfumée aux fleurs violettes. Attire les abeilles.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Plein soleil", 
         "temperatureMin": 5.0, "temperatureMax": 30.0, "humidite": 40.0, 
         "typeSol": "Sol bien drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Romarin", "nomScientifique": "Rosmarinus officinalis", "prix": 130, "cat": "Aromatiques", 
         "img": "https://images.unsplash.com/photo-1545239351-ef056c0b011c?q=80&w=600",
         "description": "Herbe aromatique utilisée en cuisine et pour la santé.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Plein soleil", 
         "temperatureMin": 5.0, "temperatureMax": 30.0, "humidite": 40.0, 
         "typeSol": "Sol drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Basilic", "nomScientifique": "Ocimum basilicum", "prix": 80, "cat": "Aromatiques", 
         "img": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600",
         "description": "Herbe fraîche pour la cuisine méditerranéenne.",
         "besoinEau": "Deux fois par semaine", "besoinLumiere": "Plein soleil", 
         "temperatureMin": 15.0, "temperatureMax": 30.0, "humidite": 60.0, 
         "typeSol": "Terreau riche", "niveauEntretien": "Facile"},
        
        {"nom": "Rosier", "nomScientifique": "Rosa hybrida", "prix": 450, "cat": "Fleurs", 
         "img": "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?q=80&w=600",
         "description": "Fleurs classiques aux multiples couleurs. Symbole d'amour.",
         "besoinEau": "Deux fois par semaine", "besoinLumiere": "Plein soleil", 
         "temperatureMin": 10.0, "temperatureMax": 30.0, "humidite": 50.0, 
         "typeSol": "Terreau riche", "niveauEntretien": "Moyen"},
        
        {"nom": "Hortensia", "nomScientifique": "Hydrangea macrophylla", "prix": 380, "cat": "Extérieur", 
         "img": "https://images.unsplash.com/photo-1597055181300-e3633a90750a?q=80&w=600",
         "description": "Grosses fleurs colorées qui changent selon le pH du sol.",
         "besoinEau": "Deux fois par semaine", "besoinLumiere": "Mi-ombre", 
         "temperatureMin": 5.0, "temperatureMax": 28.0, "humidite": 60.0, 
         "typeSol": "Terreau acide", "niveauEntretien": "Moyen"},
        
        {"nom": "Anthurium", "nomScientifique": "Anthurium andraeanum", "prix": 450, "cat": "Vibrantes", 
         "img": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600",
         "description": "Fleurs rouges ou roses en forme de cœur. Très décoratif.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 18.0, "temperatureMax": 28.0, "humidite": 70.0, 
         "typeSol": "Terreau drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Misère", "nomScientifique": "Tradescantia zebrina", "prix": 180, "cat": "Vibrantes", 
         "img": "https://images.unsplash.com/photo-1545239351-ef056c0b011c?q=80&w=600",
         "description": "Feuilles rayées violet et argent. Plante suspendue rapide.",
         "besoinEau": "Deux fois par semaine", "besoinLumiere": "Lumière vive", 
         "temperatureMin": 15.0, "temperatureMax": 28.0, "humidite": 60.0, 
         "typeSol": "Terreau léger", "niveauEntretien": "Facile"},
        
        {"nom": "Palmier Kentia", "nomScientifique": "Howea forsteriana", "prix": 750, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?q=80&w=600",
         "description": "Palmier élégant et tolérant à l'ombre.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 18.0, "temperatureMax": 28.0, "humidite": 50.0, 
         "typeSol": "Terreau riche", "niveauEntretien": "Facile"},
        
        {"nom": "Schefflera", "nomScientifique": "Schefflera arboricola", "prix": 420, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1593482892290-f54927ae1bf7?q=80&w=600",
         "description": "Plante aux feuilles en ombrelle. Très robuste.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière moyenne", 
         "temperatureMin": 15.0, "temperatureMax": 28.0, "humidite": 50.0, 
         "typeSol": "Terreau drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Yucca", "nomScientifique": "Yucca elephantipes", "prix": 380, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?q=80&w=600",
         "description": "Tronc épais avec feuilles pointues. Très résistant.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière vive", 
         "temperatureMin": 10.0, "temperatureMax": 30.0, "humidite": 40.0, 
         "typeSol": "Terreau drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Cactus Oreilles de Lapin", "nomScientifique": "Opuntia microdasys", "prix": 250, "cat": "Succulentes", 
         "img": "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600",
         "description": "Cactus plat sans épines apparentes, très décoratif.",
         "besoinEau": "Une fois par mois", "besoinLumiere": "Plein soleil", 
         "temperatureMin": 10.0, "temperatureMax": 35.0, "humidite": 20.0, 
         "typeSol": "Terreau pour cactus", "niveauEntretien": "Très facile"},
        
        {"nom": "Cactus de Noël", "nomScientifique": "Schlumbergera truncata", "prix": 220, "cat": "Succulentes", 
         "img": "https://images.unsplash.com/photo-1512423175375-a013426ea939?q=80&w=600",
         "description": "Fleurs colorées en hiver. Plante festive.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 15.0, "temperatureMax": 25.0, "humidite": 60.0, 
         "typeSol": "Terreau drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Peperomia", "nomScientifique": "Peperomia obtusifolia", "prix": 190, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600",
         "description": "Petites feuilles charnues et compacte. Idéale en bureau.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 18.0, "temperatureMax": 28.0, "humidite": 50.0, 
         "typeSol": "Terreau léger", "niveauEntretien": "Très facile"},
        
        {"nom": "Plante Prière", "nomScientifique": "Maranta leuconeura", "prix": 280, "cat": "Vibrantes", 
         "img": "https://images.unsplash.com/photo-1545239351-ef056c0b011c?q=80&w=600",
         "description": "Feuilles qui se referment la nuit comme en prière.",
         "besoinEau": "Deux fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 18.0, "temperatureMax": 27.0, "humidite": 80.0, 
         "typeSol": "Terreau humide", "niveauEntretien": "Moyen"},
        
        {"nom": "Cordyline", "nomScientifique": "Cordyline fruticosa", "prix": 350, "cat": "Vibrantes", 
         "img": "https://images.unsplash.com/photo-1597055181300-e3633a90750a?q=80&w=600",
         "description": "Feuilles colorées rouge et vert. Aspect tropical.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 18.0, "temperatureMax": 28.0, "humidite": 60.0, 
         "typeSol": "Terreau riche", "niveauEntretien": "Moyen"},
        
        {"nom": "Aglaonema", "nomScientifique": "Aglaonema commutatum", "prix": 290, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?q=80&w=600",
         "description": "Feuilles panachées. Tolère très bien l'ombre.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière faible", 
         "temperatureMin": 18.0, "temperatureMax": 28.0, "humidite": 60.0, 
         "typeSol": "Terreau drainé", "niveauEntretien": "Facile"},
        
        {"nom": "Hoya Carnosa", "nomScientifique": "Hoya carnosa", "prix": 320, "cat": "Intérieur", 
         "img": "https://images.unsplash.com/photo-1593482892290-f54927ae1bf7?q=80&w=600",
         "description": "Fleurs en cire parfumées. Plante grimpante suspendue.",
         "besoinEau": "Une fois par semaine", "besoinLumiere": "Lumière indirecte", 
         "temperatureMin": 15.0, "temperatureMax": 28.0, "humidite": 50.0, 
         "typeSol": "Terreau bien drainé", "niveauEntretien": "Facile"},
    ]

    all_plants = []

    for p in plants_pool:
        plante = Plante.objects.create(
            nom=p['nom'],
            nomScientifique=p['nomScientifique'],
            prix=Decimal(str(p['prix'])),
            stock=random.randint(15, 60),
            description=p['description'],
            besoinEau=p['besoinEau'],
            besoinLumiere=p['besoinLumiere'],
            temperatureMin=p['temperatureMin'],
            temperatureMax=p['temperatureMax'],
            humidite=p['humidite'],
            typeSol=p['typeSol'],
            niveauEntretien=p['niveauEntretien'],
            categorie=cats[p['cat']],
        )

        img_url = get_plant_image_url(p['nom'])
        img = download_image(img_url, f"{p['nom']}.jpg")

        if img:
            plante.image.save(f"{p['nom']}.jpg", img, save=True)

        all_plants.append(plante)

    print("Creating clients...")
    clients = generate_clients(120)

    print("Creating admins...")
    admin = Utilisateur.objects.create_user(
        username="admin",
        email="admin@gmail.com",
        password="azsq",
        role="ADMIN",
        ville="Casablanca",
        pays="Maroc"
    )
    clients.append(admin)

    print("Generating orders...")
    generate_orders(clients, all_plants, 400)

    print("\n✅ DONE — Production-level dataset ready.")
    print("✔ realistic users")
    print("✔ behavioral patterns")
    print("✔ seasonal trends")
    print("✔ analytics-ready data")


if __name__ == "__main__":
    seed()