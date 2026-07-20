export interface Dish {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  preparationTime: string;
  badges: string[];
  allergens: string[];
  stock: 'available' | 'low' | 'unavailable';
  isSpecial?: boolean;
  discount?: number;
}

export interface WeeklyDay {
  day: string;
  date: string;
  dishes: { name: string; category: string; image: string; price: number }[];
  totalPrice: number;
  available: boolean;
}

export const menuData: {
  dailyMenu: Dish[];
  weeklyMenu: WeeklyDay[];
  categories: { id: string; name: string; slug: string }[];
} = {
  dailyMenu: [
    {
      id: 1,
      name: 'Poulet Yassa',
      description: 'Poulet mariné aux oignons et citron, servi avec du riz blanc',
      category: 'Plats principaux',
      image: '/Plats/IMG_20260628_215543957_AE.webp',
      price: 2500,
      preparationTime: '30 min',
      badges: ['Spécialité'],
      allergens: ['gluten'],
      stock: 'available',
      isSpecial: true,
      discount: 10
    },
    {
      id: 2,
      name: 'Salade Niçoise',
      description: 'Salade fraîche avec thon, œufs, tomates et olives',
      category: 'Entrées',
      image: '/Gallery/fashionable-feminist-african-american-woman-wear-black-tshirt-shorts-posed-restaurant-eat-cheese-cake.webp',
      price: 1200,
      preparationTime: '15 min',
      badges: ['Végétarien'],
      allergens: ['eggs', 'fish'],
      stock: 'available'
    },
    {
      id: 3,
      name: 'Riz Sauce Arachide',
      description: "Riz accompagné d'une sauce onctueuse aux arachides et légumes",
      category: 'Plats principaux',
      image: '/Plats/IMG_20260607_162631098_AE.webp',
      price: 2000,
      preparationTime: '25 min',
      badges: ['Végétarien', 'Spécialité'],
      allergens: ['peanuts'],
      stock: 'low'
    },
    {
      id: 4,
      name: 'Tiramisu Maison',
      description: 'Dessert italien classique au café et mascarpone',
      category: 'Desserts',
      image: '/Plats/IMG_20260628_185117968_AE.webp',
      price: 1000,
      preparationTime: '10 min',
      badges: [],
      allergens: ['gluten', 'dairy', 'eggs'],
      stock: 'available'
    },
    {
      id: 5,
      name: 'Poisson Braisé',
      description: 'Poisson frais grillé avec sauce tomate épicée',
      category: 'Plats principaux',
      image: '/Plats/IMG_20260619_134807356_AE.webp',
      price: 3000,
      preparationTime: '35 min',
      badges: [],
      allergens: ['fish'],
      stock: 'available'
    },
    {
      id: 6,
      name: 'Jus de Bissap',
      description: "Boisson traditionnelle à l'hibiscus, fraîche et sucrée",
      category: 'Boissons',
      image: '/Gallery/stylish-african-woman-red-shirt-hat-posed-indoor-cafe-drinking-pineapple-lemonade.webp',
      price: 500,
      preparationTime: '5 min',
      badges: ['Végétarien', 'Végan'],
      allergens: [],
      stock: 'available'
    }
  ],

  weeklyMenu: [
    {
      day: 'Lundi',
      date: '2026-07-14',
      dishes: [
        {
          name: 'Soupe de légumes',
          category: 'Entrées',
          image: '/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp',
          price: 1000
        },
        {
          name: 'Riz au gras',
          category: 'Plats principaux',
          image: '/Plats/IMG_20260602_155913180_AE.webp',
          price: 2200
        },
        {
          name: 'Banane plantain',
          category: 'Accompagnements',
          image: '/Plats/IMG_20260628_215543957_AE.webp',
          price: 500
        },
        {
          name: 'Fruit de saison',
          category: 'Desserts',
          image: '/Plats/IMG_20260607_162631098_AE.webp',
          price: 600
        }
      ],
      totalPrice: 3800,
      available: true
    },
    {
      day: 'Mardi',
      date: '2026-07-15',
      dishes: [
        {
          name: 'Salade verte',
          category: 'Entrées',
          image: '/Gallery/fashionable-feminist-african-american-woman-wear-black-tshirt-shorts-posed-restaurant-eat-cheese-cake.webp',
          price: 800
        },
        {
          name: 'Poulet DG',
          category: 'Plats principaux',
          image: '/Plats/IMG_20260630_160448385_HDR_AE.webp',
          price: 2800
        },
        {
          name: 'Attiéké',
          category: 'Accompagnements',
          image: '/Plats/IMG_20260619_134807356_AE.webp',
          price: 600
        },
        {
          name: 'Yaourt',
          category: 'Desserts',
          image: '/Plats/IMG_20260628_185117968_AE.webp',
          price: 500
        }
      ],
      totalPrice: 4200,
      available: true
    },
    {
      day: 'Mercredi',
      date: '2026-07-16',
      dishes: [
        {
          name: 'Avocat vinaigrette',
          category: 'Entrées',
          image: '/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp',
          price: 900
        },
        {
          name: 'Spaghetti bolognaise',
          category: 'Plats principaux',
          image: '/Plats/IMG_20260607_162631098_AE.webp',
          price: 2400
        },
        {
          name: 'Pain',
          category: 'Accompagnements',
          image: '/Plats/IMG_20260628_215543957_AE.webp',
          price: 300
        },
        {
          name: 'Crème caramel',
          category: 'Desserts',
          image: '/Plats/IMG_20260628_185117968_AE.webp',
          price: 700
        }
      ],
      totalPrice: 3900,
      available: true
    },
    {
      day: 'Jeudi',
      date: '2026-07-17',
      dishes: [
        {
          name: 'Salade de chou',
          category: 'Entrées',
          image: '/Gallery/stylish-african-woman-red-shirt-hat-posed-indoor-cafe-drinking-pineapple-lemonade.webp',
          price: 800
        },
        {
          name: 'Poisson grillé',
          category: 'Plats principaux',
          image: '/Plats/IMG_20260619_134807356_AE.webp',
          price: 3200
        },
        {
          name: 'Frites de patate',
          category: 'Accompagnements',
          image: '/Plats/IMG_20260602_155913180_AE.webp',
          price: 600
        },
        {
          name: 'Ananas frais',
          category: 'Desserts',
          image: '/Plats/IMG_20260628_215543957_AE.webp',
          price: 600
        }
      ],
      totalPrice: 4600,
      available: true
    },
    {
      day: 'Vendredi',
      date: '2026-07-18',
      dishes: [
        {
          name: 'Salade mixte',
          category: 'Entrées',
          image: '/Gallery/fashionable-feminist-african-american-woman-wear-black-tshirt-shorts-posed-restaurant-eat-cheese-cake.webp',
          price: 1000
        },
        {
          name: 'Riz sauce gombo',
          category: 'Plats principaux',
          image: '/Plats/IMG_20260607_162631098_AE.webp',
          price: 2600
        },
        {
          name: 'Alloco',
          category: 'Accompagnements',
          image: '/Plats/IMG_20260630_160448385_HDR_AE.webp',
          price: 700
        },
        {
          name: 'Gâteau au chocolat',
          category: 'Desserts',
          image: '/Plats/IMG_20260628_185117968_AE.webp',
          price: 900
        }
      ],
      totalPrice: 4700,
      available: true
    },
    {
      day: 'Samedi',
      date: '2026-07-19',
      dishes: [
        {
          name: 'Bruschetta',
          category: 'Entrées',
          image: '/Gallery/interior-shot-cafe-with-chairs-near-bar-with-wooden-tables.webp',
          price: 1200
        },
        {
          name: 'Poulet braisé',
          category: 'Plats principaux',
          image: '/Plats/IMG_20260619_134807356_AE.webp',
          price: 3000
        },
        {
          name: 'Frites',
          category: 'Accompagnements',
          image: '/Plats/IMG_20260602_155913180_AE.webp',
          price: 700
        },
        {
          name: 'Glace',
          category: 'Desserts',
          image: '/Plats/IMG_20260628_215543957_AE.webp',
          price: 1000
        }
      ],
      totalPrice: 5200,
      available: true
    },
    {
      day: 'Dimanche',
      date: '2026-07-20',
      dishes: [
        {
          name: 'Assiette de fruits',
          category: 'Entrées',
          image: '/Gallery/stylish-african-woman-red-shirt-hat-posed-indoor-cafe-drinking-pineapple-lemonade.webp',
          price: 1000
        },
        {
          name: 'Grillade mixte',
          category: 'Plats principaux',
          image: '/Plats/IMG_20260630_160448385_HDR_AE.webp',
          price: 4000
        },
        {
          name: 'Atiéké',
          category: 'Accompagnements',
          image: '/Plats/IMG_20260619_134807356_AE.webp',
          price: 800
        },
        {
          name: 'Salade de fruits',
          category: 'Desserts',
          image: '/Plats/IMG_20260607_162631098_AE.webp',
          price: 800
        }
      ],
      totalPrice: 5900,
      available: true
    }
  ],

  categories: [
    { id: 'entrees', name: 'Entrées', slug: 'entrees' },
    { id: 'plats-principaux', name: 'Plats principaux', slug: 'plats-principaux' },
    { id: 'accompagnements', name: 'Accompagnements', slug: 'accompagnements' },
    { id: 'desserts', name: 'Desserts', slug: 'desserts' },
    { id: 'boissons', name: 'Boissons', slug: 'boissons' }
  ]
}
