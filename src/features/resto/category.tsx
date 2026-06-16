'use client';

import { useState } from 'react';
import { CategoryCard } from '@/components/shared/categoryCard';
import { useAuthStore } from '@/store/useAuthStore';

// 1. Tipe data 'icon' sekarang menjadi string path
interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  isPrivate?: boolean;
}

// 2. Mock data disesuaikan dengan file gambar Anda di dalam folder public/
const MOCK_CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All Restaurant', icon: '/icon-all-food.png' },
  { id: 'nearby', name: 'Nearby', icon: '/icon-location.png' },
  { id: 'discount', name: 'Discount', icon: '/icon-disc.png', isPrivate: true }, // Terkunci khusus login
  { id: 'best-seller', name: 'Best Seller', icon: '/icon-best-seller.png' },
  {
    id: 'delivery',
    name: 'Delivery',
    icon: '/icon-delivery.png',
    isPrivate: true,
  }, // Terkunci khusus login
  { id: 'lunch', name: 'Lunch', icon: '/icon-lunch.png' },
];

interface CategoryListProps {
  onCategoryChange?: (categoryId: string) => void;
}

export function CategoryList({ onCategoryChange }: CategoryListProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  // 3. Ambil state status login secara reaktif dari Zustand
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    if (onCategoryChange) {
      onCategoryChange(id);
    }
  };

  const visibleCategories = MOCK_CATEGORIES.filter(
    (category) => !category.isPrivate || isLoggedIn
  );

  return (
    <div className='w-full overflow-x-auto no-scrollbar py-4 mb-6'>
      <div className='flex items-center justify-start md:justify-between gap-4 min-w-max px-2'>
        {visibleCategories.map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            iconPath={category.icon}
            isActive={activeCategory === category.id}
            onClick={() => handleCategoryClick(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
