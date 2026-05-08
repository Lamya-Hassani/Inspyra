import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Droplets, User, Leaf, ShieldCheck, 
  ArrowRight, ArrowLeft, RefreshCw, Sparkles,
  CheckCircle2, AlertCircle, ShoppingCart
} from 'lucide-react';
import recommendationService from '../services/recommendationService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';

const steps = [
  {
    id: 'light_level',
    title: 'Exposition Solaire',
    question: 'Quelle est la luminosité habituelle de votre espace ?',
    icon: <Sun className="w-8 h-8 text-amber-400" />,
    options: [
      { value: 'LOW', label: 'Faible', desc: 'Peu de fenêtres, lumière tamisée', color: 'bg-indigo-50' },
      { value: 'MEDIUM', label: 'Indirecte', desc: 'Lumière vive mais sans soleil direct', color: 'bg-emerald-50' },
      { value: 'HIGH', label: 'Directe', desc: 'Plusieurs heures de soleil direct', color: 'bg-orange-50' },
    ]
  },
  {
    id: 'watering_frequency',
    title: 'Fréquence d\'Arrosage',
    question: 'À quelle fréquence pouvez-vous arroser vos plantes ?',
    icon: <Droplets className="w-8 h-8 text-blue-400" />,
    options: [
      { value: 'FREQUENT', label: 'Fréquent', desc: 'Plus de 2 fois par semaine', color: 'bg-blue-50' },
      { value: 'MODERATE', label: 'Modéré', desc: 'Une fois par semaine', color: 'bg-cyan-50' },
      { value: 'RARE', label: 'Rare', desc: 'Toutes les 2-3 semaines', color: 'bg-slate-50' },
    ]
  },
  {
    id: 'experience_level',
    title: 'Niveau d\'Expérience',
    question: 'Comment décririez-vous vos compétences en jardinage ?',
    icon: <User className="w-8 h-8 text-emerald-500" />,
    options: [
      { value: 'BEGINNER', label: 'Débutant', desc: 'Je n\'ai jamais eu de plantes', color: 'bg-green-50' },
      { value: 'INTERMEDIATE', label: 'Intermédiaire', desc: 'Je sais garder quelques plantes en vie', color: 'bg-teal-50' },
      { value: 'EXPERT', label: 'Expert', desc: 'La main verte, passionné de botanique', color: 'bg-lime-50' },
    ]
  },
  {
    id: 'primary_goal',
    title: 'Votre Objectif',
    question: 'Pourquoi souhaitez-vous acquérir une plante ?',
    icon: <Leaf className="w-8 h-8 text-green-600" />,
    options: [
      { value: 'DECORATION', label: 'Décoration', desc: 'Embellir mon intérieur', color: 'bg-pink-50' },
      { value: 'AIR_PURIFYING', label: 'Purifier l\'Air', desc: 'Assainir l\'atmosphère', color: 'bg-emerald-100' },
      { value: 'MEDICINAL', label: 'Aromatique', desc: 'Pour cuisiner ou se soigner', color: 'bg-amber-100' },
      { value: 'COLLECTION', label: 'Collection', desc: 'Trouver des variétés rares', color: 'bg-violet-100' },
    ]
  }
];

const PlantFinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    light_level: 'MEDIUM',
    watering_frequency: 'MODERATE',
    experience_level: 'BEGINNER',
    primary_goal: 'DECORATION',
    has_pets: false,
    has_children: false
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Load existing preferences if available
    const fetchPrefs = async () => {
      try {
        const data = await recommendationService.getPreferences();
        if (data) setPreferences(data);
      } catch (err) {
        console.log("No existing preferences found");
      }
    };
    fetchPrefs();
  }, []);

  const handleSelect = (field, value) => {
    setPreferences(prev => ({ ...prev, [field]: value }));
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 300);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await recommendationService.updatePreferences(preferences);
      const data = await recommendationService.getRecommendations();
      setRecommendations(data);
      setShowResults(true);
      toast.success('Nous avons trouvé vos plantes idéales !');
    } catch (err) {
      toast.error('Erreur lors de la récupération des recommandations.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } }
  };

  if (showResults) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="text-emerald-500" /> Vos Recommandations
              </h1>
              <p className="text-gray-500 mt-2">Basé sur vos besoins et votre style de vie.</p>
            </div>
            <button 
              onClick={() => setShowResults(false)}
              className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-2xl shadow-sm border border-emerald-100 hover:bg-emerald-50 transition-all font-medium"
            >
              <RefreshCw className="w-4 h-4" /> Refaire le test
            </button>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((plant, idx) => (
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ProductCard product={plant} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Oups ! Pas de match parfait</h2>
              <p className="text-gray-500 mb-8">Nous n'avons pas trouvé de plantes correspondant exactement à tous vos critères. Essayez de modifier quelques options pour voir plus de choix.</p>
              <button 
                onClick={() => setShowResults(false)}
                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all"
              >
                Ajuster mes critères
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-gradient-to-br from-emerald-50/30 to-lime-50/30">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8 px-2">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                idx <= currentStep ? 'bg-emerald-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/5 border border-emerald-50 p-8 md:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <span className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Étape {currentStep + 1} / {steps.length}</span>
                <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-10 leading-tight">
              {step.question}
            </h3>

            <div className="grid gap-4">
              {step.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(step.id, option.value)}
                  className={`flex items-center justify-between p-6 rounded-3xl text-left transition-all duration-300 border-2 ${
                    preferences[step.id] === option.value 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-lg' 
                    : 'border-transparent bg-gray-50 hover:bg-white hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${option.color} flex items-center justify-center font-bold text-gray-700`}>
                      {option.label.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{option.label}</div>
                      <div className="text-gray-500 text-sm">{option.desc}</div>
                    </div>
                  </div>
                  {preferences[step.id] === option.value && (
                    <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                  )}
                </button>
              ))}
            </div>

            {currentStep === steps.length - 1 && (
               <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 accent-emerald-500 rounded"
                          checked={preferences.has_pets}
                          onChange={(e) => setPreferences({...preferences, has_pets: e.target.checked})}
                        />
                        <span className="text-gray-700 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                           <ShieldCheck className="w-5 h-5" /> J'ai des animaux de compagnie
                        </span>
                    </label>
                  </div>
               </div>
            )}

            <div className="mt-12 flex justify-between items-center">
              <button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => prev - 1)}
                className={`flex items-center gap-2 font-bold transition-all ${
                  currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-emerald-600'
                }`}
              >
                <ArrowLeft className="w-5 h-5" /> Retour
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg"
                >
                  Continuer <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  Découvrir mes plantes
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlantFinder;
