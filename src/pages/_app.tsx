import "~/styles/globals.css";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { AppType } from "next/app";
import ThemeProviders from "~/theme-provider";
import { api } from "~/utils/api";

import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import { Toaster } from "@/components/ui/toaster";

const StaffHub: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProviders attribute="class" defaultTheme="system">
      <SessionProvider session={session}>
        <Navbar />
        <ProgressBar />
        <Component {...pageProps} />
        <Toaster />
      </SessionProvider>
    </ThemeProviders>
  );
};

export default api.withTRPC(StaffHub);
