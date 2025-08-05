// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Bot, Code2, Server, Cpu, Trash2, User, LogOut, Home } from "lucide-react";
// import ReactMarkdown from "react-markdown";

// const CustomChat = () => {
//   const { chatbotId } = useParams();
//   const token = localStorage.getItem("access_token");
//   const [messages, setMessages] = useState([]);
//   const [user, setUser] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [chatbotName, setChatbotName] = useState("");
//   const [chatbot, setChatbot] = useState(null); // Ajout pour stocker les infos du chatbot

//   const chatWindowRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchAll = async () => {
//       try {
//         const userRes = await fetch("http://localhost:8000/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!userRes.ok) {
//           if (userRes.status === 401 || userRes.status === 403) {
//             localStorage.removeItem("access_token");
//             navigate("/login");
//             return;
//           }
//           throw new Error(`Erreur ${userRes.status}`);
//         }
//         const userData = await userRes.json();
//         setUser(userData);
    
//         const chatbotUrl =
//           userData.role === "ADMIN"
//             ? `http://localhost:8000/admin/chatbots/${chatbotId}`
//             : `http://localhost:8000/chatbots/${chatbotId}`;
    
//         const chatbotRes = await fetch(chatbotUrl, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!chatbotRes.ok) {
//           if (chatbotRes.status === 401 || chatbotRes.status === 403) {
//             localStorage.removeItem("access_token");
//             navigate("/login");
//             return;
//           }
//           throw new Error(`Erreur ${chatbotRes.status}`);
//         }
//         const chatbotData = await chatbotRes.json();
//         setChatbotName(chatbotData.nom);
//         setChatbot(chatbotData); // Stocker les données complètes du chatbot
    
//         const res = await fetch(
//           `http://localhost:8000/chatbots/${chatbotId}/messages`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (!res.ok) {
//           if (res.status === 401 || res.status === 403) {
//             localStorage.removeItem("access_token");
//             navigate("/login");
//             return;
//           }
//           throw new Error(`Erreur ${res.status}`);
//         }
//         const data = await res.json();
//         setMessages(data);
    
//         setLoading(false);
//       } catch (err) {
//         console.error("Erreur chargement:", err);
//         setLoading(false);
//       }
//     };

//     fetchAll();
//   }, [chatbotId, token, navigate]);

//   useEffect(() => {
//     chatWindowRef.current?.scrollTo({
//       top: chatWindowRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!newMessage.trim()) return;

//     try {
//       const res = await fetch(`http://localhost:8000/chatbots/${chatbotId}/chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ contenu: newMessage }),
//       });

//       if (!res.ok) {
//         if (res.status === 401 || res.status === 403) {
//           localStorage.removeItem("access_token");
//           navigate("/login");
//           return;
//         }
//         throw new Error(`Erreur ${res.status}`);
//       }

//       const data = await res.json();
//       setMessages((prev) => [...prev, data.user_message, data.bot_message]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Erreur lors de l'envoi du message:", err);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const handleDeleteMessage = async (id) => {
//     if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
//     try {
//       const res = await fetch(`http://localhost:8000/messages/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (res.ok) {
//         setMessages((prev) => prev.filter((msg) => msg.id !== id));
//       } else {
//         console.error("Erreur suppression message");
//       }
//     } catch (err) {
//       console.error("Erreur suppression message:", err);
//     }
//   };

//   const handleDeleteConversation = async () => {
//     if (!window.confirm("Supprimer toute la conversation ?")) return;
//     try {
//       console.log("Tentative de suppression pour chatbot:", chatbotId);
//       console.log("Utilisateur:", user);
//       console.log("Chatbot data:", chatbot);
      
//       const res = await fetch(`http://localhost:8000/chatbots/${chatbotId}/messages`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       console.log("Réponse suppression:", res.status);
      
//       if (res.ok) {
//         setMessages([]);
//         console.log("Conversation supprimée avec succès");
//       } else {
//         const errorText = await res.text();
//         console.error("Erreur suppression conversation:", res.status, errorText);
//         alert(`Erreur lors de la suppression: ${res.status} - ${errorText}`);
//       }
//     } catch (err) {
//       console.error("Erreur suppression conversation:", err);
//       alert("Erreur lors de la suppression de la conversation");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-center text-indigo-600 text-lg">Chargement du chatbot...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative flex flex-col h-screen bg-gray-100 p-4 overflow-hidden">
//       {/* Navbar */}
//       <div className="flex items-center justify-between px-6 py-6 mb-4 bg-white rounded-xl shadow-md z-20 max-w-5xl mx-auto w-full">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
//         >
//           <Home size={18} /> Retour
//         </button>

