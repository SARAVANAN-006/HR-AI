import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Java', score: 85, fill: '#8b5cf6' },
  { name: 'Python', score: 91, fill: '#22d3ee' },
  { name: 'C++', score: 76, fill: '#10b981' }
];

const LanguageBreakdownChart: React.FC = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} />
          <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'monospace' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '6px' }}
            labelStyle={{ color: '#9ca3af', fontFamily: 'monospace' }}
            itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LanguageBreakdownChart;
