import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Lock, User, Loader2, ArrowRight, Mail, Sparkles, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'ADMIN' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    const res = await register(formData);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100/60 dark:from-emerald-950 dark:via-slate-950 dark:to-emerald-900 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.14),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(6,95,70,0.16),transparent_35%)]"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/30 blur-[120px] rounded-full animate-soft-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/40 blur-[120px] rounded-full animate-soft-pulse"></div>
      {[...Array(5)].map((_, i) => (
        <Leaf
          key={i}
          className="absolute hidden sm:block text-emerald-300/30 animate-leaf-drift"
          style={{
            top: `${12 + i * 11}%`,
            left: `${i % 2 === 0 ? 7 + i * 7 : 79 - i * 5}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${5 + (i % 4)}s`,
          }}
          size={16 + (i % 3) * 6}
        />
      ))}

      <div className="w-full max-w-5xl relative z-10 animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="hidden lg:flex flex-col justify-between glass rounded-[3rem] p-10 border border-emerald-200/20">
          <div>
            <span className="inline-flex items-center gap-2 text-emerald-300 text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} />
              Création de Compte
            </span>
            <h2 className="text-4xl font-black leading-tight text-emerald-950 dark:text-white">
              Lancez votre espace admin botanique en quelques secondes.
            </h2>
            <p className="text-emerald-900/60 dark:text-emerald-100/60 mt-4 text-sm">
              Configurez votre compte et accédez à un back-office e-commerce conçu pour vendre des plantes avec élégance.
            </p>
          </div>
          <div className="glass rounded-2xl p-4 border border-white/10 flex items-center gap-3 animate-sway">
            <ShieldCheck className="text-emerald-400" />
            <p className="text-xs text-emerald-100/70 font-semibold">Onboarding sécurisé, expérience premium et rapide.</p>
          </div>
        </div>

        <div className="glass w-full p-7 sm:p-12 rounded-[2.2rem] sm:rounded-[3rem] border border-white/10 shadow-2xl relative">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 animate-sway">
              <Leaf className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-white mb-2">
              Rejoindre INS<span className="text-emerald-500">PYRA</span>
            </h1>
            <p className="text-sm font-medium text-emerald-900/50 dark:text-emerald-100/50">Créez votre compte administrateur.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-emerald-500 mb-2 tracking-widest pl-2">Nom d'utilisateur</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-emerald-950 dark:text-white font-bold transition-all"
                  placeholder="Votre identifiant..."
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-emerald-500 mb-2 tracking-widest pl-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-emerald-950 dark:text-white font-bold transition-all"
                  placeholder="Ex: admin@inspyra.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-emerald-500 mb-2 tracking-widest pl-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-emerald-950 dark:text-white font-bold transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>S'inscrire <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-emerald-900/45 dark:text-emerald-100/40 font-medium">
            Déjà un compte ? <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors">Se connecter</Link>
          </p>
          <p className="text-[10px] text-center text-emerald-900/35 dark:text-emerald-200/40 font-semibold mt-3 uppercase tracking-widest">
            Plant Commerce Suite
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