//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-1 text-indigo-700 font-semibold text-sm">
//             <User size={18} /> {user?.nom}
//           </div>
//           <button
//             onClick={() => {
//               if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
//                 localStorage.removeItem("access_token");
//                 navigate("/welcome");
//               }
//             }}
//             className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
//           >
//             <LogOut size={18} /> Déconnexion
//           </button>
//         </div>
//       </div>

//       {/* Background icons */}
//       <Bot className="absolute top-10 left-5 text-indigo-300 opacity-30 w-32 h-32 animate-spin-slow" />
//       <Cpu className="absolute bottom-32 right-1/4 text-blue-400 opacity-30 w-24 h-24" />
//       <Code2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-200 opacity-10 w-72 h-72" />
//       <Server className="absolute top-20 right-10 text-purple-300 opacity-20 w-28 h-28 animate-pulse" />

//       <style>{`
//         .animate-spin-slow {
//           animation: spin 12s linear infinite;
//         }
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>

//       <div className="text-xl font-semibold mb-2 text-center text-indigo-700 z-10">
//         {chatbotName || "Mon Chatbot Personnalisé"}
//       </div>

//       {/* Delete conversation */}
//       <div className="text-right mb-3 z-10">
//         <button
//           onClick={handleDeleteConversation}
//           className="bg-red-100 text-red-600 text-xs px-4 py-2 rounded-full hover:bg-red-200"
//         >
//           <Trash2 size={14} className="inline mr-1" /> Supprimer la conversation
//         </button>
//       </div>

//       {/* Messages */}
//       <div
//         ref={chatWindowRef}
//         className="flex-1 overflow-y-auto p-4 space-y-4 z-10"
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.2)",
//           backdropFilter: "blur(12px)",
//           borderRadius: "24px",
//           border: "1px solid rgba(255, 255, 255, 0.3)",
//           boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
//         }}
//       >
//         {messages.length === 0 && (
//           <p className="text-center text-gray-500 mt-10">Aucun message pour l'instant.</p>
//         )}

//         {messages.map((msg, index) => {
//           // Correction de la logique pour identifier les messages utilisateur
//           // Assumons que les messages utilisateur ont un champ différent
//           // Vous devrez adapter cette logique selon votre structure de données
//           const isUser = msg.user_id === user?.id || msg.role === 'user' || msg.sender === 'user';
//           const date = new Date(msg.dateCreation).toLocaleString();

//           return (
//             <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
//               <div
//                 className={`relative px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
//                   isUser ? "bg-purple-100 text-right" : "bg-gray-200 text-left"
//                 }`}
//                 style={{ maxWidth: "70%" }}
//               >
//                 <ReactMarkdown>{msg.contenu}</ReactMarkdown>
//                 <div className="text-[10px] mt-1 text-gray-500">{date}</div>
//                 {isUser && (
//                   <button
//                     onClick={() => handleDeleteMessage(msg.id)}
//                     className="absolute top-0 right-0 text-gray-400 text-xs p-1 hover:text-red-500"
//                     title="Supprimer"
//                   >
//                     <Trash2 size={12} />
//                   </button>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Zone de saisie */}
//       <div className="mt-4 flex justify-center items-center gap-2 z-10">
//         <textarea
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Posez votre question ici..."
//           className="w-full max-w-2xl p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 resize-none"
//           rows={2}
//         />
//         <button
//           onClick={sendMessage}
//           className="bg-indigo-500 text-white px-4 rounded-r-lg hover:bg-indigo-600"
//         >
//           Envoyer
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CustomChat;









import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bot, Code2, Server, Cpu, Trash2, User, LogOut, Home } from "lucide-react";
import ReactMarkdown from "react-markdown";

