import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meu Financeiro",
  description: "Gestão financeira pessoal, simples e organizada.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
