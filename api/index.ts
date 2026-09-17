import type { Request, Response } from 'express';
import carparkAvailabilityHandler from './carpark-availability';

export { carparkAvailabilityHandler };

export default async function apiIndex(req: Request | any, res: Response | any) {
  return res.status(200).json({
    status: 'online',
    title: 'sgCarMart Singapore Carpark Availability API',
    endpoints: {
      carparkAvailability: {
        path: '/api/carpark-availability',
        method: 'GET',
        description: 'Live carpark lots (HDB + LTA + URA) from LTA DataMall2 CarParkAvailabilityv2',
        queryParameters: {
          skip: 'Record offset for pagination (defaults to 0)',
          fetchAll: 'Set to "true" to automatically retrieve all pages across Singapore',
        },
        requiresHeader: 'AccountKey (passed server-side via LTA_DATAMALL_ACCOUNT_KEY)',
      },
    },
    version: '1.0.0',
  });
}
