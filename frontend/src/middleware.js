import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");

  // Redirect to "/landing" if the user is not authenticated
  if (
    !token &&
    req.nextUrl.pathname !== "/login" &&
    req.nextUrl.pathname !== "/two-step-verification" &&
    req.nextUrl.pathname !== "/register"
  ) {
    return NextResponse.redirect(new URL("/landing", req.url));
  }

  return NextResponse.next();
}

// Define the routes that should be protected
export const config = {
  matcher: ["/", "/activity", "/profile", "/upload", "/settings"],
};
