import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Stock photos from Unsplash (allowed in next.config remotePatterns).
// These are placeholders — replace with real photos of each car via the admin panel.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=80`;

type Seed = {
  make: string;
  model: string;
  variant?: string;
  year: number;
  regYear?: string;
  mileage: number;
  price: number;
  doors?: number;
  seats?: number;
  previousOwners?: number;
  bootSpace?: number;
  taxPerYear?: number;
  insuranceGroup?: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  colour: string;
  engineSize?: string;
  ulez?: boolean;
  motMonths?: number;
  serviceHistory?: string;
  description: string;
  conditionNotes?: string;
  status?: string;
  featured?: boolean;
  features: string[];
  images: string[];
};

// MIA Automotive current stock. Specs are sensible estimates for the
// plate/model — adjust mileage, price, trim and colour in the admin panel.
const CARS: Seed[] = [
  {
    make: "BMW",
    model: "5 Series",
    variant: "520d M Sport",
    year: 2018,
    regYear: "68",
    mileage: 68400,
    price: 13995,
    doors: 4,
    seats: 5,
    previousOwners: 2,
    bootSpace: 530,
    taxPerYear: 190,
    insuranceGroup: 34,
    fuelType: "Diesel",
    transmission: "Automatic",
    bodyType: "Saloon",
    colour: "Grey",
    engineSize: "2.0L",
    ulez: true,
    motMonths: 10,
    serviceHistory: "Full service history",
    featured: true,
    description:
      "A superb executive saloon combining effortless motorway refinement with genuine economy. The 520d M Sport looks the part with its sports styling and delivers a smooth, automatic drive. Well looked after and ready to go.",
    conditionNotes:
      "Excellent condition for the age and mileage. A couple of light marks consistent with normal use.",
    features: [
      "M Sport Pack",
      "Sat Nav",
      "Heated front seats",
      "Apple CarPlay",
      "Parking sensors",
      "Cruise control",
      "LED headlights",
      "Dual-zone climate control",
    ],
    images: ["1555215695-3004980ad54e", "1503376780353-7e6692767b70"],
  },
  {
    make: "Mercedes-Benz",
    model: "E-Class",
    variant: "E220d AMG Line",
    year: 2017,
    regYear: "67",
    mileage: 72100,
    price: 14495,
    doors: 4,
    seats: 5,
    previousOwners: 2,
    bootSpace: 540,
    taxPerYear: 190,
    insuranceGroup: 40,
    fuelType: "Diesel",
    transmission: "Automatic",
    bodyType: "Saloon",
    colour: "Black",
    engineSize: "2.0L",
    ulez: true,
    motMonths: 9,
    serviceHistory: "Full service history",
    featured: true,
    description:
      "The E-Class is the benchmark for comfort and quality in its class. This E220d AMG Line pairs a refined, economical diesel with the smooth 9G automatic gearbox and a beautifully appointed cabin. A genuinely relaxing car to cover miles in.",
    conditionNotes:
      "Very good condition throughout. Minor wheel scuff to one alloy.",
    features: [
      "AMG Line",
      "Sat Nav",
      "Reversing camera",
      "Heated seats",
      "Leather upholstery",
      "Apple CarPlay",
      "Keyless go",
      "Ambient lighting",
    ],
    images: ["1617531653332-bd46c24f2068", "1583121274602-3e2820c69888"],
  },
  {
    make: "Ford",
    model: "Fiesta",
    variant: "1.1 Zetec",
    year: 2017,
    regYear: "67",
    mileage: 41200,
    price: 6995,
    doors: 5,
    seats: 5,
    previousOwners: 1,
    bootSpace: 292,
    taxPerYear: 165,
    insuranceGroup: 7,
    fuelType: "Petrol",
    transmission: "Manual",
    bodyType: "Hatchback",
    colour: "White",
    engineSize: "1.1L",
    ulez: true,
    motMonths: 11,
    serviceHistory: "Full service history",
    description:
      "The UK's favourite supermini for good reason. This low-mileage 1.1 Zetec is economical, cheap to run and great to drive — the ideal first car or city runabout. One owner from new with a full service history.",
    features: [
      "Apple CarPlay",
      "DAB radio",
      "Air conditioning",
      "Bluetooth",
      "Cruise control",
      "Alloy wheels",
    ],
    images: ["1571607388263-1044f9ea01dd", "1503736334956-4c8f8e92946d"],
  },
  {
    make: "Ford",
    model: "Fiesta",
    variant: "1.0 EcoBoost Zetec S",
    year: 2013,
    regYear: "63",
    mileage: 76500,
    price: 4295,
    doors: 3,
    seats: 5,
    previousOwners: 3,
    bootSpace: 290,
    taxPerYear: 20,
    insuranceGroup: 9,
    fuelType: "Petrol",
    transmission: "Manual",
    bodyType: "Hatchback",
    colour: "Blue",
    engineSize: "1.0L",
    ulez: true,
    motMonths: 8,
    serviceHistory: "Part service history",
    description:
      "Ford's award-winning 1.0 EcoBoost engine delivers surprising punch with excellent fuel economy. The Zetec S adds sporty looks inside and out. A fun, frugal and affordable hatch that's ready for the road.",
    conditionNotes:
      "Good honest condition. Some age-related stone chips to the bonnet.",
    features: [
      "EcoBoost engine",
      "Sports styling",
      "Air conditioning",
      "DAB radio",
      "Bluetooth",
      "Alloy wheels",
    ],
    images: ["1552519507-da3b142c6e3d", "1494976388531-d1058494cdd8"],
  },
  {
    make: "Vauxhall",
    model: "Corsa",
    variant: "1.4 SE",
    year: 2015,
    regYear: "15",
    mileage: 58300,
    price: 4495,
    doors: 5,
    seats: 5,
    previousOwners: 2,
    bootSpace: 285,
    taxPerYear: 35,
    insuranceGroup: 11,
    fuelType: "Petrol",
    transmission: "Manual",
    bodyType: "Hatchback",
    colour: "Red",
    engineSize: "1.4L",
    ulez: true,
    motMonths: 7,
    serviceHistory: "Part service history",
    description:
      "A practical and economical five-door supermini that's easy to live with and cheap to run. This 1.4 SE is well equipped and well maintained — a sensible, reliable choice for everyday driving.",
    features: [
      "Air conditioning",
      "Cruise control",
      "Bluetooth",
      "DAB radio",
      "Alloy wheels",
      "Electric windows",
    ],
    images: ["1549317661-bd32c8ce0db2", "1485291571150-772bcfc10da5"],
  },
];

