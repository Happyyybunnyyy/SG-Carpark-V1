import type { Request, Response } from 'express';

export default function healthHandler(req: Request | any, res: Response | any) {
  if (res.setHeader) {
    res.setHeader('Cache-Control', 'no-store');
  }

  const hasLtaKey = Boolean(
    process.env.LTA_DATAMALL_ACCOUNT_KEY ||
    process.env.ACCOUNT_KEY ||
    process.env.LTA_ACCOUNT_KEY
  );

  return res.status(200).json({
    status: 'ok',
    hasLtaKey,
    timestamp: new Date().toISOString(),
  });
}
