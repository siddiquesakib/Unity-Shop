import {
  Smartphone,
  Laptop,
  Monitor,
  Tv,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  Shirt,
  Footprints,
  ShoppingBag,
  Gem,
  Sofa,
  Utensils,
  Lamp,
  Package,
  HeartPulse,
  Dumbbell,
  BookOpen,
  Baby,
  Apple,
  Bike,
  Briefcase,
  Wrench,
  Sparkles,
} from 'lucide-react';

export const categories = [
  // Electronics
  { name: 'Mobile Phones', icon: Smartphone },
  // { name: 'Laptops', icon: Laptop },
  // { name: 'Desktop & Monitor', icon: Monitor },
  // { name: 'Television', icon: Tv },
  { name: 'Smart Watch', icon: Watch },
  { name: 'Audio & Headphones', icon: Headphones },
  // { name: 'Cameras', icon: Camera },
  { name: 'Gaming', icon: Gamepad2 },

  // Fashion
  { name: "Men's Fashion", icon: Shirt },
  { name: "Women's Fashion", icon: ShoppingBag },
  { name: 'Shoes & Footwear', icon: Footprints },
  // { name: 'Jewelry', icon: Gem },

  // Home & Living
  // { name: 'Furniture', icon: Sofa },
  { name: 'Kitchen & Dining', icon: Utensils },
  { name: 'Lighting', icon: Lamp },
  { name: 'Home Decor', icon: Package },

  // Beauty & Health
  { name: 'Beauty & Skincare', icon: Sparkles },
  { name: 'Health Care', icon: HeartPulse },

  // Sports & Outdoor
  { name: 'Sports Equipment', icon: Dumbbell },
  { name: 'Outdoor & Cycling', icon: Bike },

  // Books & Office
  { name: 'Books', icon: BookOpen },
  { name: 'Office Supplies', icon: Briefcase },

  // Baby & Grocery
  { name: 'Baby & Toys', icon: Baby },
  { name: 'Groceries', icon: Apple },

  // Tools
  { name: 'Tools & Hardware', icon: Wrench },
];
