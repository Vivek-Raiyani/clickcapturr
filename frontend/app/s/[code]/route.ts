import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  try {
    const response = await fetch(`${apiUrl}/links/r/${code}`, {
      cache: 'no-store',
    });

    if (response.ok) {
      const result = await response.json();
      const redirectUrl: string = result.data.redirect_url;
      const linkId: string = result.data.link_id;

      // Build an absolute URL for the redirect
      const destination = redirectUrl.startsWith('http')
        ? redirectUrl
        : new URL(redirectUrl, request.nextUrl.origin).toString();

      const res = NextResponse.redirect(destination, { status: 307 });

      res.cookies.set('cc_source_link', linkId, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/',
        httpOnly: false, // readable by client-side JS for lead attribution
      });
      res.cookies.set('cc_source_method', 'click', {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        httpOnly: false,
      });

      return res;
    }
  } catch (error) {
    console.error('[/s/[code]] Redirect error:', error);
  }

  // Fallback — shortcode not found or backend error
  return NextResponse.redirect(new URL('/404', request.nextUrl.origin), { status: 307 });
}
