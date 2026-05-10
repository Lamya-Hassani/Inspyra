import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Loader2, ArrowRight, Mail, Phone, MapPin, Globe, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'Maroc',
    role: 'CLIENT' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await register(formData);
    if (res.success) {
      toast.success("Compte créé avec succès ! Bienvenue !");
      navigate('/');
    } else {
      toast.error(res.error || "Erreur lors de l'inscription.");
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:border-[#6D58C7] focus:ring-4 focus:ring-purple-500/5 outline-none font-bold text-sm transition-all bg-white shadow-sm";
  const labelClass = "block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#274d00]/20 via-white to-[#6D58C7]/20 flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8 sm:p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#274d00]/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6D58C7]/5 rounded-full blur-3xl -z-0 -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-[#274d00] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:bg-[#6D58C7] transition-colors">I</div>
              <span className="text-3xl font-black tracking-tighter text-[#274d00]">INSPYRA</span>
            </Link>
            <h1 className="text-3xl font-black text-[#274d00] tracking-tight">Rejoindre la communauté</h1>
            <p className="text-gray-400 mt-2 font-medium italic">Commencez votre aventure botanique dès aujourd'hui.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Info */}
              <div className="space-y-5">
                <p className="text-[10px] font-black text-[#6D58C7] uppercase tracking-[0.3em] mb-4 border-b border-purple-50 pb-2">Informations de compte</p>
                
                <div>
                  <label className={labelClass}>Identifiant</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={inputClass}
                      placeholder="Nom d'utilisateur"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                      placeholder="Ex: contact@exemple.com"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={inputClass}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="tel"
                      required
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      className={inputClass}
                      placeholder="06 XX XX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="space-y-5">
                <p className="text-[10px] font-black text-[#6D58C7] uppercase tracking-[0.3em] mb-4 border-b border-purple-50 pb-2">Adresse de livraison</p>
                
                <div>
                  <label className={labelClass}>Adresse complète</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.adresse}
                      onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                      className={inputClass}
                      placeholder="N°, Rue, Quartier"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Ville</label>
                    <div className="relative">
                      <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input
                        type="text"
                        required
                        value={formData.ville}
                        onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                        className={inputClass}
                        placeholder="Ex: Casablanca"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Code Postal</label>
                    <input
                      type="text"
                      required
                      value={formData.codePostal}
                      onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                      className={inputClass}
                      placeholder="20000"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Pays</label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.pays}
                      onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                      className={inputClass}
                      placeholder="Maroc"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full mt-6 py-5 bg-[#274d00] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#6D58C7] transition-all shadow-xl hover:shadow-purple-100 disabled:opacity-70 uppercase tracking-[0.2em] text-xs"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                <>Créer mon compte <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-sm text-gray-400 font-medium">
            Déjà membre ?{" "}
            <Link to="/login" className="text-[#6D58C7] font-black hover:text-[#274d00] transition-colors underline underline-offset-8 decoration-2 decoration-purple-100">
              Se connecter à mon espace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
