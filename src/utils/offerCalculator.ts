import type { WorkMode } from '../types';

export const workModeScores: Record<WorkMode, number> = {
  Remote: 100,
  Hybrid: 75,
  Onsite: 50,
};

export function calculateOfferScore(salary: number, highestSalary: number, mode: WorkMode, match: number) {
  const salaryScore = highestSalary > 0 ? salary / highestSalary * 50 : 0;
  const modeScore = workModeScores[mode] * 0.25;
  const skillScore = match * 0.25;
  return { salaryScore, modeScore, skillScore, total: salaryScore + modeScore + skillScore };
}
