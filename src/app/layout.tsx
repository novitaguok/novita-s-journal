import "./globals.css";
import { ThemeProvider } from "../components/layout/ThemeProvider";
import App from "../components/layout/App";

export const metadata = {
  title: "Novita | Engineer & Designer",
  description: "Portfolio and Journal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400&family=Fira+Code:wght@400;600&family=Caveat:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </body>
    </html>
  );
}
