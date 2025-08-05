import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot, LogOut, MessageCircle, Info, Settings, User,
  Code2, Server, Cpu, HeartPulse, Stethoscope, Activity, Heart
} from 'lucide-react';
import bannerImage from '../assets/banner.png';
import logo from '../assets/chatcraft.png'; 


const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return navigate('/login');

      try {
        const res = await fetch('http://localhost:8000/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUserName(data.nom);
      } catch (error) {
        console.error("Erreur utilisateur :", error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem('access_token');
      navigate('/welcome');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleGoToChat = () => {
    setLoadingChat(true);
    setTimeout(() => {
      navigate('/chat');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">

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
        .animate-glow {
          animation: glow 2s ease-in-out infinite alternate;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes glow {
          from { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          to { box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        }
      `}</style>


      <nav className="flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 fixed top-0 w-full z-50">
        {/* <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
          <Bot size={32} className="text-indigo-600 animate-pulse" /> CHAT CRAFT
        </div> */}


<div className="flex items-center">
  <img src={logo} alt="Logo Chat Craft" className="w-8 h-8" />
  <span className="ml-2 text-indigo-600 font-bold">CHAT CRAFT</span>
</div>

        <div className="flex items-center gap-6">
          <div className="flex items-center text-gray-700 text-sm bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
            <User className="mr-2 text-indigo-600" size={18} />
            <span className="font-medium">{userName}</span>
          </div>
          <button
            onClick={() => handleNavigation('/profil')}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-all duration-200"
          >
            Mon profil
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 font-medium hover:underline flex items-center gap-2 transition-all duration-200"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </nav>


      <div className="pt-32 px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-float">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Bienvenue sur CHAT CRAFT
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Votre assistant intelligent dédié à la santé cardiovasculaire, et à la création de vos propres chatbots personnalisés.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Bannière image */}
        {/* <div className="w-full max-w-6xl mx-auto mb-16 overflow-hidden rounded-3xl shadow-xl border border-indigo-100">
          <img
            src={bannerImage}
            alt="Bannière Chat Craft"
            className="w-full h-64 object-cover"
          />
        </div>
         */}

        <div className="flex justify-center my-10 px-4">
          <img
            src={bannerImage}
            alt="Bannière ChatCraft"
            className="w-[95%] max-w-6xl rounded-3xl shadow-2xl object-cover"
          />
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          <div className="group bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/30 animate-glow">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <MessageCircle size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 text-center">
              Interagir avec le chatbot
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Discutez avec un assistant médical spécialisé en maladies cardiovasculaires.
            </p>
            <div className="text-center">
              <button
                onClick={handleGoToChat}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
              >
                {loadingChat ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Chargement...
                  </span>
                ) : (
                  'Démarrer la conversation'
                )}
              </button>
            </div>
          </div>


          <div className="group bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/30">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Settings size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-4 text-center">
              Créer mon propre chatbot
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Générez votre propre assistant intelligent à partir de vos documents médicaux.
            </p>
            <div className="text-center">
              <button
                onClick={() => handleNavigation('/create-chatbot')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
              >
                Commencer la création
              </button>
            </div>
          </div>


          <div className="group bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/30">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Info size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-purple-800 mb-4 text-center">
              À propos du projet
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Découvrez les objectifs, les partenaires et les impacts du projet MODCARV.
            </p>
            <div className="text-center">
              <button
                onClick={() => handleNavigation('/about')}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
              >
                En savoir plus
              </button>
            </div>
          </div>
        </div>


        <div className="bg-white/50 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Pourquoi choisir CHAT CRAFT ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature icon={<HeartPulse size={32} className="text-white" />} title="Expertise Médicale" desc="Assistant spécialisé sur les MCV" color="from-blue-500 to-cyan-600" />
            <Feature icon={<Bot size={32} className="text-white" />} title="IA Avancée" desc="Réponses précises grâce à l’intelligence artificielle" color="from-purple-500 to-pink-600" />
            <Feature icon={<Settings size={32} className="text-white" />} title="Personnalisation" desc="Créez vos propres assistants selon vos besoins" color="from-green-500 to-teal-600" />
          </div>
        </div>


        <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
          <h3 className="text-4xl font-bold mb-4">Prêt à commencer ?</h3>
          <p className="text-xl mb-8 opacity-90">
            Discuter avec le chatbot qui répondra à toutes vos questions sur la santé cardiovasculaire
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoToChat}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Essayer maintenant
            </button>
            {/* <button
              onClick={() => handleNavigation('/chat')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105"
            >
              Voir la démo
            </button> */}
          </div>
        </div>
      </div>


      <footer className="mt-20 py-8 text-center text-gray-500 border-t border-gray-200/50">
        <p>&copy;copyright 2025 - Tous droits réservés.</p>
      </footer>
    </div>
  );
};

const Feature = ({ icon, title, desc, color }) => (
  <div className="text-center group">
    <div className={`bg-gradient-to-br ${color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <h4 className="text-xl font-semibold text-gray-800 mb-2">{title}</h4>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default Home;

