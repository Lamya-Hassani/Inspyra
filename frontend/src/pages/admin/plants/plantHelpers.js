import API from '../../../services/api';

export const FALLBACK_PLANT_IMAGE =
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400&auto=format&fit=crop';

const API_BASE_URL = (API.defaults.baseURL || '').replace(/\/api\/?$/, '');

export const emptyPlant = {
  nom: '',
  nomScientifique: '',
  prix: '',
  stock: 0,
  categorie: 1,
  description: '',
  besoinEau: '',
  besoinLumiere: '',
  temperatureMin: 15,
  temperatureMax: 30,
  humidite: 60,
  typeSol: 'Drainant',
  niveauEntretien: 'Facile',
};

export const getPlantImageSrc = (image) => {
  if (!image) return FALLBACK_PLANT_IMAGE;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${API_BASE_URL}${image}`;
};

export const buildPlantFormData = (plantData, imageFile, isEdit = false) => {
  const formData = new FormData();
  const excludedKeys = ['id', 'categorie_nom', 'image'];

  Object.entries(plantData).forEach(([key, value]) => {
    if (excludedKeys.includes(key) || value === null || value === undefined) return;
    formData.append(key, value);
  });

  if (imageFile) {
    formData.append('image', imageFile);
  } else if (!isEdit) {
    formData.append('image', '');
  }

  return formData;
};
