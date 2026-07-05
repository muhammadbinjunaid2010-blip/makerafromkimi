import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search as SearchIcon, SlidersHorizontal, X, Package, FileText, FolderGit2, Users, Trophy, ArrowUpDown } from "lucide-react";
import { Link } from "react-router";

const searchCategories = [
  { value: "all", label: "All", icon: SearchIcon },
  { value: "products", label: "Products", icon: Package },
  { value: "projects", label: "Projects", icon: FolderGit2 },
  { value: "blogs", label: "Blogs", icon: FileText },
  { value: "community", label: "Community", icon: Users },
  { value: "competitions", label: "Competitions", icon: Trophy },
];

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const mockResults = {
  products: [
    { id: 1, name: "Arduino Uno R3", slug: "arduino-uno-r3", price: "1950.00", image: "/images/arduino-uno.jpg", category: "Arduino", stock: 50 },
    { id: 2, name: "ESP32 DevKit V1", slug: "esp32-devkit", price: "1250.00", image: "/images/esp32.jpg", category: "Wireless & IoT", stock: 40 },
    { id: 3, name: "Raspberry Pi 5", slug: "raspberry-pi-5", price: "8500.00", image: "/images/rpi5.jpg", category: "Single Board Computers", stock: 15 },
    { id: 4, name: "Ultrasonic Sensor HC-SR04", slug: "ultrasonic-sensor-hc-sr04", price: "280.00", image: "/images/ultrasonic.jpg", category: "Sensors", stock: 100 },
    { id: 5, name: "SG90 Servo Motor", slug: "sg90-servo-motor", price: "320.00", image: "/images/servo-motor.jpg", category: "Motors", stock: 80 },
  ],
  projects: [
    { id: 1, title: "Smart Home Automation", slug: "smart-home-automation", description: "Control your home with ESP32", difficulty: "Intermediate", author: "TechMaker", likes: 234 },
    { id: 2, title: "Line Following Robot", slug: "line-following-robot", description: "Autonomous robot using Arduino", difficulty: "Beginner", author: "RoboCrafter", likes: 189 },
  ],
  blogs: [
    { id: 1, title: "Getting Started with Arduino", slug: "getting-started-arduino", excerpt: "A complete beginner's guide", author: "Makera Team", date: "2024-01-15" },
    { id: 2, title: "ESP32 WiFi Tutorial", slug: "esp32-wifi-tutorial", excerpt: "Connect your ESP32 to WiFi", author: "IoTExpert", date: "2024-02-20" },
  ],
  users: [
    { id: 1, name: "TechMaker", avatar: "", role: "maker", projects: 12, xp: 3500 },
    { id: 2, name: "RoboCrafter", avatar: "", role: "maker", projects: 8, xp: 2200 },
  ],
  competitions: [
    { id: 1, title: "Robotics Challenge 2024", prize: "$500", difficulty: "Advanced", entries: 45 },
    { id: 2, title: "IoT Innovation Contest", prize: "$300", difficulty: "Intermediate", entries: 32 },
  ],
};

