import React from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SupportPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Votre message a bien été envoyé ! Nous vous répondrons sous 24h.');
    e.target.reset();
  };

  const faqs = [
    { q: "Quels sont les délais de livraison ?", a: "Nous livrons généralement sous 24 à 48 heures dans tout le Maroc." },
    { q: "Puis-je retourner une plante ?", a: "Oui, vous avez 7 jours pour retourner une plante si elle arrive endommagée." },
    { q: "Comment bien entretenir ma plante ?", a: "Chaque plante est livrée avec un guide d'entretien détaillé." },
    { q: "Quels sont les moyens de paiement ?", a: "Nous acceptons le paiement en ligne par carte et le paiement à la livraison (COD)." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-5 pb-20 bg-white">
      
      {/* Header Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-1 bg-[#6D58C7] rounded-full"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#6D58C7]">Conciergerie</p>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#274d00] tracking-tight">Assistance Botanique</h1>
        <p className="text-gray-500 mt-2 font-medium italic">"Notre équipe est à votre disposition pour prendre soin de votre expérience."</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 space-y-8">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#6D58C7]">Coordonnées</h3>
            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#274d00] shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Adresse</p>
                  <p className="text-sm font-bold text-gray-700">EMSI - Grand Boulevard, Casablanca</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#274d00] shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Téléphone</p>
                  <p className="text-sm font-bold text-gray-700">+212 522 00 00 00</p>
                </div>
              </div>
              <div className="flex gap-4 group">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#274d00] shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Email</p>
                  <p className="text-sm font-bold text-gray-700">hello@inspyra.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#6D58C7]/5 p-8 rounded-2xl border border-[#6D58C7]/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#6D58C7] mb-3 relative z-10">Chat Live</h3>
            <p className="text-sm text-gray-500 font-medium italic mb-6 relative z-10">Une réponse immédiate pour vos questions urgentes.</p>
            <button className="w-full py-4 bg-[#6D58C7] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 shadow-lg hover:bg-[#524295] transition-all relative z-10">
              <MessageCircle size={18} /> Lancer le Chat
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50">
          <h3 className="text-2xl font-bold text-[#274d00] mb-10">Messagerie Directe</h3>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Votre Nom</label>
                <input required type="text" className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#6D58C7] outline-none transition-all font-bold text-sm" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Email</label>
                <input required type="email" className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#6D58C7] outline-none transition-all font-bold text-sm" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Objet de la demande</label>
              <select className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#6D58C7] outline-none transition-all font-bold text-sm appearance-none cursor-pointer">
                <option value="order">Suivi de commande</option>
                <option value="plant">Conseils d'entretien</option>
                <option value="other">Autre demande</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Message</label>
              <textarea required rows="4" className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-[#6D58C7] outline-none transition-all font-bold text-sm resize-none"></textarea>
            </div>
            <button type="submit" className="px-12 py-4 bg-[#274d00] text-white rounded-xl font-bold flex items-center gap-3 hover:bg-[#1e3b00] transition-all shadow-xl">
              <Send size={18} /> Envoyer ma demande
            </button>
          </form>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px bg-gray-100 flex-grow"></div>
          <h2 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Questions fréquentes</h2>
          <div className="h-px bg-gray-100 flex-grow"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-8 bg-white rounded-2xl border border-gray-100 hover:border-[#6D58C7]/30 transition-all group">
              <h4 className="font-bold text-gray-800 mb-3 flex items-start gap-3">
                <HelpCircle size={18} className="text-[#92B061] shrink-0 mt-0.5" />
                {faq.q}
              </h4>
              <p className="text-sm text-gray-500 font-medium italic leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SupportPage;
