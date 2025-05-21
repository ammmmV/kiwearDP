// User types
export interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
  }
  
  // Product types
  export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    imageUrl: string;
    price: number;
  }
  
  export interface Fabric {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    inStock: boolean;
  }
  
  export interface Accessory {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    inStock: boolean;
  }
  
  // Order types
  export interface Measurement {
    height: number;
    chest: number;
    waist: number;
    hips: number;
    inseam: number;
    shoulders: number;
    sleeves: number;
    [key: string]: number;
  }
  
  export interface OrderItem {
    productId: string;
    fabricId: string;
    accessories: string[];
    measurements: Measurement;
    quantity: number;
    price: number;
  }
  
  export interface Order {
    id: string;
    userId: string;
    items: OrderItem[];
    totalPrice: number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    createdAt: string;
  }
  
  // Review types
  export interface Review {
    id: string;
    userId: string;
    productId: string;
    rating: number;
    comment: string;
    createdAt: string;
    approved: boolean;
  }
  
  // Pattern types
  export interface Pattern {
    id: string;
    productId: string;
    name: string;
    imageUrl: string;
    fileUrl: string;
    price: number;
  }