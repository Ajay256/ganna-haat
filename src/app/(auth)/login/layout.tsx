import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "लॉगिन (Login)",
  description: "गन्ना हाट पर लॉगिन करें। किसान, चीनी मिल व कोल्हू व्यापारी अपने खाते में सुरक्षित प्रवेश करें।",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
