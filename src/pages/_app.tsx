import "~/styles/globals.css";
import { api } from "~/utils/api";
import Providers from "~/providers";
import { type AppType } from "next/app";
import Navbar from "~/components/Navbar";
import { type Session } from "next-auth";
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

const StaffHub: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Providers>
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
    </Providers>
  );
};

export default api.withTRPC(StaffHub);
