import type { Application } from '../types';

export function findInterviewConflicts(applications: Application[]): [Application, Application][] {
  const interviews = applications.filter(app => app.status === 'INTERVIEW' && app.interviewDateTime);
  const conflicts: [Application, Application][] = [];
  for (let i = 0; i < interviews.length; i++) {
    for (let j = i + 1; j < interviews.length; j++) {
      const first = Date.parse(interviews[i].interviewDateTime || '');
      const second = Date.parse(interviews[j].interviewDateTime || '');
      if (Math.abs(first - second) < 60 * 60 * 1000) {
        conflicts.push([interviews[i], interviews[j]]);
      }
    }
  }
  return conflicts;
}
