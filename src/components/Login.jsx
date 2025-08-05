


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, HeartPulse, Stethoscope, Pill, Syringe } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    // Validation simple regex email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setEmailError('');
    setPasswordError('');

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Veuillez entrer un email valide.");
      valid = false;
    }

    if (password.length < 5) {
      setPasswordError("Le mot de passe doit contenir au moins 5 caractères.");
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password }),
      });

      if (!response.ok) throw new Error('Échec de la connexion');
      const data = await response.json();

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_role', data.role);
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setErrorMsg("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-4 overflow-hidden">
      {/* Décorations */}
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
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Se connecter</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Connexion
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline">
            S'inscrire ici
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
