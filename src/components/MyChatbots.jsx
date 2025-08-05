

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const MyChatbots = () => {
//   const navigate = useNavigate();
//   const [chatbots, setChatbots] = useState([]);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (!token) return navigate("/login");

//     const fetchUserAndBots = async () => {
//       try {
//         const userRes = await fetch("http://localhost:8000/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (userRes.ok) {
//           const userData = await userRes.json();
//           setUser(userData);
//         }

//         const botsRes = await fetch("http://localhost:8000/my_chatbots", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (botsRes.ok) {
//           const botsData = await botsRes.json();
//           console.log("Chatbots récupérés :", botsData);

//           setChatbots(botsData);
//         }
//       } catch (err) {
//         console.error("Erreur lors de la récupération des chatbots:", err);
//         navigate("/login");
//       }
//     };

//     fetchUserAndBots();

//     const interval = setInterval(() => {
//       fetchUserAndBots();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [navigate]);

//   const goToChat = (chatbotId) => {
//     navigate(`/chat/${chatbotId}`);
//   };

//   return (
//     <>
//       <Navbar user={user} />
//       <div className="min-h-screen bg-gray-100 px-6 pt-24">
//         <h1 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
//           Mes chatbots 
//         </h1>
//         {/* {user && (
//           <p className="text-center text-gray-700 mb-6">
//             Connecté en tant que <span className="font-semibold">{user.nom}</span>
//           </p>
//         )} */}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {chatbots.length === 0 ? (
//             <p className="text-center col-span-full text-gray-500">
//               Aucun chatbot créé pour l'instant.
//             </p>
//           ) : (
//             chatbots.map((bot) => (
//               <div
//                 key={bot.id}
//                 className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-all"
//               >
//                 <h2 className="text-lg font-semibold text-indigo-700">{bot.nom}</h2>
//                 <p className="text-sm text-gray-600 mt-2">
//                   Créé par <span className="font-medium">{user?.nom}</span> le{" "}
//                   {new Date(bot.dateCreation).toLocaleDateString()}
//                 </p>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Statut :{" "}
//                   <span
//                     className={
//                       bot.indexing_status === "done"
//                         ? "text-green-600"
//                         : bot.indexing_status === "in_progress"
//                         ? "text-yellow-600"
//                         : bot.indexing_status === "error"
//                         ? "text-red-600"
//                         : "text-gray-600"
//                     }
//                   >
//                     {bot.indexing_status === "in_progress" && "Indexation en cours..."}
//                     {bot.indexing_status === "done" && "Prêt"}
//                     {bot.indexing_status === "error" && "Erreur"}
//                     {bot.indexing_status === null && "En attente"}
//                   </span>
//                 </p>

//                 <button
//                   onClick={() => goToChat(bot.id)}
//                   disabled={bot.indexing_status !== "done"}
//                   className={`mt-4 px-4 py-2 rounded w-full transition-all ${
//                     bot.indexing_status === "done"
//                       ? "bg-indigo-600 text-white hover:bg-indigo-700"
//                       : "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   }`}
//                 >
//                   {bot.indexing_status === "done" ? "Accéder au chat" : "Indisponible"}
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default MyChatbots;






import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const MyChatbots = () => {
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return navigate("/login");

    const fetchUserAndBots = async () => {
      try {
        const userRes = await fetch("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        const botsRes = await fetch("http://localhost:8000/my_chatbots", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (botsRes.ok) {
          const botsData = await botsRes.json();
          console.log("Chatbots récupérés :", botsData);

          setChatbots(botsData);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des chatbots:", err);
        navigate("/login");
      }
    };

    fetchUserAndBots();

    const interval = setInterval(() => {
      fetchUserAndBots();
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const goToChat = (chatbotId) => {
    navigate(`/chat/${chatbotId}`);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "done":
        return "";
      case "in_progress":
        return "";
      case "error":
        return "";
      default:
        return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "in_progress":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 pt-24">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Mes Chatbots
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gérez et interagissez avec vos assistants IA personnalisés
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Chatbots</p>
                  <p className="text-3xl font-bold text-indigo-600">{chatbots.length}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Actifs</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {chatbots.filter(bot => bot.indexing_status === "done").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">En cours</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {chatbots.filter(bot => bot.indexing_status === "in_progress").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chatbots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chatbots.length === 0 ? (
              <div className="col-span-full">
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🤖</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Aucun chatbot créé
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Commencez par créer votre premier assistant IA
                  </p>
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all transform hover:scale-105">
                    Créer un chatbot
                  </button>
                </div>
              </div>
            ) : (
              chatbots.map((bot) => (
                <div
                  key={bot.id}
                  className="group bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Bot Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">


                      <div>
                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {bot.nom}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {new Date(bot.dateCreation).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>


                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Créé par <span className="font-medium text-gray-800">{user?.nom}</span>
                    </span>
                  </div>


                  <div className="mb-6">
                    <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(bot.indexing_status)}`}>
                      <span>{getStatusIcon(bot.indexing_status)}</span>
                      <span>
                        {bot.indexing_status === "in_progress" && "Indexation en cours..."}
                        {bot.indexing_status === "done" && "Prêt à utiliser"}
                        {bot.indexing_status === "error" && "Erreur d'indexation"}
                        {bot.indexing_status === null && "En attente"}
                      </span>
                    </div>
                  </div>


                  <button
                    onClick={() => goToChat(bot.id)}
                    disabled={bot.indexing_status !== "done"}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                      bot.indexing_status === "done"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {bot.indexing_status === "done" ? (
                      <span className="flex items-center justify-center space-x-2">
                        <span>💬</span>
                        <span>Accéder au chat</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>🔒</span>
                        <span>Indisponible</span>
                      </span>
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyChatbots;