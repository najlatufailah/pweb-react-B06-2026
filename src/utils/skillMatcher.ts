export interface SkillMatchResult {
  score: number;      // 0..100
  matched: string[];  // skill lowongan yang dimiliki Kapten
  missing: string[];  // skill lowongan yang belum dimiliki Kapten
}

export type MatchLevel = 'high' | 'medium' | 'low';

const normalize = (skill: string): string => skill.trim().toLowerCase();

export function calculateSkillMatch(
  userSkills: string[],
  requiredSkills: string[],
): SkillMatchResult {
  if (requiredSkills.length === 0) {
    return { score: 0, matched: [], missing: [] };
  }

  const userSet = new Set(userSkills.map(normalize));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of requiredSkills) {
    if (userSet.has(normalize(skill))) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const score = Math.round((matched.length / requiredSkills.length) * 100);
  return { score, matched, missing };
}

// hijau >= 70, kuning 40-69, merah < 40
export function getMatchLevel(score: number): MatchLevel {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}