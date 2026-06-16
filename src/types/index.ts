export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  username?: string;
  headline?: string;
  avatarUrl?: string;
}

export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface Restaurant {
  id: string | number;
  name: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  category?: string;
  image?: string;
  description?: string;
}

export interface RestaurantResponse {
  success: boolean;
  message: string;
  data: {
    restaurants: Restaurant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface Menu {
  id: number;
  food_name: string;
  price: number;
  type: string; // e.g., 'makanan', 'minuman', 'snack'
  resto_id: number;
}

// 1. Individual Menu Item Structure
export interface ApiMenuItem {
  id: number;
  foodName: string; // Matches camelCase "foodName" from JSON
  price: number;
  type: 'food' | 'drink';
  image: string; // Matches "image" from JSON
}

// 2. Individual Review Structure
export interface ReviewUser {
  id: number;
  name: string;
  avatar: string | null;
}

export interface ReviewItem {
  id: number;
  star: number;
  comment: string | null;
  createdAt: string;
  user: ReviewUser;
}

// 3. Main Restaurant Detail Structure
export interface RestaurantDetail {
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  coordinates: {
    lat: number;
    long: number;
  };
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus: ApiMenuItem[]; // Array containing the menu items
  reviews: ReviewItem[]; // Array containing customer reviews
}

// 4. Global API Envelope Wrapper Structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface RestaurantListItem {
  id: number;
  name: string;
  star: number;
  place: string; // Properti lokasi dari API Anda
  logo: string;
  images: string[]; // Sekarang berbentuk array string URL
  category: string;
  reviewCount: number;
  menuCount: number;
  priceRange: {
    min: number;
    max: number;
  };
}

export interface RestaurantListResponse {
  restaurants: RestaurantListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface NestedMenu {
  id: number;
  foodName: string;
  price: number;
  image: string;
}

export interface SearchRestaurantResult {
  id: number;
  name: string;
  star: number;
  place: string;
  lat: number;
  lng: number;
  image?: string;
  cuisineType?: string;
  menus?: NestedMenu[];
  Menu?: NestedMenu[];
}

export interface ExtractedMenuWithContext extends NestedMenu {
  restaurantId: number;
  restaurantName: string;
}

export interface UserAddress {
  id: string;
  label: string; // Contoh: "Rumah Utama", "Kantor", "Kos"
  receiverName: string;
  phone: string;
  fullAddress: string;
  isDefault: boolean;
}

// Checkout
export interface PriceReceiptCardProps {
  itemCount: number;
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  grandTotal: number;
  isDisable: boolean;
  isSubmitting: boolean;
  onPayConfirm: () => void;
}

// footer
export interface NavLink {
  name: string;
  href: string;
}

export interface FooterLinksColProps {
  title: string;
  links: NavLink[];
}

export interface SocialItem {
  name: string;
  href: string;
  iconSrc: string;
}
