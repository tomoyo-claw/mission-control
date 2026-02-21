import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MockDataProvider } from "@/lib/mock-data";
import { ConvexClientProvider } from "@/lib/convex";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Digital workspace management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white">
        <ConvexClientProvider>
          <MockDataProvider>
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </div>
          </MockDataProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}