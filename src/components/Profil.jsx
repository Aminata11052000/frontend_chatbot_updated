// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Home, LogOut, Bot, HeartPulse,
//   Stethoscope, Pill, Syringe, User,
//   Calendar, Trash2, MessageCircle
// } from 'lucide-react';

// const Profil = () => {
//   const [user, setUser] = useState(null);
//   const [chatbots, setChatbots] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem('access_token');
//       if (!token) return navigate('/login');

//       try {
//         const res = await fetch('http://localhost:8000/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setUser(data);

//         const botRes = await fetch("http://localhost:8000/my_chatbots", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const botData = await botRes.json();
//         setChatbots(botData);
//       } catch (err) {
//         console.error('Erreur récupération :', err);
//         navigate('/login');
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   const handleLogout = () => {
//     if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
//       localStorage.removeItem('access_token');
//       navigate('/welcome');
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'done':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'in_progress':
//         return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       default:
//         return 'bg-red-100 text-red-800 border-red-200';
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case 'done':
//         return 'Prêt';
//       case 'in_progress':
//         return 'En cours';
//       default:
//         return 'Erreur';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">

//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <Bot className="absolute top-10 left-5 text-indigo-200 opacity-10 w-32 h-32 animate-spin-slow" />
//         <Bot className="absolute bottom-20 right-10 text-purple-300 opacity-10 w-40 h-40 animate-pulse" />
//         <HeartPulse className="absolute top-32 left-1/3 text-red-300 opacity-10 w-28 h-28 animate-ping" />
//         <Stethoscope className="absolute bottom-32 left-1/4 text-blue-200 opacity-10 w-24 h-24" />
//         <Pill className="absolute top-20 right-1/4 text-pink-300 opacity-10 w-20 h-20" />
//         <Syringe className="absolute bottom-10 right-1/5 text-green-300 opacity-10 w-24 h-24" />
        

//         <div className="absolute top-1/4 right-1/3 w-20 h-20 bg-indigo-100 rounded-full opacity-20 animate-bounce"></div>
//         <div className="absolute bottom-1/3 left-1/5 w-16 h-16 bg-purple-100 rounded-full opacity-20 animate-pulse"></div>
//       </div>


//       <div className="relative z-10 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 px-8 py-6 flex justify-between items-center">
//             <div className="flex items-center gap-6">
//               <button 
//                 onClick={() => navigate('/home')} 
//                 className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
//               >
//                 <Home size={20} />
//                 Accueil
//               </button>
//             </div>
//             <button 
//               onClick={handleLogout} 
//               className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
//             >
//               <LogOut size={20} />
//               Déconnexion
//             </button>
//           </div>
//         </div>
//       </div>


//       <div className="relative z-10 px-6 pb-12">
//         <div className="max-w-7xl mx-auto">
//           {!user ? (
//             <div className="flex items-center justify-center min-h-[400px]">
//               <div className="text-center">
//                 <Bot className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-pulse" />
//                 <p className="text-gray-600 text-lg">Chargement de votre profil...</p>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-6">

//               <div className="text-center">
//                 <h1 className="text-4xl font-bold text-gray-800 mb-2">Mon Profil</h1>
//               </div>


//               <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

//                 <div className="xl:col-span-4">
//                   <div className="space-y-8">

//                     <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
//                       <div className="text-center mb-6">
//                         <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
//                           <User className="w-10 h-10 text-white" />
//                         </div>
//                         <h2 className="text-2xl font-bold text-gray-800">{user.nom}</h2>
//                         <p className="text-gray-600">{user.email}</p>
//                       </div>
                      
//                       <div className="space-y-4">
//                         <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
//                           <span className="text-gray-700 font-medium">Rôle</span>
//                           <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium capitalize">
//                             {user.role}
//                           </span>
//                         </div>
                        
//                         <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
//                           <span className="text-gray-700 font-medium">Statut</span>
//                           <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//                             Actif
//                           </span>
//                         </div>
//                       </div>
//                     </div>


//                     <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
//                       <div className="flex items-center gap-3 mb-6">
//                         <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
//                           <Bot className="w-5 h-5 text-white" />
//                         </div>
//                         <h2 className="text-2xl font-bold text-gray-800">Mes Chatbots</h2>
//                         <span className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
//                           {chatbots.length} chatbot{chatbots.length > 1 ? 's' : ''}
//                         </span>
//                       </div>
                      
//                       {chatbots.length === 0 ? (
//                         <div className="text-center py-8">
//                           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <Bot className="w-8 h-8 text-gray-400" />
//                           </div>
//                           <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun chatbot</h3>
//                           <p className="text-gray-500 text-sm">Créez votre premier chatbot pour commencer</p>
//                         </div>
//                       ) : (
//                         <div className="space-y-4">
//                           {chatbots.map((bot) => (
//                             <div key={bot.id} className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
//                               <div className="flex items-start justify-between mb-3">
//                                 <div className="flex items-center gap-3">
//                                   <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
//                                     <Bot className="w-5 h-5 text-white" />
//                                   </div>
//                                   <div>
//                                     <h3 className="text-base font-bold text-gray-800 mb-1">{bot.nom}</h3>
//                                     <div className="flex items-center gap-2 text-xs text-gray-500">
//                                       <Calendar className="w-3 h-3" />
//                                       {new Date(bot.dateCreation).toLocaleDateString('fr-FR')}
//                                     </div>
//                                   </div>
//                                 </div>
                                
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bot.indexing_status)}`}>
//                                   {getStatusText(bot.indexing_status)}
//                                 </span>
//                               </div>

//                               <div className="flex gap-2">
//                                 <button
//                                   className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
//                                   onClick={() => navigate(`/chat/${bot.id}`)}
//                                   disabled={bot.indexing_status !== "done"}
//                                 >
//                                   <MessageCircle className="w-4 h-4" />
//                                   Chat
//                                 </button>
                                
//                                 <button
//                                   onClick={async () => {
//                                     if (window.confirm(`Voulez-vous vraiment supprimer le chatbot "${bot.nom}" ?`)) {
//                                       const token = localStorage.getItem('access_token');
//                                       try {
//                                         const res = await fetch(`http://localhost:8000/chatbots/${bot.id}`, {
//                                           method: "DELETE",
//                                           headers: {
//                                             Authorization: `Bearer ${token}`,
//                                           },
//                                         });
//                                         if (!res.ok) {
//                                           const err = await res.json();
//                                           alert("Erreur : " + err.detail);
//                                         } else {
//                                           setChatbots((prev) => prev.filter((b) => b.id !== bot.id));
//                                         }
//                                       } catch (err) {
//                                         console.error("Erreur lors de la suppression :", err);
//                                         alert("Erreur lors de la suppression.");
//                                       }
//                                     }
//                                   }}
//                                   className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-110 transition-all duration-200"
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>