async function main() {
  console.log("🌱 Seeding database…");

  // Clean slate (children cascade).
  await prisma.enquiry.deleteMany();
  await prisma.car.deleteMany();

  for (const c of CARS) {
    await prisma.car.create({
      data: {
        make: c.make,
        model: c.model,
        variant: c.variant,
        year: c.year,
        regYear: c.regYear,
        mileage: c.mileage,
        price: c.price,
        doors: c.doors,
        seats: c.seats,
        previousOwners: c.previousOwners,
        bootSpace: c.bootSpace,
        taxPerYear: c.taxPerYear,
        insuranceGroup: c.insuranceGroup,
        fuelType: c.fuelType,
        transmission: c.transmission,
        bodyType: c.bodyType,
        colour: c.colour,
        engineSize: c.engineSize,
        ulez: c.ulez ?? true,
        motMonths: c.motMonths,
        serviceHistory: c.serviceHistory,
        description: c.description,
        conditionNotes: c.conditionNotes,
        status: c.status ?? "available",
        featured: c.featured ?? false,
        features: { create: c.features.map((name) => ({ name })) },
        images: {
          create: c.images.map((id, i) => ({
            url: img(id),
            isMain: i === 0,
            order: i,
          })),
        },
      },
    });
  }

  // A couple of sample enquiries for the admin inbox.
  const bmw = await prisma.car.findFirst({ where: { make: "BMW" } });
  await prisma.enquiry.create({
    data: {
      name: "James Wilson",
      email: "james.wilson@example.com",
      phone: "07700 900123",
      message:
        "Hi, is the BMW 520d still available? I'd love to arrange a viewing this weekend if possible.",
      carId: bmw?.id ?? null,
      status: "new",
    },
  });
  await prisma.enquiry.create({
    data: {
      name: "Sophie Clarke",
      email: "sophie.clarke@example.com",
      message: "Do you take part exchanges? I have a 2017 Vauxhall Corsa.",
      status: "read",
    },
  });

  const count = await prisma.car.count();
  console.log(`✅ Seeded ${count} cars and 2 enquiries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
