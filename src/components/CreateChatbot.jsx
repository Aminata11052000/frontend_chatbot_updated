

// import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import { FilePlus, LayoutTemplate, CheckCircle } from 'lucide-react';

// const CreateChatbot = () => {
//   const [files, setFiles] = useState([]);
//   const [chatbotName, setChatbotName] = useState("");
//   const [chatbotContext, setChatbotContext] = useState("");
//   const [customPrompt, setCustomPrompt] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [step, setStep] = useState(1);
//   const [chatbotId, setChatbotId] = useState(null);
//   const [user, setUser] = useState(null);

//   const token = localStorage.getItem("access_token");

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!token) return;
//       try {
//         const res = await fetch("http://localhost:8000/me", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.ok) {
//           const data = await res.json();
//           setUser(data);
//         }
//       } catch (e) {
//         console.error("Erreur récupération utilisateur:", e);
//       }
//     };
//     fetchUser();
//   }, [token]);

//   const handleFilesChange = (e) => {
//     setFiles(Array.from(e.target.files));
//   };

//   const uploadFiles = async () => {
//     if (files.length === 0) {
//       setError("Veuillez sélectionner au moins un fichier.");
//       return;
//     }
//     setError("");
//     setLoading(true);

//     try {
//       const resCreate = await fetch("http://localhost:8000/chatbots/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ nom: "temp", is_public: false }),
//       });

//       if (!resCreate.ok) throw new Error("Erreur lors de la création du chatbot.");

//       const chatbotData = await resCreate.json();
//       setChatbotId(chatbotData.id);

//       const formData = new FormData();
//       files.forEach((f) => formData.append("files", f));

//       const resUpload = await fetch(`http://localhost:8000/chatbots/${chatbotData.id}/upload_docs/`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!resUpload.ok) {
//         const errData = await resUpload.json();
//         throw new Error(errData.detail || "Erreur lors de l'indexation des documents");
//       }

//       setStep(2);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const finalizeChatbot = async () => {
//     if (!chatbotName.trim() || !chatbotContext.trim() || !customPrompt.trim()) {
//       setError("Veuillez remplir tous les champs.");
//       return;
//     }
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(`http://localhost:8000/chatbots/${chatbotId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ nom: chatbotName, contexte: chatbotContext }),
//       });
//       if (!res.ok) throw new Error("Erreur lors de la mise à jour du chatbot.");

//       const resPrompt = await fetch(
//         `http://localhost:8000/chatbots/${chatbotId}/save_prompt`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ prompt: customPrompt }),
//         }
//       );
//       if (!resPrompt.ok) {
//         const errData = await resPrompt.json();
//         throw new Error(errData.detail || "Erreur lors de la sauvegarde du prompt.");
//       }

//       setStep(3);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar user={user} />

//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20 px-4">
//         <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/30">
//           {loading ? (
//             <div className="text-center animate-pulse">
//               <p className="text-indigo-700 text-lg mb-4">Indexation en cours, veuillez patienter...</p>
//               <div className="loader mx-auto"></div>
//             </div>
//           ) : step === 1 ? (
//             <div>
//               <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-2 mb-4">
//                 <FilePlus /> Étape 1 : Importer les documents
//               </h2>
//               {error && <p className="text-red-600 mb-4">{error}</p>}
//               <input
//                 type="file"
//                 multiple
//                 onChange={handleFilesChange}
//                 className="block w-full border border-gray-300 p-3 rounded-xl mb-4"
//               />
//               <button
//                 onClick={uploadFiles}
//                 disabled={files.length === 0}
//                 className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-medium"
//               >
//                 Télécharger et indexer
//               </button>
//             </div>
//           ) : step === 2 ? (
//             <div>
//               <h2 className="text-3xl font-bold text-indigo-800 flex items-center gap-2 mb-4">
//                 <LayoutTemplate /> Étape 2 : Configurer votre chatbot
//               </h2>
//               {error && <p className="text-red-600 mb-4">{error}</p>}
//               <input
//                 type="text"
//                 placeholder="Nom du chatbot"
//                 value={chatbotName}
//                 onChange={(e) => setChatbotName(e.target.value)}
//                 className="w-full border p-3 rounded-xl mb-4"
//               />
//               <textarea
//                 placeholder="Contexte du chatbot"
//                 value={chatbotContext}
//                 onChange={(e) => setChatbotContext(e.target.value)}
//                 rows={3}
//                 className="w-full border p-3 rounded-xl mb-4"
//               />
//               <textarea
//                 placeholder="Prompt personnalisé (ex : Tu es un expert en droit sénégalais...)"
//                 value={customPrompt}
//                 onChange={(e) => setCustomPrompt(e.target.value)}
//                 rows={4}
//                 className="w-full border p-3 rounded-xl mb-4"
//               />
//               <button
//                 onClick={finalizeChatbot}
//                 className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium"
//               >
//                 Créer mon chatbot
//               </button>
//             </div>
//           ) : (
//             <div className="text-center">
//               <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
//               <h2 className="text-2xl font-bold text-green-700 mb-2">
//                 Votre chatbot a été créé avec succès !
//               </h2>
//               <button
//                 className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition font-medium"
//                 onClick={() => (window.location.href = "/my-chatbots")}
//               >
//                 Voir mes chatbots
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CreateChatbot;


import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FilePlus, CheckCircle, Upload, Bot, Wand2, FileText, Settings, Sparkles, ArrowRight } from 'lucide-react';