function ProductCard({ product }: { product: any }) {
  return (
    <Link to={`/shop/${product.slug}`}>
      <motion.div whileHover={{ y: -2 }} className="flex items-center gap-4 p-3 rounded-lg border hover:border-blue-200 hover:bg-blue-50/30 transition-all">
        <div className="h-16 w-16 rounded-lg bg-slate-100 flex items-center justify-center text-2xl shrink-0">
          {product.category === "Arduino" ? "🔌" : product.category.includes("Wireless") ? "📡" : product.category === "Sensors" ? "📊" : "⚙️"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.category}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-blue-600">Rs. {Number(product.price).toLocaleString()}</span>
            <Badge variant={product.stock > 50 ? "outline" : "destructive"} className="text-[10px] h-5">
              {product.stock > 50 ? "In Stock" : "Low Stock"}
            </Badge>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <motion.div whileHover={{ y: -2 }} className="p-3 rounded-lg border hover:border-purple-200 hover:bg-purple-50/30 transition-all">
        <p className="font-medium text-sm">{project.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-[10px]">{project.difficulty}</Badge>
          <span className="text-xs text-muted-foreground">by {project.author}</span>
          <span className="text-xs text-muted-foreground ml-auto">❤️ {project.likes}</span>
        </div>
      </motion.div>
    </Link>
  );
}

function BlogCard({ blog }: { blog: any }) {
  return (
    <Link to={`/blog/${blog.slug}`}>
      <motion.div whileHover={{ y: -2 }} className="p-3 rounded-lg border hover:border-green-200 hover:bg-green-50/30 transition-all">
        <p className="font-medium text-sm">{blog.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{blog.excerpt}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>by {blog.author}</span>
          <span>·</span>
          <span>{blog.date}</span>
        </div>
      </motion.div>
    </Link>
  );
}

function UserCard({ user }: { user: any }) {
  return (
    <Link to={`/maker/${user.id}`}>
      <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3 p-3 rounded-lg border hover:border-amber-200 hover:bg-amber-50/30 transition-all">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          {user.name[0]}
        </div>
        <div>
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.projects} projects · {user.xp} XP</p>
        </div>
      </motion.div>
    </Link>
  );
}

function CompetitionCard({ comp }: { comp: any }) {
  return (
    <Link to={`/community/competitions/${comp.id}`}>
      <motion.div whileHover={{ y: -2 }} className="p-3 rounded-lg border hover:border-red-200 hover:bg-red-50/30 transition-all">
        <div className="flex items-start justify-between">
          <p className="font-medium text-sm">{comp.title}</p>
          <Badge className="text-amber-600 shrink-0">🏆 {comp.prize}</Badge>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-[10px]">{comp.difficulty}</Badge>
          <span>{comp.entries} entries</span>
        </div>
      </motion.div>
    </Link>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const hasQuery = debouncedQuery.length > 0;
  const results = hasQuery ? mockResults : { products: [], projects: [], blogs: [], users: [], competitions: [] };

  const totalResults = results.products.length + results.projects.length + results.blogs.length + results.users.length + results.competitions.length;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, projects, blogs, makers..."
          className="h-14 pl-12 pr-10 text-lg rounded-2xl border-2 focus-visible:border-blue-500"
        />
        {query && (
          <button onClick={() => { setQuery(""); setDebouncedQuery(""); }} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {searchCategories.map((cat) => {
          const Icon = cat.icon;
          const count = cat.value === "all" ? totalResults
            : (results as any)[cat.value]?.length || 0;
          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                activeCategory === cat.value ? "bg-blue-100 text-blue-700 font-medium" : "text-muted-foreground hover:bg-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
              {hasQuery && <span className="text-xs ml-1">({count})</span>}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1" /> Filters
          </Button>
        </div>
      </div>

      {/* Results */}
      {!hasQuery ? (
        <div className="text-center py-16">
          <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Search Makera</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Find products, projects, tutorials, and makers in the Makera community
          </p>
        </div>
      ) : totalResults === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No results found</h2>
          <p className="text-muted-foreground">Try different keywords or browse categories</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Products */}
          {(activeCategory === "all" || activeCategory === "products") && results.products.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" /> Products ({results.products.length})
              </h3>
              <div className="grid gap-2">
                {results.products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}

          {/* Projects */}
          {(activeCategory === "all" || activeCategory === "projects") && results.projects.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <FolderGit2 className="h-4 w-4" /> Projects ({results.projects.length})
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
                {results.projects.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            </section>
          )}

          {/* Blogs */}
          {(activeCategory === "all" || activeCategory === "blogs") && results.blogs.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Blogs ({results.blogs.length})
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
                {results.blogs.map((b) => <BlogCard key={b.id} blog={b} />)}
              </div>
            </section>
          )}

          {/* Users */}
          {(activeCategory === "all" || activeCategory === "community") && results.users.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" /> Makers ({results.users.length})
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
                {results.users.map((u) => <UserCard key={u.id} user={u} />)}
              </div>
            </section>
          )}

          {/* Competitions */}
          {(activeCategory === "all" || activeCategory === "competitions") && results.competitions.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4" /> Competitions ({results.competitions.length})
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
                {results.competitions.map((c) => <CompetitionCard key={c.id} comp={c} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
