// Default content taken from pakshutter.com.
// The app shows this until the admin saves their own content in Firebase,
// and the admin "Load website content" button copies it into the database.

const IK = 'https://ik.imagekit.io/finitysync/Finity%20Sync/Projects/Pak%20Shutters/';

export const IMAGES = {
  logo: IK + 'Logo%20Pak%20Shutters.jpeg?tr=w-512',
  hero: IK + 'Shutter%20Hero%20Image?tr=w-1080,q-80',
  welding: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1080&q=75&auto=format&fit=crop',
  shutterDetail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1080&q=75&auto=format&fit=crop',
};

export const DEFAULT_BUSINESS = {
  name: 'Pak Shutter',
  subtitle: 'Metal Works',
  heroBadge: 'Premium Shutter Solutions',
  heroTitle: 'The Standard of Durability & Security',
  heroText:
    'From industrial rolling shutters to precision metal works, Pak Shutter defines quality in Karachi. We build what protects your business.',
  heroImage: IMAGES.hero,
  aboutTitle: "We're Committed to Industrial Excellence",
  aboutText:
    "We deliver high-quality rolling shutters, automatic doors, and custom aluminum solutions designed for durability, safety, and modern aesthetics. At Pak Shutter, we don't just weld metal; we forge relationships built on trust and security. Our precision workmanship ensures that every project stands the test of time.",
  aboutImage: IMAGES.welding,
  highlights: ['24/7 Service & Support', 'Strict Deadlines', 'Transparent Pricing', 'Advanced Metal Work Tools', 'Expert Welding Solutions'],
  stats: [
    { title: '784', desc: 'Projects Completed' },
    { title: '668', desc: 'Satisfied Clients' },
    { title: '891', desc: 'Metal Works' },
    { title: '15+', desc: 'Years Experience' },
  ],
  phone: '+92 341-1696263',
  whatsapp: '923411696263',
  email: 'pakshutter626@gmail.com',
  address: 'Block 2 North Karachi, Karachi, 75400',
  mapQuery: 'Pak Shutter, Block 2 North Karachi, Karachi 75400',
  hours: 'Available 24/7 for installation, repair & emergency service',
  facebook: 'https://www.facebook.com/share/1DFCnyu6u4/',
  website: 'https://pakshutter.com',
  footerText: 'Professional rolling shutter and metal works company delivering durability and safety since inception.',
};

