import React, { useState, useEffect } from 'react';
import {
  Sun, Droplets, User, Leaf,
  ArrowRight, ArrowLeft, RefreshCw, Sparkles,
  AlertCircle
} from 'lucide-react';
import recommendationService from '../services/recommendationService';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';

const steps = [
  {
    id: 'light_level',
    title: 'Lumière',
    question: 'Quelle est la luminosité de votre pièce ?',
    icon: <Sun className="w-6 h-6 text-yellow-500" />,
    options: [
      { value: 'LOW', label: 'Faible', desc: 'Peu de fenêtres' },
      { value: 'MEDIUM', label: 'Moyenne', desc: 'Lumière indirecte' },
      { value: 'HIGH', label: 'Forte', desc: 'Beaucoup de soleil' },
    ]
  },
  {
    id: 'watering_frequency',
    title: 'Arrosage',
    question: 'À quelle fréquence voulez-vous arroser ?',
    icon: <Droplets className="w-6 h-6 text-blue-500" />,
    options: [
      { value: 'FREQUENT', label: 'Souvent', desc: '2+ fois par semaine' },
      { value: 'MODERATE', label: 'Normal', desc: 'Une fois par semaine' },
      { value: 'RARE', label: 'Rarement', desc: 'Toutes les 2 semaines' },
    ]
  },
  {
    id: 'experience_level',
    title: 'Expérience',
    question: 'Quel est votre niveau en jardinage ?',
    icon: <User className="w-6 h-6 text-green-500" />,
    options: [
      { value: 'BEGINNER', label: 'Débutant', desc: 'Jamais eu de plantes' },
      { value: 'INTERMEDIATE', label: 'Moyen', desc: 'Quelques connaissances' },
      { value: 'EXPERT', label: 'Expert', desc: 'J\'ai la main verte' },
    ]
  },
  {
    id: 'primary_goal',
    title: 'Objectif',
    question: 'Pourquoi voulez-vous une plante ?',
    icon: <Leaf className="w-6 h-6 text-[#274d00]" />,
    options: [
      { value: 'DECORATION', label: 'Décoration', desc: 'Embellir mon salon' },
      { value: 'AIR_PURIFYING', label: 'Santé', desc: 'Purifier l\'air' },
      { value: 'COLLECTION', label: 'Passion', desc: 'Collectionner des espèces' },
    ]
  }
];

const PlantFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    light_level: 'MEDIUM',
    watering_frequency: 'MODERATE',
    experience_level: 'BEGINNER',
    primary_goal: 'DECORATION'
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const data = await recommendationService.getPreferences();
        if (data) setPreferences(data);
      } catch (err) {
        console.log("No preferences found");
      }
    };
    fetchPrefs();
  }, []);

  const handleSelect = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await recommendationService.updatePreferences(preferences);
      const data = await recommendationService.getRecommendations();
      setRecommendations(data);
      setShowResults(true);
      toast.success('Résultats trouvés !');
    } catch (err) {
      toast.error('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen pt-1 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-1 bg-[#6D58C7] rounded-full"></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6D58C7]">Intelligence Artificielle</p>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#274d00] tracking-tight">Vos Recommandations</h1>
                <p className="text-gray-500 mt-2 font-medium italic">"Voici les plantes qui s'épanouiront le mieux dans votre écosystème."</p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="px-6 py-2 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm hover:bg-gray-100 flex items-center gap-2 transition-all shadow-sm"
              >
                <RefreshCw size={16} className="text-[#6D58C7]" /> Recommencer
              </button>
            </div>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((plant) => (
                <ProductCard key={plant.id} product={plant} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100 max-w-xl mx-auto">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Aucun résultat exact</h2>
              <p className="text-gray-500 mb-8">Nous n'avons pas trouvé de plantes correspondant à tous vos critères.</p>
              <button
                onClick={() => setShowResults(false)}
                className="px-8 py-3 bg-[#274d00] text-white rounded-lg font-bold"
              >
                Changer mes critères
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen pt-10 pb-12 px-6 bg-white flex items-center justify-center">
      <div className="max-w-xl w-full">
        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full ${idx <= currentStep ? 'bg-[#92B061]' : 'bg-gray-100'}`}
            />
          ))}
        </div>

        <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg">{step.icon}</div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#92B061]">Étape {currentStep + 1} / {steps.length}</p>
          </div>

          <h2 className="text-3xl font-bold text-[#274d00] mb-8 leading-tight">
            {step.question}
          </h2>

          <div className="grid gap-3 mb-8">
            {step.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(step.id, option.value)}
                className={`p-5 rounded-xl text-left border-2 transition-all ${preferences[step.id] === option.value
                    ? 'border-[#92B061] bg-[#92B061]/5'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
              >
                <div className="font-bold text-lg text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.desc}</div>
              </button>
            ))}
          </div>


          <div className="flex justify-between items-center pt-8 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`font-bold ${currentStep === 0 ? 'text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Retour
            </button>
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-[#274d00] text-white font-bold rounded-lg hover:bg-[#1e3b00] flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (loading ? 'Recherche...' : 'Voir les résultats') : 'Suivant'}
              {currentStep < steps.length - 1 && <ArrowRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantFinder;
