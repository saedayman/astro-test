import type { APIRoute } from 'astro';
import {
  getAccessToken,
  setAccessToken,
  setVisitorId,
  setLocaleCookie,
  setVisitId,
  getTestVariantId,
  setTestVariantId,
  getLanderCookie,
  getLocale,
} from '../../lib/cookies';
import HTTP, { apiHandler } from '../../lib/http.service';
import { AxiosError, AxiosRequestConfig } from 'axios';

interface SessionResponse {
  success: boolean;
  data: Session;
}

export interface SessionTestConfig {
  config?: {
    css?: string;
    isDefault?: boolean;
  };
  variantId?: number;
}

export interface Session {
  accessToken: string | null;
  visitDetails: VisitDetails;
  testConfig?: SessionTestConfig;
  domainInfo?: any;
  dkisInfo: any[] | null;
  genericRoutesInfo?: any | null;
  routeConfig?: any | null;
}

export interface VisitDetails {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  ip: string;
  stateCode: string;
  postalCode: string | null;
  visitorId: string;
  userId: string;
  visitId: string;
  trafficSource: string | null;
  trafficSourceType: string | null;
  trafficSourceNetwork: string | null;
  platform: string;
  isMobile: boolean;
  hashedVisitId?: string;
}

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const clientAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || '8.8.8.8';
  
  const accessToken = getAccessToken(request);
  const variantId = url.searchParams.get('variantId') || getTestVariantId('style', request);
  const lander = getLanderCookie(request) || url.searchParams.get('lander');
  const parsedVariantId = variantId ? parseInt(variantId, 10) : undefined;

  const meta: { lander?: string } = {};
  if (lander) {
    meta['lander'] = lander;
  }

  const userAgent = request.headers.get('user-agent') || null;
  const ipAddress = 
    import.meta.env.NODE_ENV === 'development'
      ? import.meta.env.FALLBACK_IP_ADDRESS || '8.8.8.8'
      : request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for') ||
        clientAddress ||
        '8.8.8.8';

  const useV2Api = import.meta.env.USE_V2_SESSION_API === 'true';
  const sessionApiUrl = useV2Api ? '/api/web/v2/sessions' : '/api/web/v1/sessions';

  const config: AxiosRequestConfig = {
    method: 'post',
    url: sessionApiUrl,
    data: {
      userAgent,
      ipAddress,
      cookies: request.headers.get('cookie'),
      lang: 'en',
      url: url.toString(),
      referrer: request.headers.get('referer'),
      variantId: !isNaN(parsedVariantId!) ? parsedVariantId : undefined,
      meta,
    },
    headers: accessToken
      ? {
          'X-DOMAIN-NAME': 'waterremovalcosts.com',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'X-Language': getLocale(request),
        }
      : {
            'X-DOMAIN-NAME': 'waterremovalcosts.com',
          'Content-Type': 'application/json',
          'X-Language': getLocale(request),
        },
  };

  const { data: sessionResponse, error } = await apiHandler<SessionResponse>(
    () => HTTP.server(config)
  );
    console.log('Session API Request Config:', config, error);
  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: (error as AxiosError).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  console.log('Session Response:', sessionResponse);
  if (sessionResponse?.success) {
    const response = new Response(JSON.stringify(sessionResponse.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Set cookies
    setAccessToken(sessionResponse.data.accessToken!, response);
    setTestVariantId(
      'style',
      String(sessionResponse.data.testConfig?.variantId),
      response
    );
    setVisitorId(sessionResponse.data.visitDetails.visitorId, response);
    setVisitId(sessionResponse.data.visitDetails.visitId, response);
    setLocaleCookie(getLocale(request), response);

    return response;
  }

  return new Response(JSON.stringify({ success: false }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
};
