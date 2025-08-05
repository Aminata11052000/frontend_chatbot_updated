import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, HeartPulse, Stethoscope, Pill, Syringe, User, Eye, EyeOff, Home as HomeIcon, Activity, Utensils, Users } from 'lucide-react';
import { LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [showPersonalizationForm, setShowPersonalizationForm] = useState(false);
  const [infoForm, setInfoForm] = useState({
    age: '',
    sexe: '',
    antecedents: '',
    poids: ''
  });

  const [modcarvProfile, setModcarvProfile] = useState(null);
  const [healthBarometer, setHealthBarometer] = useState(null);
  const [showModcarvProfile, setShowModcarvProfile] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [approachType, setApproachType] = useState('généraliste');

  const chatWindowRef = useRef(null);
  const hasWelcomed = useRef(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:8000/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setUserName(data.nom || 'Utilisateur');
        setIsPatient(data.patient || false);

        if (data.patient) {
          try {
            const modcarvRes = await fetch('http://localhost:8000/modcarv/profile/', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (modcarvRes.ok) {
              const modcarvData = await modcarvRes.json();
              setModcarvProfile(modcarvData);
              setApproachType('centrée-ménage');
            }

            const barometerRes = await fetch('http://localhost:8000/modcarv/barometre/', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (barometerRes.ok) {
              const barometerData = await barometerRes.json();
              setHealthBarometer(barometerData);
            }

          } catch (profileError) {
            console.log("Pas de profil patient MODCARV disponible");
          }
        }
      } catch (err) {
        console.error("Erreur récupération user :", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/historique/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const historique = await response.json();
          
          const allMessages = [];
          let latestSessionId = null;
          
          historique.forEach(session => {
            latestSessionId = session.session_id;
            
            session.messages.forEach((msg, index) => {
              const isUserMessage = index % 2 === 0;
              
              allMessages.push({
                id: `${session.session_id}_${index}`,
                sender: isUserMessage ? 'user' : 'bot',
                text: msg.contenu,
                sources: isUserMessage ? [] : [], 
                dateCreation: msg.date,
                session_id: session.session_id
              });
            });
          });
          
          if (allMessages.length > 0) {
            setMessages(allMessages);
            setSessionId(latestSessionId);
            hasWelcomed.current = true;
          } else {
            const welcomeText = isPatient && modcarvProfile 
              ? ` Bienvenue dans l'assistant MODCARV ! 

Je suis spécialisé dans l'analyse des facteurs de risque cardiovasculaires à l'échelle de votre ménage. Votre profil environnemental et familial est pris en compte pour des recommandations personnalisées.

Que puis-je faire pour vous ?`
              : "Bienvenue ! Je suis votre assistant médical spécialisé en maladies cardiovasculaires.\nQue puis-je faire pour vous ?";
            
            const welcomeMessage = {
              id: 'welcome',
              sender: 'bot',
              text: welcomeText,
              sources: [],
              dateCreation: new Date().toISOString()
            };
            setMessages([welcomeMessage]);
            hasWelcomed.current = true;
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        
        const welcomeMessage = {
          id: 'welcome',
          sender: 'bot',
          text: "Bienvenue ! Je suis votre assistant médical spécialisé en maladies cardiovasculaires.\nQue puis-je faire pour vous ?",
          sources: [],
          dateCreation: new Date().toISOString()
        };
        setMessages([welcomeMessage]);
        hasWelcomed.current = true;
      }
    };

    loadHistory();
  }, [isPatient, modcarvProfile]);

  useEffect(() => {
    chatWindowRef.current?.scrollTo({
      top: chatWindowRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages, isLoading]);

  const askQuestion = async (question) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/ask/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ question })
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();

      return {
        answer: data.answer || "Désolé, je n'ai pas compris votre question.",
        sources: data.sources || [],
        session_id: data.session_id || null,
        bot_message_id: data.bot_message_id,
        user_type: data.user_type,
        modcarv_approach: data.modcarv_approach,
        modcarv_context: data.modcarv_context,
        environmental_factors: data.environmental_factors,
        household_risk_factors: data.household_risk_factors
      };
    } catch (error) {
      console.error(error);
      return { answer: "Erreur serveur.", sources: [] };
    }
  };

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = { 
      id: Date.now(), 
      sender: 'user', 
      text: question.trim(),
      dateCreation: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    const { 
      answer, 
      sources, 
      session_id, 
      bot_message_id,
      user_type,
      modcarv_approach,
      modcarv_context,
      environmental_factors,
      household_risk_factors
    } = await askQuestion(userMessage.text);
    
    if (session_id) setSessionId(session_id);

    let cleanAnswer = answer;
    if (cleanAnswer.startsWith("Bienvenue")) {
      if (hasWelcomed.current) {
        cleanAnswer = cleanAnswer.split('\n').slice(1).join('\n').trim();
      } else {
        hasWelcomed.current = true;
      }
    }

    const blockPrompt = "Avant de continuer, pouvez-vous me dire";
    if (!cleanAnswer.startsWith(blockPrompt)) {
      const botMessage = { 
        id: bot_message_id || Date.now() + 1, 
        sender: 'bot', 
        text: cleanAnswer, 
        sources,
        dateCreation: new Date().toISOString(),
        user_type,
        modcarv_approach,
        modcarv_context,
        environmental_factors,
        household_risk_factors
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    setIsLoading(false);
  };

  const handleSubmitInfo = async () => {
    const { age, sexe, antecedents, poids } = infoForm;
    if (!sessionId) {
      alert("Veuillez poser une première question pour démarrer la session.");
      return;
    }

    if (!age || !sexe || !antecedents || !poids) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await fetch('http://localhost:8000/ask_info/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, age, sexe, antecedents, poids })
      });

      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now(),
          sender: 'bot', 
          text: "Merci pour ces informations. Je personnaliserai désormais mes réponses.",
          dateCreation: new Date().toISOString()
        }
      ]);
      setShowPersonalizationForm(false);
    } catch (err) {
      console.error("Erreur envoi info:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const UnifiedModcarvCard = () => {
    if (!modcarvProfile && !healthBarometer) return null;

    const barometer = healthBarometer?.barometre_sante_environnement;

    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl shadow-md mb-4 z-10 border-l-4 border-green-500">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-green-700 flex items-center gap-2">
            <HomeIcon size={18} />
            Profil MODCARV - Approche Centrée-Ménage
          </h3>
          <button
            onClick={() => setShowModcarvProfile(!showModcarvProfile)}
            className="text-green-600 hover:text-green-800"
          >
            {showModcarvProfile ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
{showModcarvProfile && (
          <div className="text-sm space-y-4">
            {modcarvProfile && (
              <div className="bg-green-100 p-3 rounded-lg">
                <div className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <Users size={16} />
                  Contexte Familial
                </div>
                <div className="text-sm text-green-800 space-y-3">
                  {(() => {
                    const context = modcarvProfile.modcarv_context;
                    const sections = context.split(/(?=PATIENT MODCARV:|ENVIRONNEMENT MÉNAGE:|FRCV PARTAGÉS MÉNAGE:|BAROMÈTRE SANTÉ-ENVIRONNEMENT:)/);
                    
                    const unifiedInfo = {
                      patient: null,
                      environment: [],
                      risks: null
                    };

                    sections.forEach(section => {
                      if (section.includes('PATIENT MODCARV:')) {
                        unifiedInfo.patient = section.replace('PATIENT MODCARV:', '').trim();
                      }
                      
                      if (section.includes('ENVIRONNEMENT MÉNAGE:')) {
                        const envInfo = section.replace('ENVIRONNEMENT MÉNAGE:', '').trim();
                        unifiedInfo.environment = envInfo.split(' | ').map(item => item.trim());
                      }
                      
                      if (section.includes('FRCV PARTAGÉS MÉNAGE:')) {
                        unifiedInfo.risks = section.replace('FRCV PARTAGÉS MÉNAGE:', '').trim();
                      }
                    });

                    const additionalEnvInfo = [];
                    if (barometer?.activite_physique?.jours_sport !== null && barometer?.activite_physique?.jours_sport !== undefined) {
                      additionalEnvInfo.push(`Sport: ${barometer.activite_physique.jours_sport} j/sem`);
                    }
                    if (barometer?.habitudes?.tabac) {
                      additionalEnvInfo.push(`Tabac: ${barometer.habitudes.tabac}`);
                    }
                    if (barometer?.habitudes?.alcool) {
                      additionalEnvInfo.push(`Alcool: ${barometer.habitudes.alcool}`);
                    }
                    if (barometer?.habitudes?.sommeil) {
                      additionalEnvInfo.push(`Sommeil: ${barometer.habitudes.sommeil}`);
                    }

                    return (
                      <>
                        {unifiedInfo.patient && (
                          <div className="bg-white p-2 rounded border-l-2 border-green-500">
                            <div className="flex items-center gap-1 font-medium text-green-700 mb-1">
                              <User size={14} />
                              Patient Principal
                            </div>
                            <div className="text-xs text-green-800">{unifiedInfo.patient}</div>
                          </div>
                        )}

                        {unifiedInfo.environment?.length > 0 && (
                          <div className="bg-white p-2 rounded border-l-2 border-blue-500">
                            <div className="flex items-center gap-1 font-medium text-blue-700 mb-1">
                              <HomeIcon size={14} />
                              Environnement du Ménage
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-blue-800">
                              {unifiedInfo.environment.map((item, i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                  {item}
                                </div>
                              ))}
                              {additionalEnvInfo.map((item, i) => (
                                <div key={`add-${i}`} className="flex items-center gap-1">
                                  <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {unifiedInfo.risks && (
                          <div className="bg-white p-2 rounded border-l-2 border-red-500">
                            <div className="flex items-center gap-1 font-medium text-red-700 mb-1">
                              <Activity size={14} />
                              Facteurs de Risque Partagés
                            </div>
                            <div className="text-xs text-red-800 font-medium">{unifiedInfo.risks}</div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {barometer && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(barometer.stress_bien_etre?.niveau_stress || barometer.stress_bien_etre?.soutien_social || barometer.stress_bien_etre?.loisirs) && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 font-semibold text-yellow-700 mb-2">
                      <User size={16} />
                      Bien-être
                    </div>
                    <div className="space-y-1 text-xs">
                      {barometer.stress_bien_etre?.niveau_stress && (
                        <div> Stress: {barometer.stress_bien_etre.niveau_stress}</div>
                      )}
                      {barometer.stress_bien_etre?.soutien_social && (
                        <div> Soutien: {barometer.stress_bien_etre.soutien_social}</div>
                      )}
                      {barometer.stress_bien_etre?.loisirs && (
                        <div> Loisirs: {barometer.stress_bien_etre.loisirs}</div>
                      )}
                    </div>
                  </div>
                )}


                {(barometer.alimentation?.lieu_repas || barometer.alimentation?.frequence_cuisson) && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 font-semibold text-orange-700 mb-2">
                      <Utensils size={16} />
                      Détails Alimentation
                    </div>
                    <div className="space-y-1 text-xs">
                      {barometer.alimentation?.lieu_repas && (
                        <div> Lieu: {barometer.alimentation.lieu_repas}</div>
                      )}
                      {barometer.alimentation?.frequence_cuisson && (
                        <div> Cuisson: {barometer.alimentation.frequence_cuisson}</div>
                      )}
                    </div>
                  </div>
                )}


                {(barometer.activite_physique?.type_sport || barometer.activite_physique?.transport_actif) && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 font-semibold text-purple-700 mb-2">
                      <Activity size={16} />
                      Détails Activité
                    </div>
                    <div className="space-y-1 text-xs">
                      {barometer.activite_physique?.type_sport && (
                        <div> Type: {barometer.activite_physique.type_sport}</div>
                      )}
                      {barometer.activite_physique?.transport_actif && (
                        <div> Transport: {barometer.activite_physique.transport_actif}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}


            {modcarvProfile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 font-semibold text-blue-700 mb-2">
                    <TreePine size={16} />
                    Facteurs Environnementaux
                  </div>
                  <div className="text-xs text-blue-800">
                    {modcarvProfile.environmental_factors}
                  </div>
                </div>
                 */}
                {/* <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 font-semibold text-red-700 mb-2">
                    <Activity size={16} />
                    Facteurs de Risque Ménage
                  </div>
                  <div className="text-xs text-red-800">
                    {modcarvProfile.household_risk_factors}
                  </div>
                </div> */}
              </div>
            )}
            
            <div className="text-xs text-gray-500 italic">
               Approche centrée-ménage active pour des recommandations familiales personnalisées
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-screen bg-gray-100 p-4 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-6 mb-4 bg-white rounded-xl shadow-md z-20 max-w-7xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
        >
          <Home size={18} /> Retour
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-indigo-700 font-semibold text-sm">
            <User size={18} /> {userName}
            {isPatient && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full ml-2">
                {approachType === 'centrée-ménage' ? 'Patient MODCARV' : 'Patient'}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
                localStorage.removeItem('access_token');
                navigate('/welcome');
              }
            }}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      <Bot className="absolute top-10 left-5 text-indigo-500 opacity-40 w-32 h-32 animate-spin-slow" />
      <HeartPulse className="absolute top-32 left-1/3 text-red-500 opacity-40 w-28 h-28" />
      <Stethoscope className="absolute bottom-32 left-1/4 text-blue-500 opacity-40 w-24 h-24" />
      <Pill className="absolute top-20 right-1/4 text-pink-500 opacity-40 w-20 h-20" />
      <Syringe className="absolute bottom-10 right-1/5 text-green-500 opacity-40 w-24 h-24" />

      <style>
        {`
          .animate-spin-slow {
            animation: spin 12s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="text-xl font-semibold mb-2 text-center text-indigo-700 z-10">
        {approachType === 'centrée-ménage' ? ' Assistant MODCARV ' : 'Assistant Cardiovasculaire'}
      </div>

      {isPatient && (modcarvProfile || healthBarometer) && <UnifiedModcarvCard />}

      <div className="flex justify-between items-center mb-4 z-10">
        {!isPatient && (
          <button
            onClick={() => setShowPersonalizationForm(!showPersonalizationForm)}
            className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-full shadow hover:bg-indigo-600 transition-all duration-200"
          >
            Personnaliser les réponses
          </button>
        )}
      </div>

      {showPersonalizationForm && !isPatient && (
        <div className="bg-indigo-50 p-4 rounded-xl shadow-md mb-6 z-10">
          <p className="font-semibold text-indigo-700 mb-2">Vos informations :</p>
          <div className="space-y-2 max-w-md mx-auto">
            <input
              type="number"
              placeholder="Âge"
              className="w-full max-w-xs p-2 border rounded"
              value={infoForm.age}
              onChange={(e) => setInfoForm({ ...infoForm, age: e.target.value })}
            />
            <select
              className="w-full max-w-xs p-2 border rounded"
              value={infoForm.sexe}
              onChange={(e) => setInfoForm({ ...infoForm, sexe: e.target.value })}
            >
              <option value="">Sexe</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
            <input
              type="text"
              placeholder="Antécédents médicaux"
              className="w-full max-w-xs p-2 border rounded"
              value={infoForm.antecedents}
              onChange={(e) => setInfoForm({ ...infoForm, antecedents: e.target.value })}
            />
            <input
              type="number"
              placeholder="Poids (kg)"
              className="w-full max-w-xs p-2 border rounded"
              value={infoForm.poids}
              onChange={(e) => setInfoForm({ ...infoForm, poids: e.target.value })}
            />
            <button
              onClick={handleSubmitInfo}
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 mt-2"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}

      <div
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 z-10"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          marginBottom: '1rem'
        }}
      >
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Aucun message pour l'instant.</p>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.sender === 'user';
          const date = msg.dateCreation ? new Date(msg.dateCreation).toLocaleString() : '';
          
          return (
            <div
              key={i}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`relative px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                  isUser ? 'bg-indigo-100 text-right' : 'bg-gray-200 text-left'
                }`}
                style={{ maxWidth: '70%' }}
              >
                {msg.sender === 'bot' ? (
                  <>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    
                    {msg.modcarv_approach === 'centrée-ménage' && (
                      <div className="mt-3 p-2 bg-green-50 rounded border-l-2 border-green-400">
                        <div className="text-xs font-semibold text-green-700 mb-1">
                           Approche MODCARV Centrée-Ménage
                        </div>
                        <div className="text-xs text-green-600">
                          Recommandations adaptées à votre contexte familial et environnemental
                        </div>
                      </div>
                    )}
                    
                    {msg.sources?.length > 0 && (
                      <div className="mt-2 text-xs text-blue-700">
                        <div className="font-semibold mb-1">Sources :</div>
                        {msg.sources.map((src, idx) => {
                          const rawUrl = src?.url || src?.metadata?.url;
                          if (!rawUrl) return null;

                          let hostname;
                          try {
                            hostname = new URL(rawUrl).hostname;
                          } catch (error) {
                            return null;
                          }

                          return (
                            <div key={idx}>
                              🔗{' '}
                              <a
                                href={rawUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline break-all"
                              >
                                {hostname}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  msg.text
                )}
                
                {date && (
                  <div className="text-[10px] mt-1 text-gray-500">{date}</div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center items-center gap-2 z-10">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            approachType === 'centrée-ménage' 
              ? "Posez votre question sur les risques cardiovasculaires..."
              : "Posez votre question ici..."
          }
          className="w-full max-w-2xl p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 resize-none"
          rows={2}
        />
        <button
          onClick={handleSend}
          className={`px-4 rounded-r-lg text-white ${
            approachType === 'centrée-ménage' 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Envoyer'}
        </button>
      </div>

      {isPatient && modcarvProfile && messages.length <= 1 && (
        <div className="mt-4 z-10">
          <div className="text-center text-sm text-gray-600 mb-2">
            {/*   Questions suggérées pour l'approche centrée-ménage : */}          
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Quels sont les facteurs de risque partagés dans ma famille ?",
              "Comment l'environnement de mon domicile affecte-t-il ma santé cardiovasculaire ?",
              "Quelles mesures préventives pour tout le ménage ?",
              "Comment améliorer le baromètre santé-environnement de ma famille ?"
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(suggestion)}
                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;