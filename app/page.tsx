import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Menu from '@/components/Menu';
import Testimonials from '@/components/Testimonials';
import Gallery from '@/components/Gallery';
import Reservation from '@/components/Reservation';
import Footer from '@/components/Footer';
import { getDishes, getGalleryItems } from '@/lib/api';
import type { Dish, GalleryItem } from '@/lib/api';

export default async function Home() {
  let dishes: Dish[] = [];
  let galleryItems: GalleryItem[] = [];
  try {
    [dishes, galleryItems] = await Promise.all([
      getDishes(),
      getGalleryItems()
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Adèle Délice",
            description:
              "Restaurant à Lomé proposant une cuisine familiale et des plats faits maison.",
            url: "https://adele-delice.vercel.app",
            image:
              "https://adele-delice.vercel.app/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp",
            telephone: "+228 98 50 72 26",
            email: "contact@adeledelice.com",
            hasMap: "https://maps.app.goo.gl/UqkjyaTRKZUPKeW26?g_st=aw",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Lomé",
              addressCountry: "TG",
            },
            servesCuisine: ["Cuisine familiale", "Cuisine africaine"],
            priceRange: "$$",
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ],
                opens: "11:00",
                closes: "22:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Saturday",
                opens: "10:00",
                closes: "23:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Sunday",
                opens: "10:00",
                closes: "21:00",
              },
            ],
          }),
        }}
      />
      <Navbar />
      <Hero />
      <About />
      <Menu dishes={dishes} />
      <Testimonials />
      <Gallery galleryItems={galleryItems} />
      <Reservation />
      <Footer />
    </main>
  );
}