//                 <div className="xl:col-span-8">
//                   <div className="space-y-8">

//                     {user.dossier && (
//                       <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
//                         <div className="flex items-center gap-3 mb-6">
//                           <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
//                             <Stethoscope className="w-5 h-5 text-white" />
//                           </div>
//                           <h2 className="text-2xl font-bold text-gray-800">Informations Patient</h2>
//                         </div>
                        
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                           {Object.entries(user.dossier).map(([key, value], idx) => (
//                             <div key={key} className="p-4 bg-gray-50 rounded-xl">
//                               <div className="text-sm text-gray-600 font-medium capitalize mb-1">
//                                 {key.replace(/_/g, ' ')}
//                               </div>
//                               <div className="text-gray-800 font-semibold">{String(value)}</div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style>{`
//         .animate-spin-slow {
//           animation: spin 20s linear infinite;
//         }
//         @keyframes float {
//           0%, 100% { transform: translateY(0px); }
//           50% { transform: translateY(-10px); }
//         }
//         .animate-float {
//           animation: float 6s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Profil;


import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, LogOut, Bot, HeartPulse,
  Stethoscope, Pill, Syringe, User,
  Calendar, Trash2, MessageCircle
} from 'lucide-react';

const Profil = () => {
  const [user, setUser] = useState(null);
  const [chatbots, setChatbots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return navigate('/login');

      try {
        const res = await fetch('http://localhost:8000/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);

        const botRes = await fetch("http://localhost:8000/my_chatbots", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const botData = await botRes.json();
        setChatbots(botData);
      } catch (err) {
        console.error('Erreur récupération :', err);
        navigate('/login');
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      localStorage.removeItem('access_token');
      navigate('/welcome');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done':
        return 'Prêt';
      case 'in_progress':
        return 'En cours';
      default:
        return 'Erreur';
    }
  };

  // Vérifier si l'utilisateur est un patient (a un dossier)
  const isPatient = user && user.dossier;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Bot className="absolute top-10 left-5 text-indigo-200 opacity-10 w-32 h-32 animate-spin-slow" />
        <Bot className="absolute bottom-20 right-10 text-purple-300 opacity-10 w-40 h-40 animate-pulse" />
        <HeartPulse className="absolute top-32 left-1/3 text-red-300 opacity-10 w-28 h-28 animate-ping" />
        <Stethoscope className="absolute bottom-32 left-1/4 text-blue-200 opacity-10 w-24 h-24" />
        <Pill className="absolute top-20 right-1/4 text-pink-300 opacity-10 w-20 h-20" />
        <Syringe className="absolute bottom-10 right-1/5 text-green-300 opacity-10 w-24 h-24" />
        

        <div className="absolute top-1/4 right-1/3 w-20 h-20 bg-indigo-100 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/5 w-16 h-16 bg-purple-100 rounded-full opacity-20 animate-pulse"></div>
      </div>


      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 px-8 py-6 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/home')} 
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-medium"
              >
                <Home size={20} />
                Accueil
              </button>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>


      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {!user ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Bot className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600 text-lg">Chargement de votre profil...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">

              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Mon Profil</h1>
              </div>


              <div className={`grid grid-cols-1 gap-8 ${isPatient ? 'xl:grid-cols-12' : 'max-w-2xl mx-auto'}`}>

                <div className={isPatient ? 'xl:col-span-4' : ''}>
                  <div className="space-y-8">

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.nom}</h2>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl">
                          <span className="text-gray-700 font-medium">Rôle</span>
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium capitalize">
                            {user.role}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                          <span className="text-gray-700 font-medium">Statut</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Actif
                          </span>
                        </div>
                      </div>
                    </div>


                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Mes Chatbots</h2>
                        <span className="ml-auto px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {chatbots.length} chatbot{chatbots.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {chatbots.length === 0 ? (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bot className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucun chatbot</h3>
                          <p className="text-gray-500 text-sm">Créez votre premier chatbot pour commencer</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {chatbots.map((bot) => (
                            <div key={bot.id} className="group relative bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="text-base font-bold text-gray-800 mb-1">{bot.nom}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(bot.dateCreation).toLocaleDateString('fr-FR')}
                                    </div>
                                  </div>
                                </div>
                                
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(bot.indexing_status)}`}>
                                  {getStatusText(bot.indexing_status)}
                                </span>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
                                  onClick={() => navigate(`/chat/${bot.id}`)}
                                  disabled={bot.indexing_status !== "done"}
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  Chat
                                </button>
                                
                                <button
                                  onClick={async () => {
                                    if (window.confirm(`Voulez-vous vraiment supprimer le chatbot "${bot.nom}" ?`)) {
                                      const token = localStorage.getItem('access_token');
                                      try {
                                        const res = await fetch(`http://localhost:8000/chatbots/${bot.id}`, {
                                          method: "DELETE",
                                          headers: {
                                            Authorization: `Bearer ${token}`,
                                          },
                                        });
                                        if (!res.ok) {
                                          const err = await res.json();
                                          alert("Erreur : " + err.detail);
                                        } else {
                                          setChatbots((prev) => prev.filter((b) => b.id !== bot.id));
                                        }
                                      } catch (err) {
                                        console.error("Erreur lors de la suppression :", err);
                                        alert("Erreur lors de la suppression.");
                                      }
                                    }
                                  }}
                                  className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-110 transition-all duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>


                {isPatient && (
                  <div className="xl:col-span-8">
                    <div className="space-y-8">

                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800">Informations Patient</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {Object.entries(user.dossier).map(([key, value], idx) => (
                            <div key={key} className="p-4 bg-gray-50 rounded-xl">
                              <div className="text-sm text-gray-600 font-medium capitalize mb-1">
                                {key.replace(/_/g, ' ')}
                              </div>
                              <div className="text-gray-800 font-semibold">{String(value)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Profil;