import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { Resort } from '../models/Resort.js';
import { User } from '../models/User.js';
import { hashPassword } from '../config/security.js';

const sampleResorts = [
  {
    name: "Muzhappilangad Ocean Beach Sanctuary",
    location: "Muzhappilangad Drive-in Beach, Kannur",
    category: "Beach Resorts",
    rating: 4.9,
    openingHours: "Open 24 Hours",
    description: "Nestled right along Asia’s longest drive-in beach at Muzhappilangad, this oceanfront sanctuary offers uninterrupted views of the Arabian Sea, swaying Malabar coconut palms, traditional coastal Malabar seafood dining, and sunset sea-view verandas.",
    imageUrl: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Muzhappilangad+Drive+in+Beach+Kannur",
    rooms: [
      {
        name: "Arabian Sea View Beachfront Villa",
        description: "Front-row coastal wooden villa featuring traditional Kerala laterite stone accents, open oceanfront veranda, king-size teak bed, and panoramic sunset views over Muzhappilangad waves.",
        imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        capacity: 2,
        amenities: ["Oceanfront Balcony", "Direct Beach Access", "Kerala Breakfast", "Teak Wood Furniture", "High-Speed Wi-Fi"],
        pricePerNight: 8500
      },
      {
        name: "Malabar Heritage Coconut Grove Suite",
        description: "Surrounded by lush swaying coconut plantations, this duplex suite boasts authentic brass Uruli decor, open-air rainwater shower, and breezy sundeck.",
        imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        capacity: 4,
        amenities: ["Coconut Garden View", "Open-air Rain Shower", "2 King Beds", "Tea & Coffee Bar", "Complimentary Evening Snacks"],
        pricePerNight: 12500
      }
    ]
  },
  {
    name: "Payyambalam Cliff & Heritage Retreat",
    location: "Payyambalam Beach Road, Kannur Town",
    category: "Heritage Stays",
    rating: 4.8,
    openingHours: "Open 24 Hours",
    description: "Perched majestically above the Payyambalam coastal cliffs near Kannur lighthouse, this retreat merges colonial North Malabar architecture with tranquil cliff gardens, Ayurvedic rejuvenation treatments, and quick access to St. Angelo Fort.",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Payyambalam+Beach+Kannur+Kerala",
    rooms: [
      {
        name: "Colonial Cliff Ocean Vista Room",
        description: "High wooden ceilings, antique rosewood armchairs, and floor-to-ceiling French doors overlooking the Arabian Sea cliff walkway.",
        imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        capacity: 2,
        amenities: ["Cliff Ocean View", "Colonial Balcony", "Ayurvedic Herbal Toiletries", "Fresh Malabar Tea Station"],
        pricePerNight: 6800
      },
      {
        name: "Royal Malabar Grand Suite",
        description: "An expansive heritage master suite with authentic Thinnai sit-out, handcrafted brass swing (Oonjal), and private dining service with authentic Kannur fish curry and Pathiri.",
        imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
        capacity: 3,
        amenities: ["Private Sit-out with Oonjal", "Arabian Sea Horizon", "Custom Dining Menu", "Jacuzzi"],
        pricePerNight: 11000
      }
    ]
  },
  {
    name: "Kavvayi Backwater Island Sanctuary",
    location: "Kavvayi Backwaters, Payyanur, Kannur",
    category: "Backwater Lodges",
    rating: 4.9,
    openingHours: "6:00 AM – 10:30 PM",
    description: "Settled along the third largest backwaters in Kerala, Kavvayi Backwater Island Sanctuary offers secluded mangrove shores, country boat canoe rides, bird-watching lagoons, and tranquil eco-cottages shaded by wild fruit groves.",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kavvayi+Backwaters+Payyanur+Kannur",
    rooms: [
      {
        name: "Mangrove Lagoon Waterfront Cottage",
        description: "Built using treated sustainable bamboo and terracotta tiles, suspended over the gentle waters with private wooden pier and kayak launch.",
        imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
        capacity: 2,
        amenities: ["Waterfront Pier", "Complimentary Kayaks", "Organic Kerala Meals", "Birding Binoculars Included"],
        pricePerNight: 6200
      },
      {
        name: "Island Kettuvallam Heritage Lodge",
        description: "Traditional thatched Kerala boathouse-style residence with panoramic sliding shutters overlooking the serene Kavvayi estuary.",
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        capacity: 4,
        amenities: ["Estuary Vista", "Sunset Canoe Tour", "2 Queen Beds", "Outdoor Dining Deck"],
        pricePerNight: 9800
      }
    ]
  },
  {
    name: "Theyyam Heritage Culture Village & Ayurvedic Haven",
    location: "Parassinikkadavu, Valapattanam River Basin, Kannur",
    category: "Ayurvedic Retreats",
    rating: 4.8,
    openingHours: "Open 24 Hours",
    description: "Experience the vibrant cultural heart of Kannur near the sacred Muthappan Temple. Discover authentic Nadi astrology, certified Panchakarma Ayurvedic wellness, and guided evening Theyyam ritual performances amidst herbal gardens.",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Parassinikkadavu+Valapattanam+Kannur",
    rooms: [
      {
        name: "Ayurvedic Wellness Nalukettu Cottage",
        description: "Constructed on classic Kerala Vaastu Shastra principles with an interior central courtyard (Nadumuttam), providing calming airflow and herbal aromatic breezes.",
        imageUrl: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
        capacity: 2,
        amenities: ["Ayurvedic Doctor Consultation", "Private Nadumuttam", "Herbal Steam Bath", "Sattvic Cuisine Included"],
        pricePerNight: 7500
      },
      {
        name: "Riverbank Thavalam Family Villa",
        description: "Spacious riverside home with polished red oxide floors, brass oil lamps (Nilavilakku), and a garden hammock facing the Valapattanam river ferry.",
        imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
        capacity: 4,
        amenities: ["River View", "Theyyam Cultural Walk Guided", "2 Attached Baths", "Traditional Kerala Kitchenette"],
        pricePerNight: 10500
      }
    ]
  },
  {
    name: "Thottada Coconut Lagoon Eco Haven",
    location: "Thottada Beach, Kannur",
    category: "Beach Resorts",
    rating: 4.7,
    openingHours: "7:00 AM – 11:00 PM",
    description: "Where the freshwater Thottada river calmly merges into the golden Arabian Sea sands. A secluded eco-friendly haven with coconut frond canopies, pristine swimming beach, and hammock trails.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Thottada+Beach+Kannur",
    rooms: [
      {
        name: "Secluded Lagoon Sandy Chalet",
        description: "Step off your private wooden deck straight onto the tranquil sands of Thottada. Features solar-powered warm showers and natural coir furnishings.",
        imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
        capacity: 2,
        amenities: ["Lagoon & Beach Front", "Coir Hammock", "Organic Breakfast", "Solar Powered"],
        pricePerNight: 5400
      }
    ]
  },
  {
    name: "Paithalmala Mist Valley Hill Resort",
    location: "Paithalmala Hills, Kudiyanmala, Kannur",
    category: "Hill Resorts",
    rating: 4.8,
    openingHours: "6:00 AM – 10:30 PM",
    description: "Escape the coastal warmth at Kannur's highest hill station (4,500 ft above sea level). Paithalmala Mist Valley offers sweeping views of the Western Ghats mountain ridges, trekking trails, coffee estate aromas, and misty morning breezes.",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Paithalmala+Kannur+Kerala",
    rooms: [
      {
        name: "Highland Forest View Chalet",
        description: "Stone and cedar cottage built on the hillside edge with private balcony peering directly into rolling clouds and deep Kodagu valley borders.",
        imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        capacity: 2,
        amenities: ["Valley Cloud View", "Campfire Deck", "Trekking Guide Arranged", "Estate Fresh Coffee Bar"],
        pricePerNight: 4900
      },
      {
        name: "Paithal Panorama Family Lodge",
        description: "Two-bedroom mountain hideaway featuring a living fireplace, glass conservatory, and panoramic sunrise deck.",
        imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80",
        capacity: 4,
        amenities: ["360 Mountain Ridge Vista", "Fireplace", "Barbecue Setup", "Trek Map & Walking Sticks"],
        pricePerNight: 8200
      }
    ]
  },
  {
    name: "Dharmadam Island & Estuary Eco Retreat",
    location: "Dharmadam Coast & Anjarakandy River Estuary, Thalassery, Kannur",
    category: "Eco Stays",
    rating: 4.6,
    openingHours: "7:00 AM – 10:00 PM",
    description: "Facing the mysterious green Dharmadam Island and Anjarakandy river mouth. Renowned for low-tide island walks, fresh Malabar Tellicherry pepper culinary experiences, and calm mangrove boat safaris.",
    imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dharmadam+Island+Thalassery+Kannur",
    rooms: [
      {
        name: "Island View Estuary Cottage",
        description: "Tranquil room with panoramic river-meets-ocean sightlines, handcrafted wicker chairs, and morning sightings of kingfishers and sea eagles.",
        imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
        capacity: 2,
        amenities: ["Island & Estuary View", "Low Tide Walking Tour", "Thalassery Biryani Dining", "Wi-Fi"],
        pricePerNight: 4600
      }
    ]
  },
  {
    name: "The Malabar Crown Grand Hotel & Suites",
    location: "South Bazaar, Near St. Angelo Fort, Kannur City",
    category: "Luxury Stays",
    rating: 4.8,
    openingHours: "Open 24 Hours",
    description: "The premier luxury business and leisure landmark of Kannur. Situated minutes from St. Angelo Fort and Kannur Railway Station, boasting rooftop infinity pool overlooking the city coastline, fine Malabar multi-cuisine restaurants, and modern hospitality.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=St+Angelo+Fort+Kannur+Kerala",
    rooms: [
      {
        name: "Executive Grand Coastal Suite",
        description: "Sophisticated modern suite featuring Italian marble bath, dedicated work desk, smart entertainment console, and expansive views of the Kannur coastline.",
        imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        capacity: 2,
        amenities: ["Rooftop Pool Access", "Buffet Breakfast", "Airport Transfer", "Fort Heritage Tour Shuttle", "Mini Bar"],
        pricePerNight: 7900
      },
      {
        name: "Presidential Royal Malabar Suite",
        description: "Lavish top-floor suite with expansive living lounge, private dining table, Jacuzzi bath, and dedicated concierge.",
        imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
        capacity: 3,
        amenities: ["Private Jacuzzi", "Dedicated Butler", "City & Sea Skyline", "Complimentary High Tea"],
        pricePerNight: 16500
      }
    ]
  }
];

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('Error: MONGODB_URI is required to run seed script.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('Connected!');

    // 1. Idempotently clear existing resorts to prevent duplicate entries
    console.log('Clearing old sample resorts...');
    await Resort.deleteMany({});

    // 2. Insert fresh sample resorts
    console.log(`Inserting ${sampleResorts.length} curated Kannur resorts...`);
    const inserted = await Resort.insertMany(sampleResorts);
    console.log(`Successfully seeded ${inserted.length} resorts into MongoDB!`);

    // 3. Ensure a default demo admin user exists safely
    const adminEmail = 'admin@resorthub.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      console.log('Creating default administrator account...');
      const adminPasswordHash = await hashPassword('AdminPass123!');
      await User.create({
        name: 'ResortHub Admin',
        email: adminEmail,
        passwordHash: adminPasswordHash,
        role: 'admin',
      });
      console.log(`Admin account created: ${adminEmail} (Password: AdminPass123!)`);
    } else {
      console.log(`Admin account already exists: ${adminEmail}`);
    }

    console.log('Database seeding complete!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
