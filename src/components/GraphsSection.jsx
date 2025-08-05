

// import React, { useEffect, useState } from 'react';
// import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
// import { Download } from 'lucide-react';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';

// const GraphsSection = () => {
//   const [chatbotData, setChatbotData] = useState([]);
//   const [messageData, setMessageData] = useState([]);
//   const [uniqueSessionsData, setUniqueSessionsData] = useState([]);
//   const [sessionData, setSessionData] = useState([]);
//   const [range, setRange] = useState(30);
//   const [messagesPerChatbot, setMessagesPerChatbot] = useState([]);
//   const [chatbotsPerUser, setChatbotsPerUser] = useState([]);

//   const token = localStorage.getItem('access_token');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [
//           chatRes,
//           msgRes,
//           uniqueSessionsRes,
//           sessionRes,
//           messagesPerChatbotRes,
//           chatbotsPerUserRes,
//         ] = await Promise.all([
//           fetch('http://localhost:8000/admin/dashboard/chatbots-by-date', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch('http://localhost:8000/admin/dashboard/messages-by-date', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch('http://localhost:8000/admin/dashboard/unique-sessions-by-date', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch('http://localhost:8000/admin/dashboard/sessions-by-date', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch('http://localhost:8000/admin/dashboard/messages-per-chatbot', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch('http://localhost:8000/admin/dashboard/chatbots-by-user', {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         const messagesPerChatbotJson = await messagesPerChatbotRes.json();
//         const chatbotsPerUserJson = await chatbotsPerUserRes.json();

//         setMessagesPerChatbot(messagesPerChatbotJson);
//         setChatbotsPerUser(chatbotsPerUserJson);

//         const chatJson = await chatRes.json();
//         const msgJson = await msgRes.json();
//         const uniqueSessionsJson = await uniqueSessionsRes.json();
//         const sessionJson = await sessionRes.json();

//         const filterByDays = (data) => {
//           if (range === 'all') return data;
//           const cutoff = new Date();
//           cutoff.setDate(cutoff.getDate() - range);
//           return data.filter((item) => new Date(item.date) >= cutoff);
//         };

//         setChatbotData(filterByDays(chatJson));
//         setMessageData(filterByDays(msgJson));
//         setUniqueSessionsData(filterByDays(uniqueSessionsJson));
//         setSessionData(filterByDays(sessionJson));
//       } catch (err) {
//         console.error('Erreur fetch données :', err);
//       }
//     };

//     fetchData();
//   }, [range, token]);

//   const exportToExcel = () => {
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(chatbotData), 'Chatbots');
//     XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(messageData), 'Messages');
//     XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(uniqueSessionsData), 'Utilisateurs Actifs');
//     XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sessionData), 'Sessions Totales');
//     XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(messagesPerChatbot), 'Messages par Chatbot');
//     XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(chatbotsPerUser), 'Chatbots par Utilisateur');

//     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'dashboard_stats.xlsx');
//   };

//   const rangeOptions = [7, 14, 30, 'all'];

//   const chartConfigs = [
//     { title: 'Chatbots créés', data: chatbotData, gradientId: 'color1', color: '#9b59b6', unit: 'chatbots' },
//     { title: 'Messages échangés', data: messageData, gradientId: 'color2', color: '#a569bd', unit: 'messages' },
//     { title: 'Utilisateurs actifs', data: uniqueSessionsData, gradientId: 'color3', color: '#bb8fce', unit: 'utilisateurs' },
//     { title: 'Sessions totales', data: sessionData, gradientId: 'color4', color: '#d2b4de', unit: 'sessions' },
//   ];

