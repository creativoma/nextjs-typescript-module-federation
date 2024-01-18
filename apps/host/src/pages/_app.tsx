import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import SwitchTheme from "./components/switch-theme";

export default function App({
  Component,
  pageProps: { session, pageProps },
}: AppProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider session={session}>
        <SwitchTheme clases="flex items-center absolute top-10 right-10" />
        <Component {...pageProps} />
      </SessionProvider>
    </NextThemesProvider>
  );
}
