import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import prisma from "@/lib/prisma";

const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

type SessionResult = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
};

async function getSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(adminId: string) {
  const rawToken = crypto.randomBytes(48).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  const userHeaders = await headers();
  const cookieStore = await cookies();

  await prisma.adminSession.create({
    data: {
      token: tokenHash,
      adminId,
      expiresAt,
      userAgent: userHeaders.get("user-agent") ?? undefined,
      ipAddress: userHeaders.get("x-forwarded-for") ?? undefined,
    },
  });

  cookieStore.set({
    name: SESSION_COOKIE,
    value: rawToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getCurrentAdmin(): Promise<SessionResult | null> {
  const token = await getSessionCookie();
  if (!token) return null;

  const tokenHash = hashToken(token);

  const session = await prisma.adminSession.findUnique({
    where: { token: tokenHash },
    include: { admin: true },
  });

  if (!session) {
    await destroySessionCookie();
    return null;
  }

  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => undefined);
    await destroySessionCookie();
    return null;
  }

  return {
    id: session.admin.id,
    name: session.admin.name,
    email: session.admin.email,
    role: session.admin.role,
    avatarUrl: session.admin.avatarUrl,
  };
}

export async function destroySessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function revokeSession(token: string) {
  const tokenHash = hashToken(token);
  await prisma.adminSession.deleteMany({ where: { token: tokenHash } });
  await destroySessionCookie();
}

export async function signOut(adminId?: string) {
  const token = await getSessionCookie();
  if (token) {
    await revokeSession(token);
    return;
  }

  if (adminId) {
    await prisma.adminSession.deleteMany({ where: { adminId } });
  }
  await destroySessionCookie();
}
