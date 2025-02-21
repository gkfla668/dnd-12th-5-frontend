import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)"],
};

// 로그인 정보가 있어야만 접근할 수 있는 페이지
const protectedRoutes = [
  "/home",
  "/giftbag/list",
  "/giftbag/add",
  "/giftbag/name",
  "/giftbag/select",
  "gift-upload",
  "/giftbag/delivery",
  "/setting",
  /^\/giftbag\/\d+$/, // /giftbag/[id]
  /^\/giftbag\/list\/\d+$/, // /giftbag/list/[giftBagId]
  /^\/giftbag\/list\/\d+\/\d+$/, // /giftbag/list/[giftBagId]/[giftId]
  /^\/giftbag\/list\/\d+\/answer$/, // /giftbag/list/[giftBagId]/answer
];

// 로그인 하지 않을 경우 접근할 수 있는 페이지
const publicRoutes = ["/auth/login"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  const currentPath = request.nextUrl.pathname;

  // 루트 경로("/")에 접근 시 로그인 여부에 따라 리다이렉트 처리
  if (currentPath === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/home", request.url));
    } else {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // 로그아웃 상태
  if (
    !token &&
    protectedRoutes.some((route) => {
      if (typeof route === "string") {
        return route === currentPath;
      }
      return route.test(currentPath); // 정규식 매칭
    })
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login"; // 로그인 페이지로 리다이렉트
    return NextResponse.redirect(url);
  }

  // 로그인 상태
  if (token && publicRoutes.includes(currentPath)) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
