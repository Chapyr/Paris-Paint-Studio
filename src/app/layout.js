import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata = {
  title: 'Paris Paint Studio — Peinture de Figurines Warhammer à Paris',
  description: 'Service professionnel de peinture sur figurines Warhammer à Paris. Peinture sur commande de haute qualité pour Warhammer 40K, Age of Sigmar et jeux de figurines.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Navbar />
        {children}
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
