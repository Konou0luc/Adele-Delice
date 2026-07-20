import Link from 'next/link';

const Menu = () => {
  const menuItems = [
    {
      image: "/Plats/IMG_20260628_185117968_AE.webp",
      name: "Plat du Jour",
      description: "Plat frais préparé chaque jour avec les ingrédients du marché.",
      price: "15 000 FCFA"
    },
    {
      image: "/Plats/IMG_20260628_215543957_AE.webp",
      name: "Poulet Yassa",
      description: "Poulet mariné au citron, oignons et épices sénégalaises.",
      price: "18 000 FCFA"
    },
    {
      image: "/Plats/IMG_20260602_155913180_AE.webp",
      name: "Thieboudienne",
      description: "Plat traditionnel sénégalais avec du poisson et du riz.",
      price: "20 000 FCFA"
    }
  ];

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm uppercase tracking-widest text-[#787774] mb-4 block">Nos plats</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111111]">
            Découvrez notre carte
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, idx) => (
            <div 
              key={idx} 
              className="group border border-[#EAEAEA] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[#111111]">{item.name}</h3>
                  <span className="text-lg font-semibold text-[#111111]">{item.price}</span>
                </div>
                <p className="text-[#787774]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <Link 
            href="/menu"
            className="px-10 py-4 bg-[#111111] text-white text-lg font-semibold rounded-lg hover:bg-[#333333] transition-colors"
          >
            Voir le menu complet
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Menu;