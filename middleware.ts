import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 不需要验证的路由
const publicRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // 如果是公开路由，直接放行
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 如果没有 token，重定向到登录页
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 配置需要进行中间件处理的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (浏览器图标)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 