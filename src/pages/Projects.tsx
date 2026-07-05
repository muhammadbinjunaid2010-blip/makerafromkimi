import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Plus,
  Heart,
  Eye,
  Cpu,
  Wifi,
  Zap,
  Layers,
  Activity,
  GitFork,
  Clock,
  Trash2,
  X,
  User,
  Search,
  SlidersHorizontal,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  author: string;
  likes: number;
  views: number;
  tags: string[];
  components: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const STORAGE_KEY = "makera_projects";

const defaultProjects: Project[] = [
  {
    id: "1",
    name: "Line-Following Robot",
    description: "An autonomous robot that follows a black line using IR sensors. Perfect for robotics beginners.",
    category: "Robotics",
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b60?w=600&h=400&fit=crop",
    difficulty: "Beginner",
    author: "Ravin Fernando",
    likes: 42,
    views: 1280,
    tags: ["Arduino", "IR Sensor", "L298N"],
    components: "Arduino Uno, IR Sensor x3, L298N Motor Driver, DC Motors x2",
    status: "approved",
    createdAt: "2026-06-15",
  },
  {
    id: "2",
    name: "Smart Home Temperature Monitor",
    description: "Monitor temperature and humidity from anywhere using an ESP32 with a web dashboard.",
    category: "IoT",
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop",
    difficulty: "Intermediate",
    author: "Sachin Perera",
    likes: 38,
    views: 960,
    tags: ["ESP32", "DHT22", "IoT", "Dashboard"],
    components: "ESP32, DHT22 Sensor, OLED Display, Breadboard",
    status: "approved",
    createdAt: "2026-06-20",
  },
  {
    id: "3",
    name: "Automatic Plant Watering System",
    description: "Keep plants hydrated with a soil moisture sensor that triggers a water pump automatically.",
    category: "Automation",
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=400&fit=crop",
    difficulty: "Beginner",
    author: "Amaya Silva",
    likes: 27,
    views: 612,
    tags: ["Moisture Sensor", "Relay", "Pump", "Arduino"],
    components: "Arduino Uno, Soil Moisture Sensor, Relay Module, Mini Water Pump",
    status: "approved",
    createdAt: "2026-06-25",
  },
  {
    id: "4",
    name: "Obstacle-Avoiding Car",
    description: "A robot car that navigates around obstacles using an ultrasonic sensor.",
    category: "Robotics",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
    difficulty: "Intermediate",
    author: "Dilshan Kumar",
    likes: 31,
    views: 745,
    tags: ["Ultrasonic", "Servo", "Arduino", "Motor Driver"],
    components: "Arduino Uno, HC-SR04, Servo Motor, L298N, Robot Chassis",
    status: "approved",
    createdAt: "2026-07-01",
  },
];

const categories = ["All", "Robotics", "IoT", "Automation", "Arduino", "ESP32", "Sensors", "AI/ML"];

const difficultyColors: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

const categoryIcons: Record<string, React.ReactNode> = {
  Robotics: <Layers className="w-4 h-4" />,
  IoT: <Wifi className="w-4 h-4" />,
  Automation: <Zap className="w-4 h-4" />,
  Arduino: <Cpu className="w-4 h-4" />,
  ESP32: <Wifi className="w-4 h-4" />,
  Sensors: <Activity className="w-4 h-4" />,
  "AI/ML": <GitFork className="w-4 h-4" />,
};

function loadProjects(): Project[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Project[];
      // TODO: Fetch approved projects from database instead of localStorage
      // TODO: Admin approval required before projects become public
      return parsed.filter((p) => p.status === "approved");
    }
  } catch {}
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
  return defaultProjects.filter((p) => p.status === "approved");
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Arduino",
    image: "",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    components: "",
    tags: "",
  });

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const filteredProjects = projects
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "popular") return b.likes - a.likes;
      if (sortBy === "views") return b.views - a.views;
      return 0;
    });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop",
      difficulty: formData.difficulty,
      author: "You",
      likes: 0,
      views: 0,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      components: formData.components,
      // TODO: Submitted projects require admin approval before becoming public
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    const allProjects = [...loadProjects(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").filter((p: Project) => p.status === "pending"), newProject];
    saveProjects(allProjects);
    // Show pending message - project will appear after admin approval
    setShowAddForm(false);
    setFormData({ name: "", description: "", category: "Arduino", image: "", difficulty: "Beginner", components: "", tags: "" });
    alert("Your project has been submitted for review. It will appear publicly once approved by our team.");
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveProjects(updated);
  };

  return (
    <div className="pt-20 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">
              Maker Projects
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 mb-2">
              Community Projects
            </h1>
            <p className="text-slate-500">
              {projects.length} project{projects.length !== 1 ? "s" : ""} shared by the community
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Project
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {categoryIcons[cat]}
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        difficultyColors[project.difficulty]
                      }`}
                    >
                      {project.difficulty}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      {categoryIcons[project.category]}
                      {project.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-[15px] mb-1 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>

                  <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    by {project.author}
                  </p>

                  <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {project.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {project.views}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg mb-2">No projects found</p>
            <p className="text-slate-400 text-sm mb-6">
              {searchQuery
                ? "Try a different search term"
                : selectedCategory !== "All"
                ? "No projects in this category yet. Be the first to share!"
                : "Be the first to share a project with the community."}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">
                Share Your Project
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              {/* TODO: Integrate authentication - get user name from auth context */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Line-Following Robot"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Describe what your project does and what you learned..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Difficulty *
                  </label>
                  <select
                    required
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as "Beginner" | "Intermediate" | "Advanced" })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Technology Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Arduino, IR Sensor, L298N"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Components Used
                </label>
                <input
                  type="text"
                  value={formData.components}
                  onChange={(e) => setFormData({ ...formData, components: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Arduino Uno, IR Sensor, L298N Motor Driver"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-medium mb-1">Admin Approval Required</p>
                <p className="text-amber-600 text-xs">
                  Your project will be reviewed by our team before it becomes
                  publicly visible. This helps maintain quality standards.
                </p>
                {/* TODO: Notify admin when new project is submitted for approval */}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Submit for Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
