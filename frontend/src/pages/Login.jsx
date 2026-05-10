import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(username, password);
      if (res.success) {
        toast.success("Bon retour parmi nous !");
        navigate("/");
      } else {
        toast.error(res.error || "Identifiants incorrects.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#274d00]/20 via-white to-[#6D58C7]/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-10 sm:p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#274d00]/5 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#6D58C7]/5 rounded-full blur-3xl -z-0 -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="w-12 h-12 bg-[#274d00] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:bg-[#6D58C7] transition-colors">I</div>
              <span className="text-3xl font-black tracking-tighter text-[#274d00]">INSPYRA</span>
            </Link>
            <h1 className="text-3xl font-black text-[#274d00] tracking-tight">Bon retour !</h1>
            <p className="text-gray-400 mt-2 font-medium italic">Accédez à votre sanctuaire botanique.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Identifiant</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="text" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:border-[#6D58C7] focus:ring-4 focus:ring-purple-500/5 outline-none font-bold text-sm transition-all bg-white shadow-sm"
                  placeholder="Nom d'utilisateur"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-100 focus:border-[#6D58C7] focus:ring-4 focus:ring-purple-500/5 outline-none font-bold text-sm transition-all bg-white shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md border-gray-200 text-[#6D58C7] focus:ring-[#6D58C7] cursor-pointer" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Rester connecté</span>
              </label>
              <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-[#6D58C7] hover:text-[#274d00] transition-colors uppercase tracking-widest">
                Oublié ?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 py-5 bg-[#274d00] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#6D58C7] transition-all shadow-xl hover:shadow-purple-100 disabled:opacity-70 uppercase tracking-[0.2em] text-xs"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Se connecter <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-sm text-gray-400 font-medium">
            Pas encore membre ?{" "}
            <Link to="/register" className="text-[#6D58C7] font-black hover:text-[#274d00] transition-colors underline underline-offset-8 decoration-2 decoration-purple-100">
              Rejoindre Inspyra
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}