import { useParams, Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { BookOpen, Cpu, Wifi, Activity, Zap, Monitor, Layers, ArrowLeft, ExternalLink, FileText, Youtube, ShoppingCart } from "lucide-react";

const components = [
  { id: 1, name: "Arduino Uno R3", slug: "arduino-uno-r3", type: "Microcontroller", icon: Cpu, category: "Arduino", description: "The most popular microcontroller board for beginners and professionals.", complexity: "Beginner" },
  { id: 2, name: "ESP32", slug: "esp32", type: "Microcontroller", icon: Wifi, category: "Wireless & IoT", description: "Dual-core microcontroller with built-in WiFi and Bluetooth.", complexity: "Intermediate" },
  { id: 3, name: "SG90 Servo Motor", slug: "sg90-servo", type: "Actuator", icon: Zap, category: "Motors", description: "Micro servo motor for robotics and automation projects.", complexity: "Beginner" },
  { id: 4, name: "HC-SR04 Ultrasonic", slug: "hc-sr04-ultrasonic", type: "Sensor", icon: Activity, category: "Sensors", description: "Ultrasonic distance measurement sensor for obstacle detection.", complexity: "Beginner" },
  { id: 5, name: "16x2 LCD Display", slug: "16x2-lcd", type: "Display", icon: Monitor, category: "Displays", description: "Standard character LCD display for showing text data.", complexity: "Beginner" },
  { id: 6, name: "L298N Motor Driver", slug: "l298n-motor-driver", type: "Driver", icon: Layers, category: "Motors", description: "Dual H-bridge motor driver for controlling DC and stepper motors.", complexity: "Intermediate" },
  { id: 7, name: "Raspberry Pi 5", slug: "raspberry-pi-5", type: "Single Board Computer", icon: Cpu, category: "SBC", description: "Powerful single-board computer for advanced projects.", complexity: "Intermediate" },
  { id: 8, name: "DHT22 Temperature Sensor", slug: "dht22", type: "Sensor", icon: Activity, category: "Sensors", description: "Digital temperature and humidity sensor with high accuracy.", complexity: "Beginner" },
];

export function ComponentGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {components.map((comp) => {
        const Icon = comp.icon || BookOpen;
        return (
          <Link key={comp.id} to={`/components/${comp.slug}`}>
            <motion.div whileHover={{ y: -3 }} className="rounded-xl border-2 border-slate-100 p-5 hover:border-blue-200 hover:shadow-md transition-all h-full">
              <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                <Icon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="font-semibold text-sm">{comp.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{comp.type}</p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{comp.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="text-[10px]">{comp.complexity}</Badge>
                <Badge variant="outline" className="text-[10px]">{comp.category}</Badge>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
}

export function ComponentDetail() {
  const { slug } = useParams();
  const comp = components.find((c) => c.slug === slug);

  if (!comp) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold">Component not found</h2>
        <Button asChild variant="link"><Link to="/components">Browse all components</Link></Button>
      </div>
    );
  }

  const Icon = comp.icon || BookOpen;
  const categoryProjs = components.filter((c) => c.category === comp.category && c.id !== comp.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/components"><ArrowLeft className="h-4 w-4 mr-1" /> All Components</Link>
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="h-40 w-40 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shrink-0">
                <Icon className="h-20 w-20 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold">{comp.name}</h1>
                  <Badge>{comp.complexity}</Badge>
                  <Badge variant="outline">{comp.category}</Badge>
                </div>
                <p className="text-muted-foreground mt-2">{comp.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Button size="sm" variant="outline"><ShoppingCart className="h-3.5 w-3.5 mr-1" /> Buy Now</Button>
                  <Button size="sm" variant="ghost"><FileText className="h-3.5 w-3.5 mr-1" /> Datasheet</Button>
                  <Button size="sm" variant="ghost"><Youtube className="h-3.5 w-3.5 mr-1" /> Tutorial</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="pinout">Pinout</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card><CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Overview</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {comp.name} is a {comp.type.toLowerCase()} designed for {comp.complexity.toLowerCase()}-level applications.
              It's widely used in the maker community for various electronics projects.
              {comp.category === "Arduino" && " It features an ATmega328P microcontroller running at 16MHz with 14 digital I/O pins."}
              {comp.category === "Sensors" && " It provides accurate readings for your projects with simple digital/analog interfaces."}
              {comp.category === "Motors" && " It's ideal for robotics applications requiring precise movement control."}
            </p>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="specs" className="mt-4">
          <Card><CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Technical Specifications</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: "Operating Voltage", value: "5V" },
                { label: "Clock Speed", value: "16 MHz" },
                { label: "Digital I/O Pins", value: "14" },
                { label: "Analog Input Pins", value: "6" },
                { label: "Flash Memory", value: "32 KB" },
                { label: "SRAM", value: "2 KB" },
                { label: "EEPROM", value: "1 KB" },
                { label: "Communication", value: "UART, I2C, SPI" },
              ].map((spec) => (
                <div key={spec.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm text-muted-foreground">{spec.label}</span>
                  <span className="text-sm font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="pinout" className="mt-4">
          <Card><CardContent className="p-6 text-center">
            <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center text-muted-foreground">
              Pinout diagram — coming soon
            </div>
            <p className="text-sm text-muted-foreground mt-3">Refer to the official pinout diagram for detailed pin functions.</p>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="tutorials" className="mt-4">
          <Card><CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Tutorials</h3>
            <div className="space-y-3">
              {["Getting Started", "Basic Project", "Advanced Guide"].map((tutorial) => (
                <div key={tutorial} className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{tutorial} — {comp.name}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <Card><CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Projects using {comp.name}</h3>
            {categoryProjs.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {categoryProjs.map((p) => (
                  <Link key={p.id} to={`/components/${p.slug}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                      <p.icon className="h-5 w-5 text-blue-500 shrink-0" />
                      <span className="text-sm">{p.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No related projects yet</p>
            )}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ComponentLibrary() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-500" />
          Component Library
        </h1>
        <p className="text-muted-foreground mt-1">Learn about electronic components — datasheets, pinouts, tutorials, and projects</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", "Arduino", "Wireless & IoT", "Sensors", "Motors", "Displays", "SBC"].map((cat) => (
          <button key={cat} className="px-3 py-1.5 rounded-lg text-sm whitespace-nowrap bg-slate-100 hover:bg-slate-200 transition-colors">
            {cat}
          </button>
        ))}
      </div>

      <ComponentGrid />
    </div>
  );
}
