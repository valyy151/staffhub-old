import "~/styles/globals.css";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppType } from "next/app";
import NextNProgress from "nextjs-progressbar";
import ThemeProviders from "~/theme-provider";
import { api } from "~/utils/api";

import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

const StaffHub: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProviders attribute="class" defaultTheme="system">
      <SessionProvider session={session}>
        <Navbar />
        <NextNProgress
          color="#0284c7"
          showOnShallow={false}
          options={{
            showSpinner: false,
          }}
        />
        <Component {...pageProps} />
        <Toaster />
      </SessionProvider>
    </ThemeProviders>
  );
};

export default api.withTRPC(StaffHub);
