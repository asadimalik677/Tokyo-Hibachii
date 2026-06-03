export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  specialRequest: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number | string;
  description: string;
  tags: string[]; // e.g. "Spicy", "Vegetarian", "Gluten-Free", "Chef's Special"
  image?: string;
}

export interface ChefShow {
  id: string;
  title: string;
  japaneseTitle: string;
  description: string;
  visualGlow: string; // colors like orange, red, gold
  interactiveSizzleText: string;
}

export interface ForumReply {
  id: string;
  author: string;
  avatarText: string;
  content: string;
  date: string;
}

export interface ForumPost {
  id: string;
  category: string;
  author: string;
  avatarText: string;
  title: string;
  content: string;
  date: string;
  likes: number;
  replies: ForumReply[];
}

