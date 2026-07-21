'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Données de démonstration pour les graphiques
const revenueData = [
  { name: 'Lun', revenus: 40000, commandes: 24 },
  { name: 'Mar', revenus: 30000, commandes: 18 },
  { name: 'Mer', revenus: 50000, commandes: 32 },
  { name: 'Jeu', revenus: 45000, commandes: 28 },
  { name: 'Ven', revenus: 60000, commandes: 35 },
  { name: 'Sam', revenus: 80000, commandes: 45 },
  { name: 'Dim', revenus: 70000, commandes: 40 },
];

const categoryData = [
  { name: 'Entrées', value: 12 },
  { name: 'Plats principaux', value: 25 },
  { name: 'Desserts', value: 10 },
  { name: 'Boissons', value: 15 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-[#787774] text-sm font-medium">Commandes aujourd'hui</h3>
          <p className="text-3xl font-bold text-[#111111] mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-[#787774] text-sm font-medium">Revenus aujourd'hui</h3>
          <p className="text-3xl font-bold text-[#111111] mt-2">0 FCFA</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-[#787774] text-sm font-medium">Réservations aujourd'hui</h3>
          <p className="text-3xl font-bold text-[#111111] mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-[#787774] text-sm font-medium">Plats actifs</h3>
          <p className="text-3xl font-bold text-[#111111] mt-2">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique des revenus et commandes */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-[#111111] mb-6">Revenus et commandes (7 derniers jours)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#787774" />
                <YAxis stroke="#787774" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Line type="monotone" dataKey="revenus" stroke="#111111" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="commandes" stroke="#787774" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique des catégories */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-[#111111] mb-6">Plats par catégorie</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#787774" />
                <YAxis stroke="#787774" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Bar dataKey="value" fill="#111111" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