export const DEFAULT_SERVICES = [
  {
    id: 'installation',
    order: 1,
    icon: 'construct',
    title: 'New Shutter Installation',
    short: 'Commercial steel shutters, gear shutters, motorized shutters & industrial shutters installed with precision.',
    headline: 'Professional Shutter Installation',
    description:
      'Secure your premises with our industrial-grade rolling shutters. We provide end-to-end installation services for shops, warehouses, and factories. We follow a strict protocol to ensure safety, durability, and smooth operation. Using only the highest quality gauge steel and branded motors, we guarantee a shutter that lasts for years.',
    image: IMAGES.hero,
    stepsTitle: 'Our Installation Process',
    steps: [
      { title: 'Consultation & Survey', desc: 'We visit your site to measure dimensions and understand your specific security needs.' },
      { title: 'Custom Fabrication', desc: 'Our workshop crafts the shutter using high-grade steel or aluminum tailored to the exact size.' },
      { title: 'Professional Installation', desc: 'Our expert team installs the shutter, motor, and guide rails with precision.' },
      { title: 'Testing & Handover', desc: 'We rigorously test the mechanism and demonstrate proper usage before leaving.' },
    ],
    checklistTitle: '',
    checklist: [],
    note: 'Completed over 700+ installations in Karachi.',
    cta: 'Request a Site Visit',
  },
  {
    id: 'repair',
    order: 2,
    icon: 'build',
    title: 'Shutter Repairing',
    short: 'Expert fixing of jammed shutters, broken springs, track alignment, motor repair & emergency service.',
    headline: 'Fast & Reliable Shutter Repair',
    description:
      'Stuck shutter? Motor not working? Our emergency repair team is just a call away. We fix all types of rolling shutters and automatic gates. We understand that a broken shutter is a security risk, so we prioritize emergency calls.',
    image: IMAGES.shutterDetail,
    stepsTitle: 'What We Fix',
    steps: [
      { title: 'Motor Failure', desc: 'Replacement of burnt or malfunctioning motors.' },
      { title: 'Jammed Shutters', desc: 'Fixing stuck shutters due to track alignment or spring issues.' },
      { title: 'Broken Springs', desc: 'Replacement of tension springs for smooth manual operation.' },
      { title: 'Lock & Key Issues', desc: 'Repairing or replacing damaged locking mechanisms.' },
    ],
    checklistTitle: '',
    checklist: [],
    note: 'Emergency Repair Service — we prioritize emergency calls.',
    cta: 'Report an Issue',
  },
  {
    id: 'maintenance',
    order: 3,
    icon: 'settings',
    title: 'Maintenance Service',
    short: 'Comprehensive monthly & annual maintenance, lubrication, alignment & noise control.',
    headline: 'Annual Maintenance Contracts',
    description:
      'Keep your shutters operating smoothly and silently. Our preventative maintenance packages ensure your business is never stuck open or closed.',
    image: IMAGES.hero,
    stepsTitle: 'Why Maintenance Matters?',
    steps: [
      { title: 'Extend Lifespan', desc: "Regular oiling and balancing can double your shutter's life." },
      { title: 'Prevent Breakdowns', desc: 'Catch small issues before they become expensive repairs.' },
      { title: 'Save Costs', desc: 'Avoid full replacements by maintaining parts efficiently.' },
    ],
    checklistTitle: 'Our Maintenance Checklist',
    checklist: [
      'Lubrication of guide rails and springs',
      'Checking motor limit switches',
      'Tension adjustment of springs',
      'Inspection of slats for damage',
      'Tightening of loose bolts and brackets',
      'Remote control signal testing',
    ],
    note: "Don't wait for a breakdown. Schedule a checkup today.",
    cta: 'Book Maintenance Visit',
  },
  {
    id: 'welding',
    order: 4,
    icon: 'flame',
    title: 'Custom Metal Works',
    short: 'Bespoke aluminum and steel fabrication tailored to your architectural needs.',
    headline: 'Custom Metal Works & Welding',
    description:
      'Beyond shutters, we specialize in heavy-duty steel fabrication. From main gates to industrial sheds, we build it all.',
    image: IMAGES.welding,
    stepsTitle: 'What We Build',
    steps: [
      { title: 'Gates & Grills', desc: 'Secure and stylish main gates, window grills, and safety doors fabricated to your design.' },
      { title: 'Steel Sheds', desc: 'Industrial fiber and steel sheds for warehouses, parking lots, and rooftops.' },
      { title: 'Custom Fabrication', desc: 'Have a unique requirement? We can weld and build custom metal structures.' },
    ],
    checklistTitle: 'Materials We Use',
    checklist: [
      'High-grade Stainless Steel (SS 304/202)',
      'Mild Steel (MS) for heavy structures',
      'Galvanized Iron (GI) sheets for rust protection',
    ],
    note: 'Looking for a custom project? We specialize in custom dimensions and specific security requirements for warehouses, shops, and homes.',
    cta: 'Discuss Your Project',
  },
];

