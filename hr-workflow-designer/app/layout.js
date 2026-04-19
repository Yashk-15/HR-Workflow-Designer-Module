import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'HR Workflow Designer',
  description: 'Visually design and test HR workflows — onboarding, leave approval, document verification.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
