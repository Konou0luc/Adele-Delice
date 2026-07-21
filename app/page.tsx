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