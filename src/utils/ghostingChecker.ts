import type { Application } from '../types';

const DAY = 24 * 60 * 60 * 1000;

export function isRawanGhosting(app: Application, now = Date.now()): boolean {
  return (app.status === 'APPLIED' || app.status === 'SCREENING') &&
    now - Date.parse(app.lastUpdatedAt) > 14 * DAY;
}

export function simulateGhosting(app: Application): Application {
  return { ...app, lastUpdatedAt: new Date(Date.parse(app.lastUpdatedAt) - 15 * DAY).toISOString() };
}
