
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot, ArrowLeft, Heart, Target, MapPin, Building, Stethoscope, Activity, HeartPulse,
  Shield, TrendingUp, Database, Brain, Globe, Award, BarChart3, PieChart, LineChart, Zap
} from 'lucide-react';
import logo from '../assets/chatcraft.png';

const AboutPage = () => {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({});
  const [currentSection, setCurrentSection] = useState(0);

  const handleGoBack = () => {
    navigate('/home');
  };

  const handleChatNavigation = () => {
    navigate('/chat');
  };

  useEffect(() => {
    const statsData = {
      diabete: 15.95,
      conscience: 33,
      suivi: 16,
      hypertension: 46.47,
      sedentarite: 44,
      surpoids: 27,
      obesite: 19,
      dyslipidemia: 5.26,
      tabagisme: 3
    };

    setTimeout(() => {
      Object.keys(statsData).forEach((key, index) => {
        setTimeout(() => {
          setAnimatedStats(prev => ({
            ...prev,
            [key]: statsData[key]
          }));
        }, index * 300);
      });
    }, 500);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${3 + Math.random() * 3}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <Heart className="absolute top-10 left-10 text-red-500 opacity-60 w-24 h-24 animate-float" />
      <Stethoscope className="absolute top-20 right-20 text-cyan-600 opacity-50 w-20 h-20 animate-float" />
      <Activity className="absolute bottom-32 left-16 text-green-600 opacity-50 w-20 h-20 animate-float" />
      <HeartPulse className="absolute bottom-20 right-1/4 text-purple-600 opacity-60 w-18 h-18 animate-float" />
      <Shield className="absolute top-1/3 right-10 text-indigo-600 opacity-50 w-16 h-16 animate-float" />
      <Globe className="absolute top-2/3 left-8 text-pink-600 opacity-40 w-28 h-28 animate-spin" />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slide-in {
          animation: slideIn 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        .glass-morphism {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .neon-glow {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1);
        }
      `}</style>

      <nav className="flex justify-between items-center px-8 py-4 glass-morphism fixed top-0 w-full z-50">
        <div className="flex items-center">
          {/* Logo ChatCraft avec image PNG */}
          <div className="relative">
            <img 
              src={logo} 
              alt="ChatCraft Logo" 
              className="w-12 h-12 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-300 object-cover"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          </div>
          <div className="ml-3">
            <span className="text-gray-800 font-bold text-xl bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
              CHAT CRAFT
            </span>
            <div className="text-xs text-gray-500 font-medium">Assistant MODCARV</div>
          </div>
        </div>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-200 px-4 py-2 rounded-lg hover:bg-white/20"
        >
          <ArrowLeft size={20} />
          Retour à l'accueil
        </button>
      </nav>

      <div className="pt-32 px-8 max-w-7xl mx-auto relative z-10">

        <div className="text-center mb-20 animate-float">
          <h1 className="text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MODCARV
            </span>
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8">
            Révolutionner le suivi cardiovasculaire au Sénégal grâce à l'intelligence artificielle
          </p>
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            <Zap className="text-yellow-400 animate-pulse" size={24} />
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">1330</div>
              <div className="text-sm text-gray-600">Patients étudiés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">5</div>
              <div className="text-sm text-gray-600">Communes ciblées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">30%</div>
              <div className="text-sm text-gray-600">Dépenses MNT</div>
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-3xl p-8 neon-glow mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
            {/* <BarChart3 className="text-cyan-400" size={36} /> */}
            Données Épidémiologiques - Saint-Louis 2022
          </h2>

          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-cyan-700 mb-6 flex items-center gap-2">
              {/* <PieChart size={24} /> */}
              Prévalence du Diabète
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                value={animatedStats.diabete || 0}
                maxValue={100}
                label="Prévalence générale"
                color="from-red-500 to-red-700"
                suffix="%"
                // icon={<TrendingUp />}
              />
              <StatCard
                value={animatedStats.conscience || 0}
                maxValue={100}
                label="Patients conscients"
                color="from-orange-500 to-orange-700"
                suffix="%"
                // icon={<Brain />}
              />
              <StatCard
                value={animatedStats.suivi || 0}
                maxValue={100}
                label="Suivi régulier"
                color="from-red-600 to-red-800"
                suffix="%"
                // icon={<Activity />}
              />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-purple-700 mb-6 flex items-center gap-2">
              {/* <LineChart size={24} /> */}
              Facteurs de Risque Cardiovasculaires
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RiskFactorBar
                label="Hypertension artérielle"
                value={animatedStats.hypertension || 0}
                color="bg-gradient-to-r from-red-500 to-red-600"
                textColor="text-red-300"
                maxValue={50}
              />
              <RiskFactorBar
                label="Sédentarité"
                value={animatedStats.sedentarite || 0}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
                textColor="text-orange-300"
                maxValue={50}
              />
              <RiskFactorBar
                label="Surpoids"
                value={animatedStats.surpoids || 0}
                color="bg-gradient-to-r from-yellow-500 to-yellow-600"
                textColor="text-yellow-300"
                maxValue={50}
              />
              <RiskFactorBar
                label="Obésité"
                value={animatedStats.obesite || 0}
                color="bg-gradient-to-r from-red-400 to-red-500"
                textColor="text-red-300"
                maxValue={50}
              />
              <RiskFactorBar
                label="Dyslipidémies"
                value={animatedStats.dyslipidemia || 0}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                textColor="text-blue-300"
                maxValue={50}
              />
              <RiskFactorBar
                label="Tabagisme"
                value={animatedStats.tabagisme || 0}
                color="bg-gradient-to-r from-gray-500 to-gray-600"
                textColor="text-gray-300"
                maxValue={50}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="glass-morphism rounded-3xl p-8 neon-glow hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              {/* <Target className="text-cyan-400" size={32} /> */}
              Objectif Général
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Contribuer à l'amélioration du suivi et de la prise en charge des maladies cardiovasculaires (MCV) en proposant une approche innovante centrée-ménage plutôt que centrée-patient.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="glass-morphism rounded-3xl p-8 neon-glow hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              {/* <Bot className="text-purple-400" size={32} /> */}
              Objectifs du Chatbot
            </h2>
            <div className="space-y-4">
              <ObjectiveItem
                icon={<Shield className="text-green-400" size={20} />}
                text="Prévention des MCV chez les populations à risque"
                gradient="from-green-400 to-green-600"
              />
              <ObjectiveItem
                icon={<HeartPulse className="text-red-400" size={20} />}
                text="Prévention des complications chez les patients MCV"
                gradient="from-red-400 to-red-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 text-white shadow-2xl mb-16 neon-glow">
          <h2 className="text-4xl font-bold mb-8 flex items-center gap-3 justify-center">
            Approche Centrée-Ménage
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                {/* <Globe size={24} /> */}
                Baromètre Santé & Environnement
              </h3>
              <p className="text-white/90 leading-relaxed mb-6">
                Collecte intelligente des paramètres environnementaux critiques :
              </p>
              <div className="grid grid-cols-2 gap-3">
                <EnvironmentalFactor text="Habitat" />
                <EnvironmentalFactor text="Alimentation"/>
                <EnvironmentalFactor text="Air extérieur" />
                <EnvironmentalFactor text="Ondes EM" />
                <EnvironmentalFactor text="Bruit" />
                <EnvironmentalFactor text="Perturbateurs" />
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="glass-morphism rounded-3xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  {/* <Globe className="text-white mx-auto mb-4 animate-pulse" size={64} /> */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 animate-ping"></div>
                </div>
                <p className="text-white/90 text-lg">
                  Écosystème familial & environnemental
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-morphism rounded-3xl p-10 neon-glow mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-10 flex items-center gap-3 justify-center">
            {/* <Award className="text-yellow-400" size={36} /> */}
            Pipeline Technologique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResultCard
              icon={<Database className="text-blue-400" size={32} />}
              title="Sources Data"
              desc="Corpus scientifique"

              gradient="from-blue-500 to-blue-700"
            />
            <ResultCard
              icon={<Activity className="text-green-400" size={32} />}
              title="API Collecte"
              desc="Pipeline automatisé"

              gradient="from-green-500 to-green-700"
            />
            <ResultCard
              icon={<Brain className="text-purple-400" size={32} />}
              title="Base Vectorielle"
              desc=""

              gradient="from-purple-500 to-purple-700"
            />
            <ResultCard
              icon={<Bot className="text-cyan-400" size={32} />}
              title="Assistant Intelligent"
              desc="IA conversationnelle"

              gradient="from-cyan-500 to-cyan-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="glass-morphism rounded-3xl p-8 neon-glow">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Building className="text-indigo-400" size={28} />
              Institution
            </h2>
            <div className="space-y-6">
              <InstitutionCard
                title="UADB"
                subtitle="Université Alioune Diop de Bambey"
                location="Sénégal"

                />
              <InstitutionCard
                title="LIMA"
                subtitle="Laboratoire Informatique, Mathématiques et Applications"
                location="Excellence académique"

                />
              <InstitutionCard
                title="EIR-IMTICE"
                subtitle="Équipe Interdisciplinaire de Recherche"
                location="Informatique Médicale"

                />
            </div>
          </div>

          <div className="glass-morphism rounded-3xl p-8 neon-glow">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              {/* <MapPin className="text-red-400" size={28} /> */}
              Zone d'Impact
            </h2>
            <div className="space-y-6">
              <LocationCard
                title="Terrain d'étude"
                value="Saint-Louis, Sénégal"

                color="text-red-400"
              />
              <LocationCard
                title="Périmètre"
                value="5 communes ciblées"

                color="text-blue-400"
              />
              <LocationCard
                title="Partenariats"
                value="Ministère de la santé, ONG"

                color="text-green-400"
              />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl neon-glow">
          <h3 className="text-5xl font-bold mb-6"> MODCARV</h3>
          <p className="text-2xl mb-10 opacity-90">
            Participez à la révolution de la santé cardiovasculaire au Sénégal
          </p>
          <div className="flex justify-center gap-6">
            <button
              onClick={handleChatNavigation}
              className="bg-white text-purple-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 shadow-xl neon-glow"
            >
              Tester le chatbot
            </button>
            {/* <button
              className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-110"
            >
            </button> */}
          </div>
        </div>
      </div>

      <footer className="mt-20 py-12 text-center glass-morphism">
        <p className="text-gray-600 text-lg">
          &copy; 2025 Projet MODCARV - Grand Challenge Sénégal 2023 
        </p>
      </footer>
    </div>
  );
};

const StatCard = ({ value, maxValue, label, color, suffix, icon }) => (
  <div className="glass-morphism rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300">
    <div className="text-gray-700 mb-2">{icon}</div>
    <div className={`text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
      {value.toFixed(value % 1 === 0 ? 0 : 2)}{suffix}
    </div>
    <div className="text-gray-600 text-sm mb-3">{label}</div>
    <div className="w-full bg-gray-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
        style={{ width: `${(value / maxValue) * 100}%` }}
      ></div>
    </div>
  </div>
);

const RiskFactorBar = ({ label, value, color, textColor, maxValue }) => (
  <div className="glass-morphism rounded-xl p-4 hover:scale-105 transition-transform duration-300">
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-800 font-medium text-sm">{label}</span>
      <span className={`font-bold text-lg ${textColor}`}>
        {value.toFixed(value % 1 === 0 ? 0 : 2)}%
      </span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
      <div
        className={`h-3 rounded-full ${color} transition-all duration-1000 relative`}
        style={{ width: `${(value / maxValue) * 100}%` }}
      >
        <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ObjectiveItem = ({ icon, text, gradient }) => (
  <div className="flex items-start gap-4 p-4 glass-morphism rounded-xl hover:scale-105 transition-transform duration-300">
    <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient}`}>{icon}</div>
    <p className="text-gray-700 leading-relaxed flex-1">{text}</p>
  </div>
);

const EnvironmentalFactor = ({ text, icon }) => (
  <div className="glass-morphism rounded-xl p-3 text-center hover:scale-105 transition-transform duration-300 group">
    <div className="text-2xl mb-1 group-hover:scale-125 transition-transform duration-300">{icon}</div>
    <span className="text-sm font-medium text-white">{text}</span>
  </div>
);

const ResultCard = ({ icon, title, desc, step, gradient }) => (
  <div className="text-center group relative">
    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm">
      {step}
    </div>
    <div className={`bg-gradient-to-br ${gradient} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
      {icon}
    </div>
    <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
    <p className="text-gray-600 text-sm">{desc}</p>
  </div>
);

const InstitutionCard = ({ title, subtitle, location, icon }) => (
  <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 hover:scale-105 transition-transform duration-300">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="font-bold text-indigo-700">{title}</h3>
        <p className="text-gray-800 text-sm">{subtitle}</p>
        <p className="text-gray-600 text-xs">{location}</p>
      </div>
    </div>
  </div>
);

const LocationCard = ({ title, value, icon, color }) => (
  <div className="p-4 rounded-xl bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-400/30 hover:scale-105 transition-transform duration-300">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <p className={`${color} font-medium`}>{value}</p>
      </div>
    </div>
  </div>
);

export default AboutPage;