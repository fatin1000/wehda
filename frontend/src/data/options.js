// citys الرياض - منطقة الرياض
export const cityOptions = [
    "Al-Baha Region - Al-Aqiq",
    "Al-Baha Region - Al-Mandaq",
    "Al-Baha Region - Al-Qura",
    "Al-Baha Region - Baljurashi",
    "Al-Jouf Region - Al-Qurayyat",
    "Al-Jouf Region - Dumat Al-Jandal",
    "Al-Jouf Region - Sakaka",
    "Asir Region - Abha",
    "Asir Region - Al-Namas",
    "Asir Region - Bisha",
    "Asir Region - Khamis Mushait",
    "Asir Region - Sarat Abidah",
    "Eastern Province - Al-Ahsa",
    "Eastern Province - Buqayq",
    "Eastern Province - Dammam",
    "Eastern Province - Jubail",
    "Eastern Province - Khobar",
    "Eastern Province - Nairyah",
    "Eastern Province - Qatif",
    "Eastern Province - Ras Tanura",
    "Hail Region - Al-Ghazala",
    "Hail Region - Al-Shamli",
    "Hail Region - Baqaa",
    "Jazan Region - Abu Arish",
    "Jazan Region - Al-Aridhah",
    "Jazan Region - Farasan",
    "Jazan Region - Sabya",
    "Mecca Region - Al-Lith",
    "Mecca Region - Al-Qunfudhah",
    "Mecca Region - Jeddah",
    "Mecca Region - Mecca",
    "Mecca Region - Rabigh",
    "Mecca Region - Taif",
    "Medina Region - Al-Ula",
    "Medina Region - Mahd Adh Dhahab",
    "Medina Region - Medina",
    "Medina Region - Yanbu",
    "Najran Region - Badr Al-Janoub",
    "Najran Region - Habuna",
    "Najran Region - Sharurah",
    "Northern Borders - Arar",
    "Northern Borders - Rafha",
    "Northern Borders - Turaif",
    "Qassim Region - Al-Bada'i",
    "Qassim Region - Al-Mithnab",
    "Qassim Region - Al-Rass",
    "Qassim Region - Unaizah",
    "Riyadh Region - Al-Dawadmi",
    "Riyadh Region - Al-Kharj",
    "Riyadh Region - Al-Zulfi",
    "Riyadh Region - Riyadh",
    "Riyadh Region - Wadi Al-Dawasir",
    "Tabuk Region - Al-Bida",
    "Tabuk Region - Al-Wajh",
    "Tabuk Region - Duba",
    "Tabuk Region - Haql"
];
// the services he offer نجارة - حدادة - سباكة
export const fildOptions = [
    { value: 'carpentry', label: 'carpentry' },
    { value: 'blacksmithing', label: 'blacksmithing' },
    { value: 'plumbing', label: 'plumbing' },
    { value: 'electrical_work', label: 'electrical_work' },
    { value: 'painting', label: 'painting' },
    { value: 'masonry', label: 'masonry' },
    { value: 'tiling', label: 'tiling' },
    { value: 'roofing', label: 'roofing' },
    { value: 'glass_work', label: 'glass_work' },
    { value: 'hvac', label: 'hvac' },
    { value: 'metal_fabrication', label: 'metal_fabrication' },
    { value: 'wood_work', label: 'wood_work' },
    { value: 'excavation', label: 'excavation' },
    { value: 'road_construction', label: 'road_construction' },
    { value: 'landscaping', label: 'landscaping' },
    { value: 'interior_design', label: 'interior_design' },
    { value: 'waterproofing', label: 'waterproofing' },
    { value: 'fire_safety', label: 'fire_safety' },
    { value: 'security_systems', label: 'security_systems' },
];
// سيخ - خشب - حديد - خرسانة
export const itemOptions = [
    { value: "rebar", label: "rebar" },
    { value: "wood", label: "wood" },
    { value: "iron", label: "iron" },
    { value: "concrete", label: "concrete" },
    { value: "cement", label: "cement" },
    { value: "sand", label: "sand" },
    { value: "gravel", label: "gravel" },
    { value: "bricks", label: "bricks" },
    { value: "glass", label: "glass" },
    { value: "tiles", label: "tiles" },
    { value: "gypsum", label: "gypsum" },
    { value: "marble", label: "marble" },
    { value: "granite", label: "granite" },
    { value: "plastic", label: "plastic" },
    { value: "ceramic", label: "ceramic" },
    { value: "insulation_material", label: "insulation_material" },
    { value: "fiber", label: "fiber" },
    { value: "aluminum", label: "aluminum" },
    { value: "stainless_steel", label: "stainless_steel" },
    { value: "lead", label: "lead" },
    { value: "asphalt", label: "asphalt" },
    { value: "mesh", label: "mesh" },
    { value: "reinforced_concrete", label: "reinforced_concrete" },
    { value: "polycarbonate", label: "polycarbonate" },
    { value: "rubber", label: "rubber" },
    { value: "synthetic_wood", label: "synthetic_wood" },
    { value: "roofing_materials", label: "roofing_materials" },
    { value: "pipes", label: "pipes" },
    { value: "electrical_wiring", label: "electrical_wiring" },
    { value: "bolts_and_screws", label: "bolts_and_screws" },
    { value: "paint", label: "paint" },
];
export const unitsOptions = [
    "ton", // مناسبة للحديد، الخرسانة، الإسفلت، الحصى
    "kg", // مناسبة للأسمنت، الرمل، المواد العازلة، الألياف الصناعية
    "litre", // مناسبة للدهان، البلاستيك السائل، المطاط السائل
    "piece",  // مناسبة للطوب، الزجاج، البلاط، الأنابيب، الخشب، المسامير، الأسلاك الكهربائية
    "square_meter", // مناسبة للرخام، الجرانيت، السيراميك، مواد الأسقف
    "cubic_meter", // مناسبة للخرسانة المسلحة، الرمال، الحصى، الطوب الكبير
    "roll", // مناسبة للأسلاك الكهربائية، مواد العزل، الشبك المعدني
    "bar",  // مناسبة للحديد المسلح، الألمنيوم، الستيل المقاوم للصدأ
    "sheet" // مناسبة للألمنيوم، الخشب الصناعي، الزجاج، البولي كربونات
];

