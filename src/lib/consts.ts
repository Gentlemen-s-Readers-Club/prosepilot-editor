import { Status } from "../store/types";
import { getPaddleConfig } from "./paddle-config";

export const BOOK_STATES: Record<Status, string> = {
  'writing': 'Writing',
  'draft': 'Draft', 
  'reviewing': 'Reviewing',
  'published': 'Published',
  'archived': 'Archived',
  'error': 'Error'
};

export type Plan = {
  id: string;
  name: string;
  price: number;
  icon: string;
  color: string;
  description: string;
  features: string[];
  credits: number;
  priceId: string;
  isPopular?: boolean;
  comingSoon?: boolean;
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    credits: 15, // 3 book
    icon: 'FileText',
    color: "bg-state-success",
    description: "Perfect for hobbyists and first-time authors",
    features: [
      "15 credits/month (3 books)",
      "Basic genre selection",
      "Multiple languages supported",
      "AI-generated outline + simple chapter flow",
      "Plot and character consistency checker",
      "Export to ePub",
      "Community support",
    ],
    priceId: getPaddleConfig().subscriptionPrices.starter,
  },
  {
    id: "pro",
    name: "Pro Author",
    price: 29,
    credits: 55, // 11 books
    icon: 'Crown',
    color: "bg-state-info",
    description: "For aspiring writers ready to go deeper",
    features: [
      "55 credits/month (11 books)",
      "All Starter features",
      "Unlock more genres",
      "Advanced book properties: narrator, tone, style",
      "Export to PDF, ePub, and Docx formats",
      "Annotations system",
      "Priority email support",
    ],
    priceId: getPaddleConfig().subscriptionPrices.pro,
    isPopular: true,
  },
  {
    id: "studio",
    name: "Studio",
    price: 79,
    credits: 160, // 32 books
    icon: 'Users',
    color: "bg-state-warning",
    description: "For professionals and small studios",
    features: [
      "160 credits/month (32 books)",
      "All Pro features",
      'Advanced Metadata management',
      "Team access (up to 3 users)",
      'More features coming soon'
    ],
    priceId: getPaddleConfig().subscriptionPrices.studio,
    comingSoon: true,
  },
];