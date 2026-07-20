const About = () => {
  return (
    <section id="about" className="py-24 bg-[#F7F6F3]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm uppercase tracking-widest text-[#787774] mb-4 block">Notre histoire</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#111111] mb-6 leading-tight">
              Adèle Délice: une cuisine familiale authentique
            </h2>
            <p className="text-lg text-[#2F3437] mb-6 leading-relaxed">
              Depuis toujours, nous avons à cœur de proposer des plats simples, savoureux et préparés avec des ingrédients frais et locaux. Notre équipe travaille chaque jour pour vous offrir une expérience culinaire inoubliable, dans un cadre chaleureux et convivial.
            </p>
            <p className="text-lg text-[#2F3437] leading-relaxed">
              Venez découvrir notre carte, nos menus du jour et nos spécialités. On se retrouve à table!
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="/Gallery/fashionable-feminist-african-american-woman-wear-black-tshirt-shorts-posed-restaurant-eat-cheese-cake.webp" 
              alt="Restaurant" 
              className="rounded-xl w-full h-64 object-cover"
            />
            <img 
              src="/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp" 
              alt="Intérieur" 
              className="rounded-xl w-full h-64 object-cover mt-8"
            />
            <img 
              src="/Gallery/stylish-african-woman-red-shirt-hat-posed-indoor-cafe-drinking-pineapple-lemonade.webp" 
              alt="Ambiance" 
              className="rounded-xl w-full h-64 object-cover"
            />
            <img 
              src="/Gallery/pork-hock-german-with-sauces-dark-background.webp" 
              alt="Plat" 
              className="rounded-xl w-full h-64 object-cover mt-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;