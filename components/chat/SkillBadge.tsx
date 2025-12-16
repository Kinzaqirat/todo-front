'use client';

import { SKILL_LABELS, SKILL_COLORS, type SkillType } from '@/types/chat';

interface SkillBadgeProps {
  skill: string;
}

export function SkillBadge({ skill }: SkillBadgeProps) {
  const skillType = skill as SkillType;
  const label = SKILL_LABELS[skillType] || skill;
  const colorClass = SKILL_COLORS[skillType] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}
    >
      {label}
    </span>
  );
}
