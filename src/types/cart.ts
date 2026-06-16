export interface BackendMenu {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
}

export interface BackendCartItemDetail {
  id: number;
  menu: BackendMenu;
  quantity: number;
  itemTotal: number;
}

export interface BackendRestaurantGroup {
  restaurant: {
    id: number;
    name: string;
    logo: string;
  };
  items: BackendCartItemDetail[];
  subtotal: number;
}

export interface BackendCartSummary {
  totalItems: number;
  totalPrice: number;
  restaurantCount: number;
}

// This represents the structure sitting inside your raw query cache
export interface BackendCartDataResponse {
  cart: BackendRestaurantGroup[];
  summary: BackendCartSummary;
}

export interface CartResponse {
  success: boolean;
  data: BackendCartDataResponse;
}
