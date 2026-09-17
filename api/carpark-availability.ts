import type { Request, Response } from 'express';

export interface LtaCarparkRecord {
  CarParkID: string;
  Area: string;
  Development: string;
  Location: string; // "lat lng" coordinates
  AvailableLots: number;
  LotType: 'C' | 'H' | 'Y'; // C = Cars, H = Heavy, Y = Motorcycles
  Agency: 'HDB' | 'LTA' | 'URA';
}

export interface LtaApiResponse {
  'odata.metadata'?: string;
  value: LtaCarparkRecord[];
}

/**
 * Serverless handler for Singapore LTA DataMall CarParkAvailabilityv2.
 * Endpoint: https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
 * Required Header: AccountKey: <user_key>
 *
 * Reads AccountKey securely from process.env (LTA_DATAMALL_ACCOUNT_KEY or ACCOUNT_KEY).
 * Never hardcodes credentials.
 */
export default async function handler(req: Request | any, res: Response | any) {
  // Set CORS and JSON headers
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, AccountKey');
  }

  if (req.method === 'OPTIONS') {
    return res.status ? res.status(200).end() : res.end();
  }

  // AccountKey read from server environment variables (never exposed to client)
  const accountKey =
    process.env.LTA_DATAMALL_ACCOUNT_KEY ||
    process.env.ACCOUNT_KEY ||
    process.env.LTA_ACCOUNT_KEY ||
    (req.headers && (req.headers['accountkey'] as string || req.headers['x-account-key'] as string)) ||
    '';

  if (!accountKey || accountKey.trim() === '' || accountKey === 'MY_LTA_KEY') {
    return res.status(200).json({
      status: 'unconfigured',
      configured: false,
      message:
        'LTA DataMall AccountKey is not set. Please set LTA_DATAMALL_ACCOUNT_KEY or ACCOUNT_KEY in your environment or .env file. Obtain a free key from https://datamall.lta.gov.sg/.',
      endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2',
      totalLotsCount: 0,
      value: [],
    });
  }

  try {
    const query = req.query || {};
    const skip = query.skip || query.$skip || 0;
    const fetchAll = query.fetchAll === 'true' || query.all === 'true';

    const baseUrl = 'https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2';

    if (!fetchAll) {
      // Single page fetch
      const targetUrl = skip ? `${baseUrl}?$skip=${skip}` : baseUrl;
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          AccountKey: accountKey.trim(),
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({
          status: 'error',
          configured: true,
          httpStatus: response.status,
          message: `LTA DataMall responded with HTTP ${response.status}: ${errorText || response.statusText}`,
          value: [],
        });
      }

      const data = (await response.json()) as LtaApiResponse;
      return res.status(200).json({
        status: 'success',
        configured: true,
        source: 'LTA DataMall2 (CarParkAvailabilityv2)',
        count: data.value?.length || 0,
        value: data.value || [],
      });
    }

    // Fetch all pages (LTA returns 500 per page, typically 3-4 pages max for all SG)
    let allRecords: LtaCarparkRecord[] = [];
    let currentSkip = 0;
    let keepFetching = true;
    let pageCount = 0;
    const MAX_PAGES = 6; // Safety ceiling

    while (keepFetching && pageCount < MAX_PAGES) {
      pageCount++;
      const pageUrl = currentSkip > 0 ? `${baseUrl}?$skip=${currentSkip}` : baseUrl;
      const response = await fetch(pageUrl, {
        method: 'GET',
        headers: {
          AccountKey: accountKey.trim(),
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        if (allRecords.length > 0) {
          // Return whatever we already gathered
          break;
        }
        const errorText = await response.text();
        return res.status(response.status).json({
          status: 'error',
          configured: true,
          message: `LTA DataMall error: ${errorText || response.statusText}`,
          value: [],
        });
      }

      const pageData = (await response.json()) as LtaApiResponse;
      const items = pageData.value || [];
      allRecords = allRecords.concat(items);

      if (items.length < 500) {
        keepFetching = false;
      } else {
        currentSkip += 500;
      }
    }

    return res.status(200).json({
      status: 'success',
      configured: true,
      source: 'LTA DataMall2 (CarParkAvailabilityv2)',
      count: allRecords.length,
      value: allRecords,
    });
  } catch (error: any) {
    console.error('Error connecting to LTA CarParkAvailabilityv2:', error);
    return res.status(500).json({
      status: 'error',
      configured: true,
      message: error?.message || 'Failed to fetch from LTA DataMall endpoint',
      value: [],
    });
  }
}
