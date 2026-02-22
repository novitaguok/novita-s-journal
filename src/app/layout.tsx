import "./globals.css";
import { ThemeProvider } from "../components/layout/ThemeProvider";
import App from "../components/layout/App";

export const metadata = {
  title: "Novita | Engineer & Designer",
  description: "Portfolio and Journal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </body>
    </html>
  );
}
