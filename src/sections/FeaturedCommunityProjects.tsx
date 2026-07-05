import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, Heart, Eye, Layers, Wifi, Zap, Cpu, Activity, GitFork } from "lucide-react";

// TODO: Fetch featured projects from database
const communityProjects = [
  {
    id: 1,
    name: "Line-Following Robot",
    author: "Ravin Fernando",
    difficulty: "Beginner",
    category: "Robotics",
    likes: 42,
    views: 1280,
    tags: ["Arduino", "IR Sensor", "L298N"],
    image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b60?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Smart Home Temperature Monitor",
    author: "Sachin Perera",
    difficulty: "Intermediate",
    category: "IoT",
    likes: 38,
    views: 960,
    tags: ["ESP32", "DHT22", "IoT"],
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Obstacle-Avoiding Car",
    author: "Dilshan Kumar",
    difficulty: "Intermediate",
    category: "Robotics",
    likes: 31,
    views: 745,
    tags: ["Ultrasonic", "Servo", "Arduino"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Automatic Plant Watering System",
    author: "Amaya Silva",
    difficulty: "Beginner",
    category: "Automation",
    likes: 27,
    views: 612,
    tags: ["Moisture Sensor", "Relay", "Pump"],
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=400&fit=crop",
  },
];

const difficultyStyles: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-red-100 text-red-700",
};

const categoryIcons: Record<string, React.ReactNode> = {
  Robotics: <Layers className="w-3.5 h-3.5" />,
  IoT: <Wifi className="w-3.5 h-3.5" />,
  Automation: <Zap className="w-3.5 h-3.5" />,
  Arduino: <Cpu className="w-3.5 h-3.5" />,
  Sensors: <Activity className="w-3.5 h-3.5" />,
  AI: <GitFork className="w-3.5 h-3.5" />,
};

export default function FeaturedCommunityProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = el.querySelectorAll(".featured-project-card");
            cards.forEach((card, i) => {
              setTimeout(() => {
                (card as HTMLElement).style.opacity = "1";
                (card as HTMLElement).style.transform = "translateY(0)";
              }, i * 100);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-2">
              Community Spotlight
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-800">
              Featured Community Projects
            </h2>
            <p className="text-slate-500 mt-2">
              Discover what fellow makers are building
            </p>
          </div>
          <Link
            to="/projects"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityProjects.map((project) => (
            <div
              key={project.id}
              className="featured-project-card group bg-white rounded-2xl border border-slate-200 overflow-hidden opacity-0 translate-y-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      difficultyStyles[project.difficulty]
                    }`}
                  >
                    {project.difficulty}
                  </span>
                  <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    {categoryIcons[project.category]}
                    {project.category}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-sm mb-2 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  by {project.author}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
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
                  <span className="text-xs text-blue-600 font-medium group-hover:underline">
                    View Project
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