const CreateChatbot = () => {
  const [files, setFiles] = useState([]);
  const [chatbotName, setChatbotName] = useState("");
  const [chatbotContext, setChatbotContext] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [chatbotId, setChatbotId] = useState(null);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        console.error("Erreur récupération utilisateur:", e);
      }
    };
    fetchUser();
  }, [token]);

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      setError("Veuillez sélectionner au moins un fichier.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const resCreate = await fetch("http://localhost:8000/chatbots/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom: "temp", is_public: false }),
      });

      if (!resCreate.ok) throw new Error("Erreur lors de la création du chatbot.");

      const chatbotData = await resCreate.json();
      setChatbotId(chatbotData.id);

      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));

      const resUpload = await fetch(`http://localhost:8000/chatbots/${chatbotData.id}/upload_docs/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!resUpload.ok) {
        const errData = await resUpload.json();
        throw new Error(errData.detail || "Erreur lors de l'indexation des documents");
      }

      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const finalizeChatbot = async () => {
    if (!chatbotName.trim() || !chatbotContext.trim() || !customPrompt.trim()) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/chatbots/${chatbotId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nom: chatbotName, contexte: chatbotContext }),
      });
      if (!res.ok) throw new Error("Erreur lors de la mise à jour du chatbot.");
      const wrappedPrompt = `Voici le contexte : {context}\n\nQuestion : {question}\n\n${customPrompt}`;


      const resPrompt = await fetch(
        `http://localhost:8000/chatbots/${chatbotId}/save_prompt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt: wrappedPrompt }),
        }
      );
      if (!resPrompt.ok) {
        const errData = await resPrompt.json();
        throw new Error(errData.detail || "Erreur lors de la sauvegarde du prompt.");
      }

      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar user={user} />

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">


        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-ping"></div>
          <Bot className="absolute top-32 right-1/4 text-indigo-200 opacity-10 w-28 h-28 animate-spin-slow" />
          <Sparkles className="absolute bottom-32 left-1/3 text-purple-200 opacity-10 w-20 h-20 animate-pulse" />
        </div>

        <div className="relative z-10 py-20 px-4">


          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-8">
                <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'}`}>
                    {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
                  </div>
                  <span className="font-medium">Documents</span>
                </div>

                <ArrowRight className={`w-5 h-5 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`} />

                <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300'}`}>
                    {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
                  </div>
                  <span className="font-medium">Configuration</span>
                </div>

                <ArrowRight className={`w-5 h-5 ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`} />

                <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300'}`}>
                    {step >= 3 ? <CheckCircle className="w-5 h-5" /> : '3'}
                  </div>
                  <span className="font-medium">Finalisation</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-12">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <Bot className="w-10 h-10 text-white animate-spin" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Indexation en cours</h3>
                  <p className="text-gray-600 mb-6">Votre chatbot analyse les documents...</p>
                  <div className="flex justify-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : step === 1 ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FilePlus className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Importer vos documents</h2>
                  <p className="text-gray-600">Téléchargez les fichiers qui alimenteront votre chatbot</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="relative">
                    <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors">
                      <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Sélectionnez vos fichiers</h3>
                      <p className="text-gray-500 mb-4">Formats supportés: PDF, DOCX, JSON</p>
                      <input
                        type="file"
                        multiple
                        onChange={handleFilesChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <button className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-medium hover:bg-indigo-200 transition-colors">
                        Parcourir les fichiers
                      </button>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="bg-indigo-50 rounded-xl p-6">
                      <h4 className="font-semibold text-indigo-800 mb-3">Fichiers sélectionnés :</h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                            <FileText className="w-5 h-5 text-indigo-600" />
                            <span className="text-gray-700">{file.name}</span>
                            <span className="text-sm text-gray-500 ml-auto">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      onClick={uploadFiles}
                      disabled={files.length === 0}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Upload className="w-5 h-5" />
                      Télécharger et indexer
                    </button>
                  </div>
                </div>
              </div>
            ) : step === 2 ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Configurer votre chatbot</h2>
                  <p className="text-gray-600">Personnalisez le comportement et la personnalité de votre assistant</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Nom du chatbot
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Assistant Juridique Sénégalais"
                      value={chatbotName}
                      onChange={(e) => setChatbotName(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Contexte du chatbot
                    </label>
                    <textarea
                      placeholder="Décrivez le domaine d'expertise et l'objectif de votre chatbot..."
                      value={chatbotContext}
                      onChange={(e) => setChatbotContext(e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Prompt personnalisé
                    </label>
                    <textarea
                      placeholder="Tu es un expert en droit sénégalais. Tu réponds de manière précise et professionnelle aux questions juridiques en te basant sur les documents fournis..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={finalizeChatbot}
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Wand2 className="w-5 h-5" />
                      Créer mon chatbot
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                    <Sparkles className="absolute -bottom-2 -left-2 w-8 h-8 text-yellow-400 animate-pulse" />
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Félicitations !
                  </h2>
                  <p className="text-gray-600 text-lg mb-2">
                    Votre chatbot a été créé avec succès !
                  </p>
                  <p className="text-gray-500 mb-8">
                    Il est maintenant prêt à répondre à vos questions
                  </p>


                  <button
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl mx-auto"
                    onClick={() => (window.location.href = "/my-chatbots")}
                  >
                    <Bot className="w-5 h-5" />
                    Voir mes chatbots
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default CreateChatbot;