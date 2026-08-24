import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { PixelShell } from "@/components/pixel/shell";
import appCss from "../styles.css?url";

const APP_NAME = "HOUSE STEEL";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "A family in Serbia is building a real combat robot. This site is the garage log. Not LEGO. Not a toy story.",
      },
      { name: "theme-color", content: "#0a0a0c" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap",
      },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" suppressHydrationWarning className="bg-pit">
      <head>
        <HeadContent />
      </head>
      <body className="bg-pit text-paper">
        <PreviewHostBridge />
        <AuthProvider>
          <PixelShell>
            <Outlet />
          </PixelShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
