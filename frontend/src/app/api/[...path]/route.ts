import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
const EMBER_API_KEY = process.env.EMBER_API_KEY || "";

/**
 * Server-side proxy to the Ember backend (Cloud Run / local uvicorn).
 *
 * The browser never talks to the backend directly: this handler forwards
 * /api/* requests and injects X-API-Key from the server environment,
 * so the secret never reaches the client. When EMBER_API_KEY is not set
 * (local dev), the header is simply omitted and the backend stays open.
 */
async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname.replace(/^\/api/, "");
  const target = new URL(`${BACKEND_URL}/api${path}`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of ["content-type", "accept", "authorization"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (EMBER_API_KEY) headers.set("X-API-Key", EMBER_API_KEY);

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  const response = await fetch(target, {
    method: request.method,
    headers,
    body,
    cache: "no-store",
  });

  return new NextResponse(await response.arrayBuffer(), {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(request: NextRequest) {
  return proxy(request);
}

export async function POST(request: NextRequest) {
  return proxy(request);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}