//   const renderChart = ({ title, data, gradientId, color, unit }) => (
//     <div>
//       <h4 className="text-lg font-semibold text-purple-700 mb-2">{title}</h4>
//       <ResponsiveContainer width="100%" height={250}>
//         <AreaChart data={data}>
//           <defs>
//             <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
//               <stop offset="5%" stopColor={color} stopOpacity={0.8} />
//               <stop offset="95%" stopColor={color} stopOpacity={0} />
//             </linearGradient>
//           </defs>
//           <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//           <YAxis allowDecimals={false} />
//           <CartesianGrid strokeDasharray="3 3" />
//           <Tooltip
//             contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', borderColor: '#ddd' }}
//             formatter={(value) => [`${value} ${unit}`, 'Nombre']}
//             labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
//           />
//           <Area
//             type="monotone"
//             dataKey="count"
//             stroke={color}
//             fillOpacity={1}
//             fill={`url(#${gradientId})`}
//             activeDot={{ r: 6 }}
//             dot={{ stroke: color, strokeWidth: 2, r: 3 }}
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//     </div>
//   );

//   const renderBarChart = ({ title, data, color, unit }) => (
//     <div>
//       <h4 className="text-lg font-semibold text-purple-700 mb-2">{title}</h4>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
//           <XAxis type="number" allowDecimals={false} />
//           <YAxis dataKey="label" type="category" tick={{ fontSize: 12 }} width={150} />
//           <Tooltip
//             formatter={(value) => [`${value} ${unit}`, 'Nombre']}
//           />
//           <Bar dataKey="count" fill={color} />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-2xl font-bold text-indigo-700">Statistiques</h3>
//         <div className="flex items-center gap-4">
//           <select
//             value={range}
//             onChange={(e) => setRange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
//             className="border border-indigo-200 rounded px-3 py-1 text-sm"
//           >
//             {rangeOptions.map((opt) => (
//               <option key={opt} value={opt}>
//                 {opt === 'all' ? 'Tout afficher' : `Derniers ${opt} jours`}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={exportToExcel}
//             className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
//           >
//             <Download size={16} /> Exporter
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {chartConfigs.map((config) => (
//           <div key={config.title}>{renderChart(config)}</div>
//         ))}
//       </div>

//       {/* Nouveaux graphiques en barres */}
//       <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
//         {renderBarChart({
//           title: 'Messages par chatbot',
//           data: messagesPerChatbot,
//           color: '#8e44ad',
//           unit: 'messages',
//         })}
//         {renderBarChart({
//           title: 'Chatbots par utilisateur',
//           data: chatbotsPerUser,
//           color: '#5b2c6f',
//           unit: 'chatbots',
//         })}
//       </div>
//     </div>
//   );
// };

// export default GraphsSection;

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const GraphsSection = () => {
  const [chatbotData, setChatbotData] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [uniqueSessionsData, setUniqueSessionsData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [range, setRange] = useState(30);
  const [messagesPerChatbot, setMessagesPerChatbot] = useState([]);
  const [chatbotsPerUser, setChatbotsPerUser] = useState([]);

  const token = localStorage.getItem('access_token');

  // Couleurs pour le diagramme circulaire - plus contrastées
  const PIE_COLORS = ['#8e44ad', '#e74c3c', '#f39c12', '#27ae60', '#3498db', '#e67e22', '#9b59b6', '#34495e'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          chatRes,
          msgRes,
          uniqueSessionsRes,
          sessionRes,
          messagesPerChatbotRes,
          chatbotsPerUserRes,
        ] = await Promise.all([
          fetch('http://localhost:8000/admin/dashboard/chatbots-by-date', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/admin/dashboard/messages-by-date', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/admin/dashboard/unique-sessions-by-date', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/admin/dashboard/sessions-by-date', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/admin/dashboard/messages-per-chatbot', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:8000/admin/dashboard/chatbots-by-user', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const messagesPerChatbotJson = await messagesPerChatbotRes.json();
        const chatbotsPerUserJson = await chatbotsPerUserRes.json();

        setMessagesPerChatbot(messagesPerChatbotJson);
        setChatbotsPerUser(chatbotsPerUserJson);

        const chatJson = await chatRes.json();
        const msgJson = await msgRes.json();
        const uniqueSessionsJson = await uniqueSessionsRes.json();
        const sessionJson = await sessionRes.json();

        const filterByDays = (data) => {
          if (range === 'all') return data;
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - range);
          return data.filter((item) => new Date(item.date) >= cutoff);
        };

        setChatbotData(filterByDays(chatJson));
        setMessageData(filterByDays(msgJson));
        setUniqueSessionsData(filterByDays(uniqueSessionsJson));
        setSessionData(filterByDays(sessionJson));
      } catch (err) {
        console.error('Erreur fetch données :', err);
      }
    };

    fetchData();
  }, [range, token]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(chatbotData), 'Chatbots');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(messageData), 'Messages');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(uniqueSessionsData), 'Utilisateurs Actifs');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sessionData), 'Sessions Totales');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(messagesPerChatbot), 'Messages par Chatbot');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(chatbotsPerUser), 'Chatbots par Utilisateur');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'dashboard_stats.xlsx');
  };

  const rangeOptions = [7, 14, 30, 'all'];

  const chartConfigs = [
    { title: 'Chatbots créés', data: chatbotData, gradientId: 'color1', color: '#9b59b6', unit: 'chatbots' },
    { title: 'Messages échangés', data: messageData, gradientId: 'color2', color: '#a569bd', unit: 'messages' },
    { title: 'Utilisateurs actifs', data: uniqueSessionsData, gradientId: 'color3', color: '#bb8fce', unit: 'utilisateurs' },
    { title: 'Sessions totales', data: sessionData, gradientId: 'color4', color: '#d2b4de', unit: 'sessions' },
  ];

  const renderChart = ({ title, data, gradientId, color, unit }) => (
    <div>
      <h4 className="text-lg font-semibold text-purple-700 mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', borderColor: '#ddd' }}
            formatter={(value) => [`${value} ${unit}`, 'Nombre']}
            labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke={color}
            fillOpacity={1}
            fill={`url(#${gradientId})`}
            activeDot={{ r: 6 }}
            dot={{ stroke: color, strokeWidth: 2, r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const renderBarChart = ({ title, data, color, unit }) => (
    <div>
      <h4 className="text-lg font-semibold text-purple-700 mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="label" type="category" tick={{ fontSize: 12 }} width={150} />
          <Tooltip
            formatter={(value) => [`${value} ${unit}`, 'Nombre']}
          />
          <Bar dataKey="count" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPieChart = ({ title, data, unit }) => (
    <div>
      <h4 className="text-lg font-semibold text-purple-700 mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} ${unit}`, 'Nombre']}
            labelFormatter={(label) => `Utilisateur: ${label}`}
          />
          <Legend
            verticalAlign="bottom"
            height={80}
            iconType="circle"
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
              fontWeight: '500'
            }}
            formatter={(value, entry) => (
              <span style={{ color: entry.color, fontWeight: 'bold' }}>
                {entry.payload.label}: {entry.payload.count} {unit}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-indigo-700">Statistiques</h3>
        <div className="flex items-center gap-4">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="border border-indigo-200 rounded px-3 py-1 text-sm"
          >
            {rangeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'all' ? 'Tout afficher' : `Derniers ${opt} jours`}
              </option>
            ))}
          </select>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition"
          >
            <Download size={16} /> Exporter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {chartConfigs.map((config) => (
          <div key={config.title}>{renderChart(config)}</div>
        ))}
      </div>

      {/* Graphiques en barres et diagramme circulaire */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderBarChart({
          title: 'Messages par chatbot',
          data: messagesPerChatbot,
          color: '#8e44ad',
          unit: 'messages',
        })}
        {renderPieChart({
          title: 'Chatbots par utilisateur',
          data: chatbotsPerUser,
          unit: 'chatbots',
        })}
      </div>
    </div>
  );
};

export default GraphsSection;