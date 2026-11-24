import type { Application } from '../types';
import { isRawanGhosting } from './ghostingChecker.ts';

export function calculateStatistics(applications: Application[], now = Date.now()) {
  const total = applications.length;
  const active = applications.filter(app =>
    app.status === 'APPLIED' || app.status === 'SCREENING' || app.status === 'INTERVIEW'
  ).length;

  // Response: pernah mendapat screening, interview, offer, atau penolakan.
  const responded = applications.filter(app =>
    ['SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED'].includes(app.status) ||
    !!app.interviewDateTime ||
    app.activityLogs.some(log =>
      log.message === 'Status: APPLIED -> SCREENING' ||
      log.message === 'Status: GHOSTED -> SCREENING'
    )
  ).length;

  const interviewed = applications.filter(app =>
    app.status === 'INTERVIEW' || app.status === 'OFFER' || !!app.interviewDateTime
  ).length;

  // Wireframe soal memakai seluruh lamaran sebagai pembagi.
  return {
    total, active, responded, interviewed,
    responseRate: total === 0 ? 0 : Math.round(responded / total * 100),
    interviewRate: total === 0 ? 0 : Math.round(interviewed / total * 100),
    ghosting: applications.filter(app => isRawanGhosting(app, now)).length,
    offers: applications.filter(app => app.status === 'OFFER').length,
  };
}
