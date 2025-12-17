'use client';
import React from 'react';
import { components } from '@/types/swagger-types';

interface SkillsProps {
  skills: (components['schemas']['Skill'] | undefined)[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const list = (skills || []).filter(
    (s): s is NonNullable<(typeof skills)[number]> => Boolean(s)
  );

  return (
    <div className='mt-8 w-full max-w-2xl px-4'>
      <h2 className='mb-2 text-xl font-semibold'>Skills:</h2>
      <div className='flex flex-wrap gap-2'>
        {list.map(skill => (
          <span
            key={skill.id}
            className='inline-flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100'
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
};
