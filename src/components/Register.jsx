

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, HeartPulse, Stethoscope, Pill, Syringe } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [isPatient, setIsPatient] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        password: '',
        role: 'USER',
        code_patient: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateInputs = () => {
        const newErrors = {};

        if (!/^[A-Za-zÀ-ÿ\s]+$/.test(formData.nom)) {
            newErrors.nom = "Le nom ne doit contenir que des lettres et des espaces.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "L'adresse email n'est pas valide.";
        }

        if (formData.password.length < 5) {
            newErrors.password = "Le mot de passe doit contenir au moins 5 caractères.";
        }

        if (isPatient && !/^[A-Za-z0-9\s]+$/.test(formData.code_patient)) {
            newErrors.code_patient = "Le code patient ne doit contenir que des lettres, chiffres et espaces.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        const endpoint = isPatient
            ? 'http://localhost:8000/register_user'
            : formData.role === 'ADMIN'
                ? 'http://localhost:8000/register_admin'
                : 'http://localhost:8000/register';

        const payload = {
            nom: formData.nom,
            email: formData.email,
            password: formData.password,
        };

        if (isPatient) payload.code_patient = formData.code_patient;

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                navigate('/login');
            } else {
                const data = await res.json();
                alert('Erreur : ' + data.detail);
            }
        } catch (error) {
            console.error(error);
            alert("Erreur de connexion au serveur.");
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4 overflow-hidden">

            <Bot className="absolute top-10 left-5 text-indigo-500 opacity-40 w-32 h-32 animate-spin-slow" />
            <HeartPulse className="absolute top-32 left-1/3 text-red-500 opacity-40 w-28 h-28 animate-ping" />
            <Stethoscope className="absolute bottom-32 left-1/4 text-blue-500 opacity-40 w-24 h-24" />
            <Pill className="absolute top-20 right-1/4 text-pink-500 opacity-40 w-20 h-20" />
            <Syringe className="absolute bottom-10 right-1/5 text-green-500 opacity-40 w-24 h-24" />
            <Bot className="absolute top-10 left-5 text-indigo-200 opacity-20 w-32 h-32 animate-spin-slow" />
            <Bot className="absolute bottom-20 right-10 text-purple-300 opacity-20 w-40 h-40 animate-pulse" />
            <Bot className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-100 opacity-10 w-72 h-72" />
            <HeartPulse className="absolute top-32 left-1/3 text-red-300 opacity-20 w-28 h-28 animate-ping" />
            <Stethoscope className="absolute bottom-32 left-1/4 text-blue-200 opacity-20 w-24 h-24" />
            <Pill className="absolute top-20 right-1/4 text-pink-300 opacity-20 w-20 h-20" />
            <Syringe className="absolute bottom-10 right-1/5 text-green-300 opacity-20 w-24 h-24" />

            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full border-t-4 border-indigo-600 z-10">
                <h2 className="text-2xl font-bold text-indigo-600 text-center mb-4">Créer un compte</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nom complet</label>
                        <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                        {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                        {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium">Type d'utilisateur :</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="border rounded-md p-2"
                            disabled={isPatient}
                        >
                            <option value="USER">Utilisateur</option>
                            {/*  <option value="ADMIN">Administrateur</option> */}
                           
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPatient"
                            checked={isPatient}
                            onChange={() => setIsPatient(!isPatient)}
                            className="accent-indigo-600"
                        />
                        <label htmlFor="isPatient" className="text-sm">Je suis un(e) patient(e)</label>
                    </div>

                    {isPatient && (
                        <div>
                            <label className="block text-sm font-medium">Code patient</label>
                            <input
                                type="text"
                                name="code_patient"
                                value={formData.code_patient}
                                onChange={handleChange}
                                required
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                            {errors.code_patient && <p className="text-red-600 text-sm mt-1">{errors.code_patient}</p>}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        S'inscrire
                    </button>
                </form>

                <p className="text-sm mt-4 text-center">
                    Vous avez déjà un compte ?{" "}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
