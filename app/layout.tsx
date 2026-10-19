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
#sa-lobby{background:#2a2a2a!important;color:#f2f2f2!important;font-family:Verdana,Tahoma,Arial,sans-serif!important}
#sa-lobby .sa-header{height:22px!important;display:flex!important;align-items:center!important;padding:0 2px!important;font-size:11px!important;font-weight:700!important;letter-spacing:.18em!important;color:#ffc14a!important}
#sa-lobby .sa-panel{background:#353535!important;border-top:2px solid #161616!important;border-left:2px solid #161616!important;border-right:2px solid #4a4a4a!important;border-bottom:2px solid #4a4a4a!important}
#sa-lobby .sa-chat{flex:1!important;min-height:0!important;overflow:auto!important;padding:8px 10px!important;font-size:13px!important;font-weight:700!important;line-height:1.45!important;color:#f2f2f2!important}
#sa-lobby .sa-nick{color:#ffc14a!important}
#sa-lobby .sa-stats{flex-shrink:0!important;padding:8px 4px 0!important;font-size:12px!important;font-weight:800!important;line-height:1.55!important;text-transform:uppercase!important;color:#e6e6e6!important}
#sa-lobby .sa-name{padding:2px 6px!important;font-size:13px!important;font-weight:800!important;color:#f2f2f2!important}
#sa-lobby .sa-bar{padding:2px 6px!important;font-size:13px!important;font-weight:800!important;color:#111!important}
#sa-lobby .sa-field,#sa-lobby .sa-select{-webkit-appearance:none!important;appearance:none!important;background:#1a1a1a!important;border:1px solid #4a4a4a!important;color:#f2f2f2!important;box-shadow:inset 1px 1px 2px #000!important;font:700 12px Verdana,Tahoma,sans-serif!important}
#sa-lobby .sa-select{background:linear-gradient(180deg,#4a4a4a 0%,#2c2c2c 100%)!important;text-transform:uppercase!important}
#sa-lobby .sa-btn{-webkit-appearance:none!important;appearance:none!important;width:100%!important;border-radius:18px!important;border:1px solid #a66b00!important;background:linear-gradient(180deg,#ffc14a 0%,#f39c12 46%,#c77800 100%)!important;color:#1a1200!important;font:800 15px Verdana,Tahoma,sans-serif!important;padding:8px 12px!important;box-shadow:inset 0 1px 0 #ffd98a,0 1px 0 #5a3a00!important;cursor:pointer!important}
.sa-leave-btn,.sa-title-btn{-webkit-appearance:none!important;appearance:none!important;border-radius:18px!important;border:1px solid #7a8696!important;background:linear-gradient(180deg,#e8eef4 0%,#c5d0dc 48%,#b4c0ce 100%)!important;color:#2a3a4c!important;font:800 18px Verdana,Tahoma,sans-serif!important;padding:8px 16px!important;box-shadow:inset 0 1px 0 #fff,0 1px 0 #7a8696!important;cursor:pointer!important}
.sa-title-btn{width:100%!important}
#sa-title{background:#efe6d2!important}
#sa-card{background:#efe6d2!important;color:#111!important;font-family:Verdana,Tahoma,Arial,sans-serif!important}
#sa-card .sa-card-box{background:#c0c0c0!important;border-top:2px solid #fff!important;border-left:2px solid #fff!important;border-right:2px solid #808080!important;border-bottom:2px solid #808080!important;padding:20px!important}
#sa-card .sa-field{-webkit-appearance:none!important;appearance:none!important;width:100%!important;background:#f3f3f3!important;border:1px solid #808080!important;color:#000!important;font:700 14px Verdana,Tahoma,sans-serif!important;padding:8px!important;margin-bottom:14px!important}
#sa-card .sa-btn{-webkit-appearance:none!important;appearance:none!important;border-radius:16px!important;border:1px solid #808080!important;background:linear-gradient(180deg,#fff 0%,#e4e4e4 46%,#c8c8c8 100%)!important;color:#000!important;font:800 14px Verdana,Tahoma,sans-serif!important;padding:7px 14px!important;cursor:pointer!important}
`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
