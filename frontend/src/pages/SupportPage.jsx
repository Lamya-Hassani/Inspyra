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
    { q: "Comment bien entretenir ma plante ?", a: "Chaque plante est livrée avec un guide d'entretien détaillé. Vous pouvez aussi consulter la page de la plante sur notre site." },
    { q: "Quels sont les moyens de paiement ?", a: "Nous acceptons le paiement en ligne par carte et le paiement à la livraison (COD)." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 space-y-20">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-black text-emerald-950 dark:text-white uppercase tracking-tighter">
          Centre de <span className="text-emerald-500">Support</span>
        </h1>
        <p className="text-lg text-emerald-900/50 dark:text-emerald-100/50 max-w-2xl mx-auto font-medium">
          Nous sommes là pour vous aider. Trouvez des réponses rapides ou contactez notre équipe passionnée.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-8 rounded-[2rem] border border-white/20 space-y-6">
            <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight">
              Informations
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><MapPin size={20} /></div>
                <div>
                  <p className="font-bold text-emerald-950 dark:text-white">Adresse</p>
                  <p className="text-sm text-emerald-900/60 dark:text-emerald-100/60">Grand Boulevard de l'Emsi,<br/> Casablanca, Maroc</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Phone size={20} /></div>
                <div>
                  <p className="font-bold text-emerald-950 dark:text-white">Téléphone</p>
                  <p className="text-sm text-emerald-900/60 dark:text-emerald-100/60">+212 522 00 00 00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0"><Mail size={20} /></div>
                <div>
                  <p className="font-bold text-emerald-950 dark:text-white">Email</p>
                  <p className="text-sm text-emerald-900/60 dark:text-emerald-100/60">hello@inspyra.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass p-8 rounded-[2rem] border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-900/10">
            <h3 className="text-xl font-black text-emerald-950 dark:text-white uppercase tracking-tight mb-4">
              Chat en Direct
            </h3>
            <p className="text-sm text-emerald-900/60 dark:text-emerald-100/60 mb-6">
              Besoin d'une réponse immédiate ? Discutez avec nos experts botanistes.
            </p>
            <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all">
              <MessageCircle size={18} /> Lancer le Chat
            </button>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-2 glass p-8 md:p-12 rounded-[2.5rem] border border-white/20">
          <h3 className="text-3xl font-black text-emerald-950 dark:text-white uppercase tracking-tight mb-8">
            Envoyez-nous un message
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-emerald-500 tracking-widest">Nom Complet</label>
                <input required type="text" className="w-full px-5 py-4 glass border border-white/20 rounded-2xl text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white/50 dark:bg-black/10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-emerald-500 tracking-widest">Email</label>
                <input required type="email" className="w-full px-5 py-4 glass border border-white/20 rounded-2xl text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white/50 dark:bg-black/10" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-emerald-500 tracking-widest">Sujet</label>
              <select className="w-full px-5 py-4 glass border border-white/20 rounded-2xl text-emerald-950 dark:text-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white/50 dark:bg-black/10">
                <option value="order">Ma commande</option>
                <option value="plant">Conseil entretien</option>
                <option value="return">Retour / Remboursement</option>
                <option value="other">Autre demande</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-emerald-500 tracking-widest">Message</label>
              <textarea required rows="5" className="w-full px-5 py-4 glass border border-white/20 rounded-2xl text-emerald-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white/50 dark:bg-black/10 resize-none"></textarea>
            </div>
            <button type="submit" className="px-8 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 transition-all w-full md:w-auto">
              <Send size={18} /> Envoyer le message
            </button>
          </form>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center">
           <HelpCircle className="mx-auto text-emerald-500 mb-4" size={40} />
           <h2 className="text-3xl font-black text-emerald-950 dark:text-white uppercase tracking-tighter">Questions Fréquentes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass p-6 rounded-2xl border border-white/20 hover:border-emerald-500/30 transition-all">
              <h4 className="font-black text-emerald-950 dark:text-white mb-2">{faq.q}</h4>
              <p className="text-sm text-emerald-900/60 dark:text-emerald-100/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SupportPage;
