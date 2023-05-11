import { NextResponse } from 'next/server';

export const middleware = (request) => {
  if (request.nextUrl.pathname.startsWith('/redirect/login')) {
    /** OAuth2 로그인 시 토큰 저장 */
    const urlParams = new URL(request.url).searchParams;
    const token = urlParams.get('token');

    const response = NextResponse.redirect(new URL('/login/redirect', request.url));
    response.cookies.set('token', token);

    return response;
  } else if (request.nextUrl.pathname.startsWith('/redirect/error')) {
    /** OAuth2 로그인 실패 시 에러 메시지와 함께 로그인 페이지로 이동 */
    const urlParams = new URL(request.url).searchParams;

    const code = urlParams.get('code');
    const message = urlParams.get('message');

    return NextResponse.redirect(
      new URL(`/?code=${code}&message=${message}`, request.url)
    );
  } else if (
    (!request.cookies.get('token') || request.cookies.get('token') === undefined) &&
    request.nextUrl.pathname !== '/'
  ) {
    /** 토큰이 없을 시(인가되지 않은 사용자) 로그인 페이지로 이동 */
    return NextResponse.redirect(new URL('/', request.url));
  }

  /** 나머지 경우는 요청한 주소로 이동 */
  return NextResponse.rewrite(new URL(request.url, request.url));
};

export const config = {
  matcher: ['/((?!api|static|_next|favicon.ico).*)'],
};
