import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bot, HeartPulse,Code2 ,Cpu, Stethoscope, Server,Heart, Activity
} from 'lucide-react';

import chatcraftLogo from '../assets/chatcraft.png';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 relative overflow-hidden flex flex-col">

            <Bot className="absolute top-10 left-10 text-indigo-300 opacity-20 w-32 h-32 animate-spin-slow" />
      <Code2 className="absolute top-20 right-20 text-red-300 opacity-30 w-24 h-24 " />


      <Stethoscope className="absolute bottom-32 left-16 text-blue-300 opacity-25 w-28 h-28 animate-pulse" />
      <Cpu className="absolute top-1/3 right-10 text-pink-300 opacity-20 w-20 h-20 animate-bounce" />
      <Server className="absolute bottom-20 right-1/4 text-green-300 opacity-25 w-24 h-24 animate-pulse" />
      <Activity className="absolute top-2/3 left-8 text-purple-300 opacity-20 w-36 h-36 animate-pulse" />
      <Heart className="absolute bottom-1/3 right-8 text-red-200 opacity-30 w-32 h-32 animate-ping" />
      <Bot className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-100 opacity-10 w-96 h-96 animate-spin-slow" />

            <style>{`
        .animate-spin-slow {
          animation: spin 30s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>


            <main className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-24">
                <div className="flex flex-col items-center justify-center gap-6 mb-10 ">
                    <img
                        src={chatcraftLogo}
                        alt="Logo Chat Craft"
                        className="h-36 sm:h-44 md:h-52 rounded-2xl shadow-xl border-4 border-purple/60"
                    />
                    <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                        Bienvenue sur CHAT CRAFT
                    </h1>
                </div>

                <p className="text-lg text-gray-700 mb-10">
                    Une plateforme intelligente dédiée à la santé cardiovasculaire — Interagissez avec des assistants IA ou créez les vôtres.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg"
                    >
                        Connexion
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="border-2 border-indigo-600 text-indigo-600 px-6 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-600 hover:text-white transition transform hover:scale-105"
                    >
                        Créer un compte
                    </button>
                </div>
            </main>


            <section className="relative z-10 bg-white/70 backdrop-blur-md py-16 px-6 rounded-3xl mx-6 mb-12 shadow-xl border border-white/50">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Ce que CHAT CRAFT vous apporte
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="text-center group">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <HeartPulse size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Expertise Médicale</h3>
                        <p className="text-gray-600">Bénéficiez de recommandations fondées sur les meilleures pratiques.</p>
                    </div>
                    <div className="text-center group">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Bot size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">IA Avancée</h3>
                        <p className="text-gray-600">Des réponses rapides, personnalisées, et en langage naturel grâce à l'IA.</p>
                    </div>
                    <div className="text-center group">
                        <div className="bg-gradient-to-br from-green-500 to-teal-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Stethoscope size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Personnalisation</h3>
                        <p className="text-gray-600">Créez vos propres assistants adaptés à vos besoins spécifiques et documents.</p>
                    </div>
                </div>
            </section>


            <section className="text-center relative z-10 mb-20 px-4">
                <blockquote className="italic text-gray-600 text-xl max-w-2xl mx-auto">
                    "Une technologie bien utilisée peut sauver des vies. MODCARV incarne cette mission au cœur de la médecine moderne."
                </blockquote>
                <p className="mt-4 text-gray-500">— Équipe MODCARV</p>
            </section>


            <footer className="bg-white/60 backdrop-blur border-t border-white/30 py-6 text-center text-gray-600 text-sm relative z-10">
                <p>&copy; 2025 MODCARV. Tous droits réservés — Projet pour le mémoire Master.</p>
            </footer>
        </div>
    );
};

export default Welcome;
