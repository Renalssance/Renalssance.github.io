import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { SKILLS_DATA } from '../constants';

const SkillsChart: React.FC = () => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILLS_DATA}>
          <PolarGrid stroke="#94a3b8" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#475569', fontSize: 12, fontFamily: 'sans-serif', fontWeight: 600 }} 
          />
          <Radar
            name="Skill Level"
            dataKey="A"
            stroke="#6b7280"
            strokeWidth={2}
            fill="#7d8c8c"
            fillOpacity={0.5}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              borderColor: '#e2e8f0',
              color: '#334155',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#64748b' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillsChart;