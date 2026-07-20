import { FaStar } from 'react-icons/fa';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie S.",
      text: "Un restaurant incroyable! Les plats sont délicieux et l'ambiance est chaleureuse. Je recommande vivement.",
      rating: 5
    },
    {
      name: "Jean P.",
      text: "Le poulet yassa est le meilleur que j'ai jamais goûté. Service rapide et personnel très accueillant.",
      rating: 5
    },
    {
      name: "Awa D.",
      text: "Un endroit parfait pour manger en famille. Les portions sont généreuses et les prix raisonnables.",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-sm uppercase tracking-widest text-gray-400 mb-4 block">Témoignages</span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Ce que nos clients disent
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
              <p className="font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;