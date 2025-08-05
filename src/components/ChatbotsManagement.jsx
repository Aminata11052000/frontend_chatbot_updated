
import React, { useEffect, useState, useCallback } from "react";
import { FilePlus, CheckCircle, Plus, MessageCircle, Trash, Bot, Upload, Settings, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatbotsManagement = () => {
    const [chatbots, setChatbots] = useState([]);
    const [files, setFiles] = useState([]);
    const [chatbotName, setChatbotName] = useState("");
    const [chatbotContext, setChatbotContext] = useState("");
    const [customPrompt, setCustomPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(0);
    const [chatbotId, setChatbotId] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("access_token");

    const fetchChatbots = useCallback(async () => {
        try {
            const res = await fetch("http://localhost:8000/admin/chatbots/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setChatbots(data);
        } catch (err) {
            console.error("Erreur chargement chatbots:", err);
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchChatbots();
    }, [fetchChatbots]);

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
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ nom: "temp", is_public: false }),
            });

            if (!resCreate.ok) throw new Error("Erreur lors de la création du chatbot.");

            const chatbotData = await resCreate.json();
            setChatbotId(chatbotData.id);

            const formData = new FormData();
            files.forEach((f) => formData.append("files", f));

            const resUpload = await fetch(
                `http://localhost:8000/chatbots/${chatbotData.id}/upload_docs/`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                }
            );

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
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ nom: chatbotName, contexte: chatbotContext }),
            });

            if (!res.ok) throw new Error("Erreur mise à jour chatbot.");

            const resPrompt = await fetch(
                `http://localhost:8000/chatbots/${chatbotId}/save_prompt`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ prompt: customPrompt }),
                }
            );

            if (!resPrompt.ok) {
                const errData = await resPrompt.json();
                throw new Error(errData.detail || "Erreur sauvegarde prompt.");
            }

            setStep(3);
            fetchChatbots();
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (chatbot) => {
        setIsEditing(true);
        setShowCreate(true);
        setStep(2);
        setChatbotId(chatbot.id);
        setChatbotName(chatbot.nom);
        setChatbotContext("");
        setCustomPrompt("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Confirmer la suppression ?")) return;
        try {
            const res = await fetch(`http://localhost:8000/admin/chatbots/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) fetchChatbots();
        } catch (err) {
            console.error("Erreur suppression chatbot:", err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Gestion des Chatbots
                        </h1>
                    </div>
                    <p className="text-gray-600 ml-11">
                        Créez et gérez vos assistants IA personnalisés
                    </p>
                </div>

                {/* Action Button */}
                {!showCreate && (
                    <div className="mb-6">
                        <button
                            onClick={() => {
                                setShowCreate(true);
                                setIsEditing(false);
                                setStep(1);
                                setChatbotId(null);
                                setChatbotName("");
                                setChatbotContext("");
                                setCustomPrompt("");
                                setFiles([]);
                                setError("");
                            }}
                            className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Créer un nouveau chatbot
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
                        </button>
                    </div>
                )}

                {/* Creation/Edit Form */}
                {showCreate && (
                    <div className="mb-8">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mb-4">
                                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {step === 1 ? "Indexation en cours..." : "Mise à jour en cours..."}
                                    </h3>
                                    <p className="text-gray-600">
                                        {step === 1 ? "Veuillez patienter pendant l'indexation de vos documents" : "Veuillez patienter pendant la mise à jour"}
                                    </p>
                                </div>
                            ) : step === 1 ? (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                            <Upload className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Étape 1 : Importer les documents</h2>
                                            <p className="text-gray-600">Sélectionnez les fichiers à indexer pour votre chatbot</p>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                            <p className="text-red-800 font-medium">{error}</p>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Fichiers à indexer
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFilesChange}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                />
                                                <FilePlus className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                                            </div>
                                            {files.length > 0 && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    {files.length} fichier(s) sélectionné(s)
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={uploadFiles}
                                                disabled={files.length === 0}
                                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                                            >
                                                <Upload className="w-5 h-5" />
                                                Télécharger et indexer
                                            </button>
                                            <button
                                                onClick={() => setShowCreate(false)}
                                                className="px-8 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-medium"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : step === 2 ? (
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
                                            <Settings className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Étape 2 : Configurer votre chatbot</h2>
                                            <p className="text-gray-600">Personnalisez le comportement de votre assistant IA</p>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                            <p className="text-red-800 font-medium">{error}</p>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nom du chatbot
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ex: Assistant Juridique"
                                                value={chatbotName}
                                                onChange={(e) => setChatbotName(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contexte du chatbot
                                            </label>
                                            <textarea
                                                placeholder="Décrivez le contexte d'utilisation de votre chatbot..."
                                                value={chatbotContext}
                                                onChange={(e) => setChatbotContext(e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Prompt personnalisé
                                            </label>
                                            <textarea
                                                placeholder="Ex: Tu es un expert en droit sénégalais. Réponds toujours en français et cite tes sources..."
                                                value={customPrompt}
                                                onChange={(e) => setCustomPrompt(e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                            />
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                onClick={finalizeChatbot}
                                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                {isEditing ? "Mettre à jour le chatbot" : "Créer mon chatbot"}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowCreate(false);
                                                    setStep(0);
                                                    setError("");
                                                }}
                                                className="px-8 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 font-medium"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : step === 3 ? (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        {isEditing ? "Chatbot mis à jour avec succès !" : "Chatbot créé avec succès !"}
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        {isEditing ? "Votre chatbot a été mis à jour et est prêt à être utilisé." : "Votre nouveau chatbot a été créé et est prêt à être utilisé."}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setShowCreate(false);
                                            setStep(0);
                                            setError("");
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        Retour à la liste
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* Chatbots List */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-200/50">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            Liste des chatbots ({chatbots.length})
                        </h3>
                    </div>

                    {chatbots.length === 0 ? (
                        <div className="text-center py-16">
                            <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun chatbot créé</h3>
                            <p className="text-gray-600">Créez votre premier chatbot pour commencer</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Chatbot
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Visibilité
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date de création
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/50">
                                    {chatbots.map((chatbot) => (
                                        <tr key={chatbot.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                                                        <Bot className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-800">{chatbot.nom}</div>
                                                        <div className="text-sm text-gray-500">ID: {chatbot.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(chatbot.indexing_status)}`}>
                                                    {chatbot.indexing_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {chatbot.is_public ? (
                                                        <>
                                                            <Eye className="w-4 h-4 text-green-500" />
                                                            <span className="text-sm text-green-700 font-medium">Public</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="w-4 h-4 text-gray-400" />
                                                            <span className="text-sm text-gray-600">Privé</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(chatbot.dateCreation).toLocaleDateString('fr-FR', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {/* <button
                                                        onClick={() => handleEdit(chatbot)}
                                                        className="group relative p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            Modifier
                                                        </span>
                                                    </button> */}
                                                    <button
                                                        onClick={() => navigate(`/custom-chatbot/${chatbot.id}`)}
                                                        className="group relative p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                                                        title="Interagir"
                                                    >
                                                        <MessageCircle className="w-5 h-5" />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            Interagir
                                                        </span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(chatbot.id)}
                                                        className="group relative p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                        title="Supprimer"
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            Supprimer
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatbotsManagement;