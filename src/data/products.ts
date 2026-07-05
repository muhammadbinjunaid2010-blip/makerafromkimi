export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  categoryId: number;
  categoryName: string;
  stock: number;
  featured: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  itemCount: number;
}

export const categories: Category[] = [
  { id: 1, name: "Arduino", slug: "arduino", description: "Microcontroller boards and shields", icon: "Cpu", itemCount: 24 },
  { id: 2, name: "Sensors", slug: "sensors", description: "Temperature, motion, distance sensors", icon: "Activity", itemCount: 18 },
  { id: 3, name: "Motors", slug: "motors", description: "Servo, stepper, DC motors", icon: "Zap", itemCount: 12 },
  { id: 4, name: "Displays", slug: "displays", description: "LCD, OLED, LED matrix displays", icon: "Monitor", itemCount: 9 },
  { id: 5, name: "Wireless & IoT", slug: "wireless-iot", description: "ESP32, Bluetooth, WiFi modules", icon: "Wifi", itemCount: 15 },
  { id: 6, name: "Components", slug: "components", description: "Resistors, capacitors, ICs", icon: "Layers", itemCount: 32 },
  { id: 7, name: "Tools", slug: "tools", description: "Soldering irons, multimeters", icon: "Wrench", itemCount: 8 },
  { id: 8, name: "Project Kits", slug: "project-kits", description: "Starter bundles and kits", icon: "Package", itemCount: 6 },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Arduino Uno R3",
    slug: "arduino-uno-r3",
    description: "The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz quartz crystal, USB connection, power jack, ICSP header, and reset button.",
    price: "1950.00",
    image: "/images/arduino-uno.jpg",
    categoryId: 1,
    categoryName: "Arduino",
    stock: 50,
    featured: 1,
  },
  {
    id: 2,
    name: "ESP32 DevKit V1",
    slug: "esp32-devkit",
    description: "ESP32 Development Board with WiFi and Bluetooth dual-mode. Features dual-core processor, rich peripheral interface, and low power consumption.",
    price: "1250.00",
    image: "/images/esp32.jpg",
    categoryId: 5,
    categoryName: "Wireless & IoT",
    stock: 40,
    featured: 1,
  },
  {
    id: 3,
    name: "Ultrasonic Sensor HC-SR04",
    slug: "ultrasonic-sensor-hc-sr04",
    description: "HC-SR04 ultrasonic distance sensor module. Range: 2cm to 400cm, accuracy up to 3mm. Perfect for obstacle avoidance and distance measurement projects.",
    price: "280.00",
    image: "/images/ultrasonic.jpg",
    categoryId: 2,
    categoryName: "Sensors",
    stock: 100,
    featured: 1,
  },
  {
    id: 4,
    name: "16x2 LCD Display",
    slug: "16x2-lcd-display",
    description: "Standard 16x2 character LCD display with blue backlight. HD44780 compatible. Perfect for displaying sensor data and project status.",
    price: "450.00",
    image: "/images/lcd-display.jpg",
    categoryId: 4,
    categoryName: "Displays",
    stock: 60,
    featured: 1,
  },
  {
    id: 5,
    name: "SG90 Servo Motor",
    slug: "sg90-servo-motor",
    description: "TowerPro SG90 micro servo motor. Lightweight, high-quality plastic gear. Operating voltage: 4.8V, torque: 1.8kg/cm. Perfect for robotic projects.",
    price: "320.00",
    image: "/images/servo-motor.jpg",
    categoryId: 3,
    categoryName: "Motors",
    stock: 80,
    featured: 1,
  },
  {
    id: 6,
    name: "Jumper Wires (120pcs)",
    slug: "jumper-wires-120pcs",
    description: "120 pieces of male-to-male jumper wires in assorted colors. Length: 20cm. Perfect for breadboard prototyping and connections.",
    price: "380.00",
    image: "/images/jumper-wires.jpg",
    categoryId: 6,
    categoryName: "Components",
    stock: 70,
    featured: 1,
  },
  {
    id: 7,
    name: "Breadboard 830 Points",
    slug: "breadboard-830-points",
    description: "Standard 830 tie-point solderless breadboard. White plastic body with red and blue power rails. Perfect for prototyping circuits without soldering.",
    price: "350.00",
    image: "/images/breadboard.jpg",
    categoryId: 6,
    categoryName: "Components",
    stock: 90,
    featured: 1,
  },
  {
    id: 8,
    name: "Arduino Nano",
    slug: "arduino-nano",
    description: "Arduino Nano V3 with ATmega328P. Small, complete, and breadboard-friendly board. 22 digital I/O pins, 8 analog inputs, Mini-B USB connection.",
    price: "1450.00",
    image: "/images/arduino-nano.jpg",
    categoryId: 1,
    categoryName: "Arduino",
    stock: 45,
    featured: 1,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: number): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured === 1);
}
