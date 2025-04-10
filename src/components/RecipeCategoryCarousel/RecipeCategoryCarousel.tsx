import React from 'react';
import Link from 'next/link';
import { 
  FiClock, 
  FiSun, 
  FiHeart, 
  FiClock as FiWatch,
  FiWind,
  FiCoffee,
  FiBookOpen,
  FiFeather,
  FiStar
} from 'react-icons/fi';
import { getCategories, Category } from '@/services/recipes';
import './RecipeCategoryCarousel.css';

// Map category icon strings to actual React components
const iconMap: Record<string, React.ReactNode> = {
  'FiClock': <FiClock className="w-5 h-5 md:w-6 md:h-6" />,
  'FiSun': <FiSun className="w-5 h-5 md:w-6 md:h-6" />,
  'FiHeart': <FiHeart className="w-5 h-5 md:w-6 md:h-6" />,
  'FiWatch': <FiWatch className="w-5 h-5 md:w-6 md:h-6" />,
  'FiWind': <FiWind className="w-5 h-5 md:w-6 md:h-6" />,
  'FiCoffee': <FiCoffee className="w-5 h-5 md:w-6 md:h-6" />,
  'FiBookOpen': <FiBookOpen className="w-5 h-5 md:w-6 md:h-6" />,
  'FiFeather': <FiFeather className="w-5 h-5 md:w-6 md:h-6" />,
  'FiStar': <FiStar className="w-5 h-5 md:w-6 md:h-6" />
};

export async function RecipeCategoryCarousel() {
  // Fetch categories from the database
  const categories = await getCategories();

  return (
    <div className="recipe-category-carousel-container mb-8">
      <h2 className="text-2xl font-semibold mb-4">Browse Categories</h2>
      <div className="recipe-category-carousel">
        <div className="flex space-x-3 py-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Link 
              key={category.slug} 
              href={`/recipes/category/${category.slug}`}
              className="recipe-category-item flex flex-col items-center justify-center min-w-[90px] md:min-w-[100px] w-[90px] md:w-[100px] h-[90px] md:h-[100px] p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="icon-container mb-2 text-blue-500">
                {iconMap[category.icon] || <FiStar className="w-5 h-5 md:w-6 md:h-6" />}
              </div>
              <span className="text-xs md:text-sm font-medium text-center line-clamp-1">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 