const CustomChat = () => {
  const { chatbotId } = useParams();
  const token = localStorage.getItem("access_token");
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatbotName, setChatbotName] = useState("");

  const chatWindowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAll = async () => {
      try {

        const userRes = await fetch("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) {
          if (userRes.status === 401 || userRes.status === 403) {
            localStorage.removeItem("access_token");
            navigate("/login");
            return;
          }
          throw new Error(`Erreur ${userRes.status}`);
        }
        const userData = await userRes.json();
        setUser(userData);
    
        const chatbotUrl =
          userData.role === "ADMIN"
            ? `http://localhost:8000/admin/chatbots/${chatbotId}`
            : `http://localhost:8000/chatbots/${chatbotId}`;
    
        const chatbotRes = await fetch(chatbotUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!chatbotRes.ok) {
          if (chatbotRes.status === 401 || chatbotRes.status === 403) {
            localStorage.removeItem("access_token");
            navigate("/login");
            return;
          }
          throw new Error(`Erreur ${chatbotRes.status}`);
        }
        const chatbotData = await chatbotRes.json();
        setChatbotName(chatbotData.nom);
    

        const res = await fetch(
          `http://localhost:8000/chatbots/${chatbotId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("access_token");
            navigate("/login");
            return;
          }
          throw new Error(`Erreur ${res.status}`);
        }
        const data = await res.json();
        setMessages(data);
    
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement:", err);
        setLoading(false);
      }
    };
    

    fetchAll();
  }, [chatbotId, token, navigate]);

  useEffect(() => {
    chatWindowRef.current?.scrollTo({
      top: chatWindowRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch(`http://localhost:8000/chatbots/${chatbotId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contenu: newMessage }),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          navigate("/login");
          return;
        }
        throw new Error(`Erreur ${res.status}`);
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.user_message, data.bot_message]);
      setNewMessage("");
    } catch (err) {
      console.error("Erreur lors de l’envoi du message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    try {
      const res = await fetch(`http://localhost:8000/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      } else {
        console.error("Erreur suppression message");
      }
    } catch (err) {
      console.error("Erreur suppression message:", err);
    }
  };

  const handleDeleteConversation = async () => {
    if (!window.confirm("Supprimer toute la conversation ?")) return;
    try {
      const res = await fetch(`http://localhost:8000/chatbots/${chatbotId}/messages`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessages([]);
      } else {
        console.error("Erreur suppression conversation");
      }
    } catch (err) {
      console.error("Erreur suppression conversation:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-indigo-600 text-lg">Chargement du chatbot...</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-gray-100 p-4 overflow-hidden">
      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-6 mb-4 bg-white rounded-xl shadow-md z-20 max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
        >
          <Home size={18} /> Retour
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-indigo-700 font-semibold text-sm">
            <User size={18} /> {user?.nom}
          </div>
          <button
            onClick={() => {
              if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
                localStorage.removeItem("access_token");
                navigate("/welcome");
              }
            }}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Background icons */}
      <Bot className="absolute top-10 left-5 text-indigo-300 opacity-30 w-32 h-32 animate-spin-slow" />
      <Cpu className="absolute bottom-32 right-1/4 text-blue-400 opacity-30 w-24 h-24" />
      <Code2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-200 opacity-10 w-72 h-72" />
      <Server className="absolute top-20 right-10 text-purple-300 opacity-20 w-28 h-28 animate-pulse" />

      <style>{`
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="text-xl font-semibold mb-2 text-center text-indigo-700 z-10">
        {chatbotName || "Mon Chatbot Personnalisé"}
      </div>

      {/* Delete conversation */}
      <div className="text-right mb-3 z-10">
        <button
          onClick={handleDeleteConversation}
          className="bg-red-100 text-red-600 text-xs px-4 py-2 rounded-full hover:bg-red-200"
        >
          <Trash2 size={14} className="inline mr-1" /> Supprimer la conversation
        </button>
      </div>

      {/* Messages */}
      <div
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 z-10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(12px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        }}
      >
        {messages.length === 0 && (
          <p className="text-center text-gray-500 mt-10">Aucun message pour l’instant.</p>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.is_public;
          const date = new Date(msg.dateCreation).toLocaleString();

          return (
            <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`relative px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words ${
                  isUser ? "bg-purple-100 text-right" : "bg-gray-200 text-left"
                }`}
                style={{ maxWidth: "70%" }}
              >
                <ReactMarkdown>{msg.contenu}</ReactMarkdown>
                <div className="text-[10px] mt-1 text-gray-500">{date}</div>
                {isUser && (
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    className="absolute top-0 right-0 text-gray-400 text-xs p-1 hover:text-red-500"
                    title="Supprimer"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone de saisie */}
      <div className="mt-4 flex justify-center items-center gap-2 z-10">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question ici..."
          className="w-full max-w-2xl p-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 resize-none"
          rows={2}
        />
        <button
          onClick={sendMessage}
          className="bg-indigo-500 text-white px-4 rounded-r-lg hover:bg-indigo-600"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default CustomChat;






