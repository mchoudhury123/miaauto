// Centralised business config + controlled vocabularies used across the app.

export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "MIA Automotive",
  phone: process.env.NEXT_PUBLIC_PHONE || "07518 812530",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "447518812530",
  email: process.env.NEXT_PUBLIC_EMAIL || "Miaautomotive1@gmail.com",
  address:
    process.env.NEXT_PUBLIC_ADDRESS ||
    "19 Flagg Court, South Shields, Tyne and Wear, NE33 2LS",
  instagram:
    process.env.NEXT_PUBLIC_INSTAGRAM ||
    "https://www.instagram.com/mia.automotive.ltd/",
  tagline: "Premium used cars, sold with confidence.",
} as const;

export const OPENING_HOURS: { day: string; hours: string }[] = [
  { day: "Monday", hours: "9:00 — 18:00" },
  { day: "Tuesday", hours: "9:00 — 18:00" },
  { day: "Wednesday", hours: "9:00 — 18:00" },
  { day: "Thursday", hours: "9:00 — 18:00" },
  { day: "Friday", hours: "9:00 — 18:00" },
  { day: "Saturday", hours: "10:00 — 17:00" },
  { day: "Sunday", hours: "By appointment" },
];

export const FUEL_TYPES = [
  "Petrol",
  "Diesel",
  "Hybrid",
  "Plug-in Hybrid",
  "Electric",
] as const;

export const TRANSMISSIONS = ["Manual", "Automatic"] as const;

export const BODY_TYPES = [
  "Hatchback",
  "Saloon",
  "Estate",
  "SUV",
  "Coupe",
  "Convertible",
  "MPV",
  "Pickup",
] as const;

export const COLOURS = [
  "Black",
  "White",
  "Silver",
  "Grey",
  "Blue",
  "Red",
  "Green",
  "Orange",
  "Yellow",
  "Brown",
  "Gold",
  "Other",
] as const;

export const DOORS = [2, 3, 4, 5] as const;

export const SEATS = [2, 4, 5, 6, 7, 8] as const;

export const SERVICE_HISTORY = [
  "Full service history",
  "Part service history",
  "First service due",
  "Not specified",
] as const;

export const CAR_STATUS = ["available", "reserved", "sold"] as const;
export type CarStatus = (typeof CAR_STATUS)[number];

export const STATUS_LABELS: Record<CarStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

// Common UK makes for filter dropdowns (free-text is also allowed in admin).
export const POPULAR_MAKES = [
  "Audi",
  "BMW",
  "Ford",
  "Honda",
  "Hyundai",
  "Jaguar",
  "Kia",
  "Land Rover",
  "Lexus",
  "Mercedes-Benz",
  "MINI",
  "Nissan",
  "Porsche",
  "Range Rover",
  "Renault",
  "SEAT",
  "Skoda",
  "Tesla",
  "Toyota",
  "Vauxhall",
  "Volkswagen",
  "Volvo",
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest stock" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "mileage-asc", label: "Lowest mileage" },
  { value: "year-desc", label: "Newest year" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
