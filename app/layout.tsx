import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Sidebar } from "@/app/components/Sidebar";
import { getCurrentUser } from "@/app/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Petty Cash Tracker",
  description: "Manage petty cash distribution and reconciliation",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-slate-50/50">
        <ClerkProvider>
          <Sidebar isAdmin={isAdmin} />
          <main className="flex-1 flex flex-col min-h-screen">
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-300 bg-white px-10 py-5">
              <div className="flex flex-col">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Portal Overview</h2>
                <p className="text-sm font-semibold text-gray-900">Welcome back, {currentUser?.name ?? (isAdmin ? "Admin" : "User")}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-300 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">?</span>
                  </div>
                </div>
                <Show when="signed-out">
                  <div className="flex items-center gap-3">
                    <SignInButton />
                    <SignUpButton />
                  </div>
                </Show>
                <Show when="signed-in">
                  <div className="h-9 w-9 border-2 border-slate-300 rounded-full p-0.5 hover:border-indigo-500 transition-colors">
                    <UserButton />
                  </div>
                </Show>
              </div>
            </header>
            <div className="p-10 max-w-7xl mx-auto w-full">{children}</div>
          </main>
        </ClerkProvider>
      </body>
    </html>
  );
}
