import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

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

        const user = await prisma.user.findUnique({
          where: { phone },
          include: {
            farmerProfile: true,
            buyerProfile: true,
          },
        });

        if (!user) {
          throw new Error("यह मोबाइल नंबर पंजीकृत नहीं है। कृपया नया खाता बनाएं।");
        }

        if (user.status === "SUSPENDED") {
          throw new Error("यह खाता सुरक्षा कारणों से निलंबित है। कृपया सहायता केंद्र से संपर्क करें।");
        }

        // Fast-path demo mode or bcrypt verify
        const isMockMatch =
          process.env.MOCK_OTP_MODE === "true" && pin === (process.env.MOCK_OTP_CODE || "1234");

        const isPinValid = isMockMatch || (await bcrypt.compare(pin, user.pinHash));

        if (!isPinValid) {
          throw new Error("अमान्य पिन। कृपया सही 4-अंकीय पिन दर्ज करें।");
        }

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
  },
});
