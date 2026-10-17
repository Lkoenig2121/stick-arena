import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Stick Arena",
  description: "A Stick Arena-style deathmatch with lobby and The Lobby map.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html: `
#sa-lobby{background:#c0c0c0!important;color:#000!important;font-family:Verdana,Tahoma,Arial,sans-serif!important}
#sa-lobby .sa-panel{background:#c0c0c0!important;border-top:2px solid #808080!important;border-left:2px solid #808080!important;border-right:2px solid #fff!important;border-bottom:2px solid #fff!important}
#sa-lobby .sa-nick{color:#000080!important}
#sa-lobby .sa-field,#sa-lobby .sa-select{-webkit-appearance:none!important;appearance:none!important;background:#dcdcdc!important;border:1px solid #808080!important;color:#000!important;box-shadow:inset 1px 1px 2px #808080!important;font:700 12px Verdana,Tahoma,sans-serif!important}
#sa-lobby .sa-select{background:linear-gradient(180deg,#fff 0%,#c8c8c8 100%)!important;text-transform:uppercase!important}
#sa-lobby .sa-btn{-webkit-appearance:none!important;appearance:none!important;width:100%!important;border-radius:18px!important;border:1px solid #808080!important;background:linear-gradient(180deg,#fff 0%,#e4e4e4 46%,#c8c8c8 100%)!important;color:#000!important;font:800 15px Verdana,Tahoma,sans-serif!important;padding:8px 12px!important;box-shadow:inset 0 1px 0 #fff,0 1px 0 #808080!important;cursor:pointer!important}
.sa-leave-btn{-webkit-appearance:none!important;appearance:none!important;min-width:88px!important;border-radius:16px!important;border:1px solid #808080!important;background:linear-gradient(180deg,#fff 0%,#e4e4e4 46%,#c8c8c8 100%)!important;color:#000!important;font:800 14px Verdana,Tahoma,sans-serif!important;padding:7px 14px!important;cursor:pointer!important}
`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
