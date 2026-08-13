'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

interface SkillRadarProps {
  skills: { name: string; value: number }[];
}

export function SkillRadar({ skills }: SkillRadarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-card border-card-border">
        <h3 className="text-lg font-bold text-foreground mb-4">Skill Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={skills}>
            <PolarGrid stroke="rgba(0,0,0,0.12)" />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ fill: '#6d6d6d', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: '#6d6d6d', fontSize: 10 }}
            />
            <Radar 
              name="Skills" 
              dataKey="value" 
              stroke="#000000" 
              fill="#000000" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