export const categoryOptions = [
    "construction", // الإنشاءات العامة
    "architecture", // الهندسة المعمارية
    "civil engineering", // الهندسة المدنية
    "electrical engineering", // الهندسة الكهربائية
    "mechanical engineering", // الهندسة الميكانيكية
    "plumbing services", // خدمات السباكة
    "carpentry", // النجارة
    "blacksmithing", // الحدادة
    "painting", // الدهان
    "tiling", // تركيب البلاط والسيراميك
    "roofing", // تركيب الأسقف والعزل
    "glass work", // أعمال الزجاج
    "metal fabrication", // تصنيع المعادن
    "hvac", // التكييف والتبريد
    "excavation", // الحفر وأعمال الأساسات
    "road construction", // إنشاء الطرق والبنية التحتية
    "landscaping", // تنسيق الحدائق والزراعة
    "interior design", // التصميم الداخلي
    "waterproofing", // عزل الأسطح والمباني
    "fire safety", // أنظمة الحماية من الحرائق
    "security systems", // أنظمة الأمن والمراقبة
    "smart buildings", // المباني الذكية وأنظمة الأتمتة
    "welding", // اللحام وتشكيل المعادن
    "stone work", // أعمال الحجر والرخام
    "foundation work", // أعمال القواعد والأساسات
    "contracting", // المقاولات العامة
    "project management", // إدارة المشاريع الهندسية
    "material supply", // توريد مواد البناء
    "maintenance services" // خدمات الصيانة العامة
];

export const itemStatusOptions = ["New", "semi-New", "Old"];

export const paymentMethodOptions = ["Cash", "Bank Transfer"];

export const sellOptions = ["retail", "wholesale"];