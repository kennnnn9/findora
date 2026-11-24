export interface ProductSeed {
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
}

export const sampleProducts: ProductSeed[] = [
  // --- Category 1: Electronics (12 products) ---
  {
    name: "Aura Noise-Canceling Wireless Headphones",
    category: "Electronics",
    description: "Premium over-ear wireless headphones featuring adaptive active noise cancellation, high-fidelity 40mm drivers, 35-hour battery life, and ultra-plush memory foam earcups.",
    price: 249.99,
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Pulse Smart Fitness Watch",
    category: "Electronics",
    description: "Sleek smartwatch with continuous heart rate monitoring, blood oxygen tracking, GPS, 5ATM water resistance, and crisp AMOLED always-on touchscreen.",
    price: 179.99,
    stock: 42,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Apex 4K Ultra HD Action Camera",
    category: "Electronics",
    description: "Rugged waterproof action camera recording cinema-grade 4K at 60fps with 6-axis gyro stabilization, dual color displays, and deep waterproof casing up to 40 meters.",
    price: 199.50,
    stock: 28,
    image_url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Tactile Pro Mechanical Gaming Keyboard",
    category: "Electronics",
    description: "Compact 75% mechanical keyboard featuring hot-swappable custom tactile switches, sound-dampening silicone pads, per-key RGB backlighting, and braided USB-C cable.",
    price: 129.99,
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "ErgoGlide Precision Wireless Mouse",
    category: "Electronics",
    description: "Sculpted ergonomic vertical mouse designed to relieve wrist strain, with hyper-fast dual-mode scrolling, 4000 DPI sensor, and silent acoustic clicks.",
    price: 69.95,
    stock: 65,
    image_url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "SoundWave Portable Bluetooth Speaker",
    category: "Electronics",
    description: "Compact 360-degree cylindrical speaker with deep bass radiators, IPX7 waterproof rating, 20-hour playback, and stereo party-pairing capability.",
    price: 89.00,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Nexus 8-in-1 USB-C Aluminum Hub",
    category: "Electronics",
    description: "High-speed multi-port adapter featuring 4K 60Hz HDMI, 100W Power Delivery pass-through, dual USB 3.2 ports, SD/microSD card reader, and Gigabit Ethernet.",
    price: 49.99,
    stock: 80,
    image_url: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "MagZen 3-in-1 Wireless Charging Stand",
    category: "Electronics",
    description: "Magnetic wireless charging station simultaneously powering your phone, earbuds, and smartwatch with weighted aluminum alloy base and fast 15W Qi2 output.",
    price: 79.99,
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "AirBeat True Wireless Earbuds",
    category: "Electronics",
    description: "Featherlight in-ear buds with hybrid active noise cancellation, transparency audio mode, wireless charging case, and IPX5 sweat-proof resistance.",
    price: 119.00,
    stock: 55,
    image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Lumina Touchscreen Minimalist Desk Lamp",
    category: "Electronics",
    description: "Architect-grade LED lamp with 5 color temperatures, step-less dimming, memory function, auto-off timer, and built-in USB device charging port.",
    price: 54.90,
    stock: 45,
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "VisionPro 1080p Streaming Webcam",
    category: "Electronics",
    description: "Full HD streaming webcam with wide-angle glass lens, autofocus, dual omnidirectional stereo microphones, and physical magnetic privacy shutter.",
    price: 64.99,
    stock: 38,
    image_url: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "VoltMax 20,000mAh 65W Power Bank",
    category: "Electronics",
    description: "Heavy-duty laptop-grade portable battery pack with 65W USB-C PD fast charging, digital percentage display, and multi-device fast charging.",
    price: 74.50,
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80"
  },

  // --- Category 2: Home & Kitchen (12 products) ---
  {
    name: "Artisan Gooseneck Electric Pour-Over Kettle",
    category: "Home & Kitchen",
    description: "Precise temperature-controlled kettle with slender gooseneck spout for optimal pour-over coffee flow, LCD display, and 60-minute keep-warm mode.",
    price: 119.95,
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Cast Iron Enameled Dutch Oven 5.5 Qt",
    category: "Home & Kitchen",
    description: "Heirloom-grade heavy enameled cast iron Dutch oven with self-basting lid, oven-safe up to 500°F, ideal for braising, slow-cooking stews, and baking sourdough.",
    price: 139.00,
    stock: 22,
    image_url: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Nordic Cold Brew Glass Coffee Maker",
    category: "Home & Kitchen",
    description: "Durable borosilicate glass cold brew carafe with ultra-fine stainless steel mesh infuser, silicone non-slip base, and airtight freshness seal.",
    price: 36.99,
    stock: 45,
    image_url: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Damascus Steel 8-Inch Japanese Chef Knife",
    category: "Home & Kitchen",
    description: "Hand-forged 67-layer Japanese Damascus steel chef knife with pakkawood ergonomic handle, razor-sharp 15-degree edge, and wooden blade sheath.",
    price: 145.00,
    stock: 18,
    image_url: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Terra Ceramic Non-Stick Skillet 10-Inch",
    category: "Home & Kitchen",
    description: "Eco-friendly non-toxic mineral ceramic coating skillet free of PTFE and PFOA, with stainless steel stay-cool handle and induction-ready base.",
    price: 58.50,
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "VelvetFoam Automatic Electric Milk Frother",
    category: "Home & Kitchen",
    description: "Multi-functional frother creating warm thick foam, airy foam, heated milk, or cold foam in under 2 minutes with whisper-quiet magnetic motor.",
    price: 45.00,
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Organic Bamboo End-Grain Cutting Board Set",
    category: "Home & Kitchen",
    description: "Set of 3 reversible antimicrobial organic bamboo cutting boards with deep juice groove perimeter and built-in side carry handles.",
    price: 39.99,
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Double-Walled Borosilicate Espresso Glasses (4-Pack)",
    category: "Home & Kitchen",
    description: "Thermal insulated double-wall drinking glasses that keep espresso hot while staying cool to touch, crafted from lightweight mouth-blown glass.",
    price: 28.00,
    stock: 75,
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Brushed Stainless Steel Gravity Salt & Pepper Grinders",
    category: "Home & Kitchen",
    description: "Electric one-hand tilt-activated ceramic spice grinders with adjustable coarseness and soft LED illumination light.",
    price: 34.99,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "CrispWave Compact Digital Air Fryer 4 Qt",
    category: "Home & Kitchen",
    description: "High-efficiency rapid air convection cooker with digital touchscreen presets, nonstick dishwasher-safe basket, and crisping plate.",
    price: 89.99,
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Airtight Glass Food Storage Containers (Set of 8)",
    category: "Home & Kitchen",
    description: "Thermal shock-resistant borosilicate food prep containers with leak-proof snap-locking bamboo lids, safe for microwave, oven, and freezer.",
    price: 49.95,
    stock: 55,
    image_url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Handcrafted White Marble Hexagonal Coasters (Set of 6)",
    category: "Home & Kitchen",
    description: "Natural polished white Carrara marble drink coasters with brass inlay accent line and protective cork backing pads.",
    price: 24.50,
    stock: 65,
    image_url: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80"
  },

  // --- Category 3: Fashion & Apparel (12 products) ---
  {
    name: "Pure Mongolian Cashmere Crewneck Sweater",
    category: "Fashion & Apparel",
    description: "Exceptionally soft 100% grade-A 2-ply Mongolian cashmere sweater with ribbed cuffs and hem, timeless silhouette, and featherlight warmth.",
    price: 165.00,
    stock: 20,
    image_url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Urban Explorer Waterproof Commuter Backpack",
    category: "Fashion & Apparel",
    description: "Weatherproof 25L roll-top commuter pack with padded 16-inch laptop compartment, hidden security passport pocket, and magnetic Fidlock buckles.",
    price: 110.00,
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Heavy-Duty Waxed Canvas Vintage Tote",
    category: "Fashion & Apparel",
    description: "Rugged 18oz water-resistant waxed cotton canvas tote bag with full-grain vegetable-tanned leather shoulder handles and solid brass hardware.",
    price: 78.00,
    stock: 45,
    image_url: "https://images.unsplash.com/photo-1614179689702-355944cd0918?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Organic French Terry Relaxed Hoodie",
    category: "Fashion & Apparel",
    description: "Ultra-heavyweight 450 GSM combed organic cotton fleece pullover hoodie with double-layer hood, kangaroo pocket, and preshrunk structure.",
    price: 85.00,
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Classic Polarized Acetate Wayfarer Sunglasses",
    category: "Fashion & Apparel",
    description: "Handcrafted Italian bio-acetate frame with polarized category-3 UV400 scratch-resistant lenses and 5-barrel stainless steel hinges.",
    price: 95.00,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Minimalist Full-Grain Leather Bifold Wallet",
    category: "Fashion & Apparel",
    description: "Slim profile wallet crafted from vegetable-tanned Italian leather with RFID protection shield, 6 card slots, and full-length cash slot.",
    price: 48.00,
    stock: 70,
    image_url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Essential Heavyweight Boxy T-Shirt",
    category: "Fashion & Apparel",
    description: "Vintage-inspired 240 GSM combed cotton tee featuring dropped shoulders, wide rib collar, and relaxed boxy streetwear drape.",
    price: 32.00,
    stock: 90,
    image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Merino Wool Breathable Athletic Ankle Socks (3-Pack)",
    category: "Fashion & Apparel",
    description: "Seamless performance socks woven from natural moisture-wicking merino wool with arch support compression band and reinforced toe and heel.",
    price: 26.00,
    stock: 80,
    image_url: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Ribbed 100% Merino Wool Beanie",
    category: "Fashion & Apparel",
    description: "Non-scratchy extra-fine merino wool watch cap beanie with adjustable fold-over cuff for breathable thermal winter warmth.",
    price: 38.00,
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "AeroShield Water-Resistant Packable Windbreaker",
    category: "Fashion & Apparel",
    description: "Featherweight ripstop nylon technical shell with DWR finish, zippered vents, elasticized storm cuffs, and packable pocket pouch.",
    price: 92.00,
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Heritage Low-Top Vulcanized Canvas Sneakers",
    category: "Fashion & Apparel",
    description: "Classic court sneakers made with durable organic canvas upper, cushioned OrthoLite insole, and vulcanized gum rubber waffle tread.",
    price: 68.00,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Chronograph Sapphire Stainless Steel Watch",
    category: "Fashion & Apparel",
    description: "Sophisticated 41mm timepiece with scratch-proof sapphire crystal glass, Japanese quartz movement, dual subdials, and quick-release mesh strap.",
    price: 185.00,
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80"
  },

  // --- Category 4: Health & Wellness (12 products) ---
  {
    name: "HyperRelief Percussion Deep Tissue Massage Gun",
    category: "Health & Wellness",
    description: "Professional brushless motor massage device delivering 12mm amplitude stroke depth, 5 interchangeable therapy heads, and quiet acoustic gliding.",
    price: 139.99,
    stock: 28,
    image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Natural Tree Rubber Non-Slip Yoga Mat",
    category: "Health & Wellness",
    description: "Eco-friendly 5mm thick mat made from sustainably harvested biodegradable rubber with polyurethane surface for superior sweat grip.",
    price: 88.00,
    stock: 35,
    image_url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Serenity Ceramic Ultrasonic Aromatherapy Diffuser",
    category: "Health & Wellness",
    description: "Handcrafted stone ceramic essential oil diffuser with ambient warm LED light, whisper-silent ultrasonic misting, and safety shutoff.",
    price: 52.00,
    stock: 45,
    image_url: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "CalmCore Weighted Gravity Sleep Blanket 15 lbs",
    category: "Health & Wellness",
    description: "Breathable bamboo viscose weighted blanket filled with hypoallergenic micro-glass beads for evenly distributed soothing pressure.",
    price: 99.00,
    stock: 25,
    image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "SonicPro Ceramic Ultrasonic Electric Toothbrush",
    category: "Health & Wellness",
    description: "Sleek matte ceramic sonic toothbrush vibrating at 40,000 strokes/min with 4 brushing modes, smart quad-timer, and induction charging dock.",
    price: 79.00,
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Linen Acupressure Mat and Neck Pillow Set",
    category: "Health & Wellness",
    description: "Holistic wellness set featuring eco-linen cover, coconut fiber padding, and thousands of non-toxic spikes to stimulate circulation and ease tension.",
    price: 59.95,
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "HydroPure Vacuum Insulated Stainless Steel Bottle 32oz",
    category: "Health & Wellness",
    description: "Triple-insulated stainless steel water flask keeping drinks ice-cold for 24 hours or piping hot for 12 hours with leak-proof straw lid.",
    price: 34.50,
    stock: 80,
    image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Organic French Lavender Deep Sleep Pillow Mist",
    category: "Health & Wellness",
    description: "100ml soothing bedtime aromatherapy spray infused with French lavender, Roman chamomile, and vetiver essential oils for deep restorative rest.",
    price: 22.00,
    stock: 90,
    image_url: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Stackable Resistance Bands Strength Workout Set",
    category: "Health & Wellness",
    description: "Set of 5 color-coded natural latex workout tube bands offering up to 150 lbs of resistance, with cushioned handles, ankle straps, and door anchor.",
    price: 35.00,
    stock: 65,
    image_url: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Clarity Blue Light Filtering Computer Glasses",
    category: "Health & Wellness",
    description: "Anti-reflective zero-magnification lenses blocking 90% of harmful digital blue light rays, mounted in ultra-light titanium memory wire frames.",
    price: 44.00,
    stock: 55,
    image_url: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Precision Smart Bio-Impedance Body Scale",
    category: "Health & Wellness",
    description: "Sleek tempered glass scale calculating 13 body metrics including BMI, muscle mass, body fat percentage, and water weight with smartphone sync.",
    price: 49.99,
    stock: 45,
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Ergonomic Contour Memory Foam Cervical Pillow",
    category: "Health & Wellness",
    description: "Therapeutic butterfly contour pillow crafted with slow-rebound CertiPUR-US memory foam and cooling Tencel washable zipper cover.",
    price: 56.00,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80"
  },

  // --- Category 5: Sports & Outdoors (12 products) ---
  {
    name: "Carbon Pro Ultralight Quick-Lock Trekking Poles",
    category: "Sports & Outdoors",
    description: "Pair of 100% 3K carbon fiber hiking poles weighing only 7.8oz each, with quick-cam aluminum locks, natural cork grips, and tungsten carbide tips.",
    price: 79.99,
    stock: 30,
    image_url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Alpine Zero Down 20°F Mummy Sleeping Bag",
    category: "Sports & Outdoors",
    description: "Water-resistant 800-fill power hydrophobic duck down sleeping bag with draft collar, trapezoidal footbox, and ultra-compressible stuff sack.",
    price: 219.00,
    stock: 15,
    image_url: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "CloudLite 2-Person Freestanding Backpacking Tent",
    category: "Sports & Outdoors",
    description: "Double-walled 3-season tent with DAC aluminum poles, silicone-treated ripstop rainfly, dual vestibules, and packaged weight of just 3.3 lbs.",
    price: 279.00,
    stock: 12,
    image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Breeze Double Camping Hammock with Tree Straps",
    category: "Sports & Outdoors",
    description: "Tear-resistant 210T parachute nylon hammock supporting up to 500 lbs, with two 10-foot multi-loop tree-friendly straps and wiregate carabiners.",
    price: 39.95,
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Quick-Dry Antimicrobial Microfiber Camp Towel",
    category: "Sports & Outdoors",
    description: "Compact travel towel absorbing 4x its weight in water, drying 3x faster than cotton, with hanging snap loop and mesh breathable travel bag.",
    price: 18.50,
    stock: 85,
    image_url: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "BeamMax 1000 Lumen USB-C Rechargeable Headlamp",
    category: "Sports & Outdoors",
    description: "Weatherproof IPX8 LED head torch featuring 5 light modes, 60-degree tilt mechanism, red night-vision LED, and reflective headband.",
    price: 42.00,
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Hard-Anodized Aluminum Nesting Camp Cook Set",
    category: "Sports & Outdoors",
    description: "Non-stick lightweight 4-piece camping pot and frying pan set with folding heat-resistant silicone handles and nylon storage sack.",
    price: 49.99,
    stock: 40,
    image_url: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "HydraPack 2L Leak-Proof Water Bladder",
    category: "Sports & Outdoors",
    description: "BPA-free hiking hydration reservoir with wide-slide opening for easy cleaning, insulated drink tube, and high-flow auto-shutoff bite valve.",
    price: 24.99,
    stock: 70,
    image_url: "https://images.unsplash.com/photo-1544003484-3cd181d17917?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Summit Insulated Stainless Steel Tumbler 30oz",
    category: "Sports & Outdoors",
    description: "Double-walled vacuum insulated car-friendly travel mug with splash-proof sliding lid, sweat-free powder coating, and stainless steel straw.",
    price: 29.95,
    stock: 65,
    image_url: "https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Cushioned Non-Slip Athletic Trail Running Socks",
    category: "Sports & Outdoors",
    description: "Technical trail socks engineered with anti-blister ribbing, zoned compression padding, and CoolMax yarn for ventilation.",
    price: 21.00,
    stock: 75,
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "AquaGuard Heavy-Duty Waterproof Dry Bag 20L",
    category: "Sports & Outdoors",
    description: "Heavy-gauge 500D PVC roll-top waterproof sack protecting gear from water, sand, and mud during kayaking, rafting, and boating adventures.",
    price: 27.99,
    stock: 55,
    image_url: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80"
  },
  {
    name: "Apex 16-in-1 Compact Bike Repair Multi-Tool",
    category: "Sports & Outdoors",
    description: "Precision pocket bicycle multi-tool crafted from hardened Cr-V steel with hex wrenches, Torx keys, chain breaker, and spoke tools.",
    price: 26.50,
    stock: 60,
    image_url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80"
  }
];
