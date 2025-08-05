import React, { useEffect, useState } from 'react';
import {
    User, Users, Database, BarChart2, LogOut, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GraphsSection from './GraphsSection';
import UsersManagement from './UsersManagement';
import PatientsManagement from './PatientsManagement';
import ChatbotsManagement from './ChatbotsManagement';
import Chatbot from './Chatbot';
import Home from './Home';


const AdminPage = () => {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const [stats, setStats] = useState(null);
    const [activeMenu, setActiveMenu] = useState('dashboard');

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) return navigate('/login');

            try {
                const res = await fetch('http://localhost:8000/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Non autorisé');
                const data = await res.json();
                if (data.role !== 'ADMIN') {
                    navigate('/home');
                    return;
                }
                setAdminName(data.nom);
            } catch (error) {
                console.error(error);
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem("access_token");
            try {
                const res = await fetch("http://localhost:8000/admin/dashboard/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Échec de récupération des statistiques");
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Erreur stats:", error);
            }
        };

        fetchStats();
    }, []);

    const handleLogout = () => {
        if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
            localStorage.removeItem('access_token');
            navigate('/welcome');
        }
    };

    const renderContent = () => {
        switch (activeMenu) {
            case 'chatbot_mcv':
                return <Chatbot />;
            case 'home':
                return <Home />;
            case 'users':
                return <UsersManagement />;
            case 'patients':
                return <PatientsManagement />;
            case 'chatbots':
                return <ChatbotsManagement />;
            case 'dashboard':
            default:
                return (
                    <>
                        <Dashboard stats={stats} />
                        <div className="mt-8">
                            <GraphsSection />
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="flex h-screen bg-indigo-50">

            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 font-bold text-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    ADMINISTRATEUR
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                {/* <MenuItem
                        icon={<HomeIcon />}
                        label="Home"
                        active={activeMenu === 'home'}
                        onClick={() => setActiveMenu('home')}
                    /> */}
                    <MenuItem
                        icon={<BarChart2 />}
                        label="Dashboard"
                        active={activeMenu === 'dashboard'}
                        onClick={() => setActiveMenu('dashboard')}
                    />
                    <MenuItem
                        icon={<Users />}
                        label="Utilisateurs"
                        active={activeMenu === 'users'}
                        onClick={() => setActiveMenu('users')}
                    />
                    <MenuItem
                        icon={<User />}
                        label="Patients"
                        active={activeMenu === 'patients'}
                        onClick={() => setActiveMenu('patients')}
                    />
                    <MenuItem
                        icon={<Database />}
                        label="Chatbots"
                        active={activeMenu === 'chatbots'}
                        onClick={() => setActiveMenu('chatbots')}
                    />
                    <MenuItem
                        icon={<Heart />}
                        label="Chatbot MODCARV"
                        active={activeMenu === 'chatbot_mcv'}
                        onClick={() => setActiveMenu('chatbot_mcv')}
                    />
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition"
                    >
                        <LogOut size={18} /> Déconnexion
                    </button>
                </div>
            </aside>


            <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-8 shadow-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3 bg-indigo-100 px-4 py-2 rounded-full text-indigo-700 font-semibold select-none">
                        Bonjour, {adminName || 'Admin'}
                    </div>
                </header>


                <main className="flex-1 overflow-y-auto p-8 bg-indigo-50">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

const MenuItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium
      transition
      ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-700 hover:bg-indigo-100'}`}
    >
        {React.cloneElement(icon, { size: 20 })}
        {label}
    </button>
);

const Dashboard = ({ stats }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-indigo-700">Tableau de bord</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total utilisateurs" value={stats?.total_users || 0} color="from-indigo-300 to-purple-600" />
                <StatCard title="Total chatbots" value={stats?.total_chatbots || 0} color="from-purple-500 to-purple-600" />
                <StatCard title="Interactions totales" value={stats?.total_messages || 0} color="from-indigo-300 to-violet-600" />
                {/* <StatCard title="Chatbots créés 7j" value={stats?.chatbots_last_7_days || 0} color="from-purple-200 to-purple-400" /> */}
                {/* <StatCard title="Interactions 7j" value={stats?.interactions_last_7_days || 0} color="from-violet-200 to-indigo-300" /> */}

            </div>
            {/* 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <StatCard title="Total chatbots" value={stats?.total_chatbots || 0} color="from-purple-100 to-purple-300" />
                <StatCard title="Interactions totales" value={stats?.total_messages || 0} color="from-indigo-100 to-violet-300" />
            </div> */}
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className={`bg-gradient-to-br ${color} text-white rounded-xl shadow-lg p-6`}>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

export default AdminPage;
