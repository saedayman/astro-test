import cookie from 'cookie';

export function getAccessToken(req: Request): string | null {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  return cookies.accessToken || null;
}

export function setAccessToken(value: string, res: Response): void {
  const cookieValue = cookie.serialize('accessToken', value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  res.headers.append('Set-Cookie', cookieValue);
}

export function getTestVariantId(key: string, req: Request): string | null {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  return cookies[`testVariant_${key}`] || null;
}

export function setTestVariantId(key: string, value: string, res: Response): void {
  const cookieValue = cookie.serialize(`testVariant_${key}`, value, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  res.headers.append('Set-Cookie', cookieValue);
}

export function setVisitorId(value: string, res: Response): void {
  const cookieValue = cookie.serialize('visitorId', value, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  res.headers.append('Set-Cookie', cookieValue);
}

export function setVisitId(value: string, res: Response): void {
  const cookieValue = cookie.serialize('visitId', value, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });
  res.headers.append('Set-Cookie', cookieValue);
}

export function setLocaleCookie(value: string, res: Response): void {
  const cookieValue = cookie.serialize('locale', value, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
  res.headers.append('Set-Cookie', cookieValue);
}

export function getLanderCookie(req: Request): string | null {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  return cookies.lander || null;
}

export function getLocale(req?: Request): string {
  if (req) {
    const cookies = cookie.parse(req.headers.get('cookie') || '');
    return cookies.locale || 'en';
  }
  return 'en';
}