export const DEFAULT_SHUTTER_TYPES = [
  {
    id: 'steel-rolling',
    order: 1,
    name: 'Commercial Steel Rolling Shutter',
    short: 'Strong gauge-steel shutters for shops, markets and plazas.',
    description:
      'Our most popular shutter for shops and commercial outlets. Interlocking slats made from high-quality gauge steel roll neatly into a drum above the opening, giving strong protection while saving space.',
    image: IMAGES.hero,
    features: ['High-quality gauge steel slats', 'Smooth manual operation with tension springs', 'Strong central and side locking', 'Custom sizes for any opening'],
    bestFor: 'Shops, markets, plazas, showrooms',
  },
  {
    id: 'gear',
    order: 2,
    name: 'Gear Operated Shutter',
    short: 'Heavy shutters opened easily with a gear and chain/handle.',
    description:
      'For large or heavy shutters where pushing by hand is difficult. A gearbox lets one person open and close the shutter smoothly with a chain or handle, without needing electricity.',
    image: IMAGES.shutterDetail,
    features: ['Easy operation for large openings', 'Works without electricity', 'Reduced strain on springs', 'Long-lasting gear mechanism'],
    bestFor: 'Large shops, godowns, garages',
  },
  {
    id: 'motorized',
    order: 3,
    name: 'Motorized / Automatic Shutter',
    short: 'Open and close at the push of a button or remote.',
    description:
      'Automatic shutters fitted with branded motors and remote control. Ideal for busy businesses that open and close daily, and for big openings. Limit switches stop the shutter at the right position every time.',
    image: IMAGES.hero,
    features: ['Branded motors with limit switches', 'Remote control & wall switch operation', 'Manual override option', 'Can be fitted on existing shutters'],
    bestFor: 'Showrooms, banks, warehouses, homes',
  },
  {
    id: 'industrial',
    order: 4,
    name: 'Industrial Shutter',
    short: 'Extra-wide heavy-duty shutters for factories and warehouses.',
    description:
      'Heavy-duty rolling shutters for factories, warehouses and loading bays. Built with thicker slats and reinforced guide rails to handle wide openings and daily heavy use.',
    image: IMAGES.shutterDetail,
    features: ['Thicker reinforced slats', 'Suitable for extra-wide openings', 'Motorized or gear operation', 'Built for heavy daily use'],
    bestFor: 'Factories, warehouses, loading bays',
  },
  {
    id: 'aluminum',
    order: 5,
    name: 'Aluminum Shutter',
    short: 'Lightweight, rust-free shutters with a modern finish.',
    description:
      'Custom aluminum shutters that are lighter than steel, do not rust and give a clean modern look. A great choice for homes, offices and shop fronts where appearance matters.',
    image: IMAGES.welding,
    features: ['Rust-free and lightweight', 'Modern, clean finish', 'Quiet operation', 'Manual or motorized'],
    bestFor: 'Homes, offices, shop fronts',
  },
  {
    id: 'gates-grills',
    order: 6,
    name: 'Gates, Grills & Safety Doors',
    short: 'Main gates, window grills and safety doors made to your design.',
    description:
      'Secure and stylish main gates, window grills and safety doors fabricated in our workshop from stainless steel, mild steel or GI to match your design and size.',
    image: IMAGES.welding,
    features: ['Stainless Steel (SS 304/202)', 'Mild Steel (MS) for heavy structures', 'GI sheets for rust protection', 'Made to your design'],
    bestFor: 'Homes, factories, buildings',
  },
];

export const DEFAULT_GALLERY = [
  { id: 'g1', order: 1, image: IMAGES.hero, caption: 'Industrial rolling shutter work', category: 'Shutters' },
  { id: 'g2', order: 2, image: IMAGES.shutterDetail, caption: 'Shutter detail & finishing', category: 'Shutters' },
  { id: 'g3', order: 3, image: IMAGES.welding, caption: 'Expert welding solutions', category: 'Metal Works' },
];

export const DEFAULT_TESTIMONIALS = [
  {
    id: 't1',
    order: 1,
    name: 'Hamza',
    role: 'Co-Founder - Hamza Super Store',
    text: 'I have just had two of the most productive work weeks I have had in years. Pak Shutters was perfectly matched to my temperament, and has been taking all the backlogged work off my plate.',
  },
  {
    id: 't2',
    order: 2,
    name: 'Ahmed',
    role: 'Business Owner - Ahmed Electronics',
    text: 'The precision in their welding and the quality of the shutter material is unmatched in Karachi. They adhered strictly to our project deadline.',
  },
];
