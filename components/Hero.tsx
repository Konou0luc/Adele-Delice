const Hero = () => {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/Gallery/sitting-table-with-chairs-yellow-sofa-restaurant-with-panoramic-view.webp" 
          alt="Adèle Délice - Restaurant" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl pt-20">
        <img 
          src="/logo-small.webp" 
          alt="Adèle Délice Logo" 
          className="w-48 mx-auto mb-8"
        />
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Mangez comme si vous êtes à la maison
        </h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90">
          Découvrez nos plats faits maison, préparés avec amour et des ingrédients frais.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="#menu" 
            className="px-10 py-4 bg-white text-[#111111] text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Voir le menu
          </a>
          <a 
            href="#reservation" 
            className="px-10 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Réserver une table
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;