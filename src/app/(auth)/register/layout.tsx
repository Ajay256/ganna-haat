import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "पंजीकरण (Register) — किसान व व्यापारी खाता बनाएं",
  description: "गन्ना हाट पर नया खाता बनाएं। किसान के रूप में गन्ना बेचें या मिल/व्यापारी के रूप में बोली लगाएं।",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
