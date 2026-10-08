import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";
import { checkLoginRateLimit, recordFailedLogin, resetLoginRateLimit } from "./rateLimit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Phone and PIN",
      credentials: {
        phone: { label: "Mobile Number", type: "text" },
        pin: { label: "4-Digit PIN", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.pin) {
          throw new Error("कृपया मोबाइल नंबर और पिन दोनों दर्ज करें");
        }

        const phone = String(credentials.phone).trim();
        const pin = String(credentials.pin).trim();

        // Security fix (HIGH #5): Rate limiting prevents 4-digit PIN brute-force
        const rateLimit = checkLoginRateLimit(phone);
        if (!rateLimit.allowed) {
          const mins = Math.ceil((rateLimit.retryAfterSeconds || 60) / 60);
          throw new Error(
            `अत्यधिक गलत प्रयासों के कारण यह खाता अस्थायी रूप से लॉक है। कृपया ${mins} मिनट बाद पुनः प्रयास करें।`
          );
        }

        const user = await prisma.user.findUnique({
          where: { phone },
          include: {
            farmerProfile: true,
            buyerProfile: true,
          },
        });

        if (!user) {
          recordFailedLogin(phone);
          throw new Error("यह मोबाइल नंबर पंजीकृत नहीं है। कृपया नया खाता बनाएं।");
        }

        if (user.status === "SUSPENDED") {
          throw new Error("यह खाता सुरक्षा कारणों से निलंबित है। कृपया सहायता केंद्र से संपर्क करें।");
        }

        // Security: Mock OTP is strictly disabled in production and NEVER permitted for ADMIN role
        const isMockAllowed =
          process.env.NODE_ENV !== "production" &&
          process.env.MOCK_OTP_MODE === "true" &&
          user.role !== Role.ADMIN;

        const isMockMatch =
          isMockAllowed && pin === (process.env.MOCK_OTP_CODE || "1234");

        const isPinValid = (await bcrypt.compare(pin, user.pinHash)) || isMockMatch;

        if (!isPinValid) {
          const failRecord = recordFailedLogin(phone);
          if (failRecord.isBlocked) {
            throw new Error(
              "5 बार गलत पिन दर्ज किया गया। सुरक्षा कारणों से यह खाता 15 मिनट के लिए लॉक कर दिया गया है।"
            );
          }
          throw new Error(
            `अमान्य पिन। कृपया सही 4-अंकीय पिन दर्ज करें। (${failRecord.remainingAttempts} प्रयास शेष)`
          );
        }

        // Clear failed attempts counter upon successful login
        resetLoginRateLimit(phone);

        return {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as unknown as { phone: string }).phone;
        token.role = (user as unknown as { role: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as unknown as { phone: string }).phone = token.phone as string;
        (session.user as unknown as { role: Role }).role = token.role as Role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days session lifetime
  },
});
