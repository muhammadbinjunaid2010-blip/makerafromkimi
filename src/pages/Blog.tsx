import { useState } from "react";
import { Link } from "react-router";
import {
  Clock,
  User,
  Heart,
  Eye,
  BookOpen,
  TrendingUp,
  MessageCircle,
  Plus,
  X,
  Search,
  ArrowRight,
  Sparkles,
  Calendar,
  Tag,
} from "lucide-react";

// TODO: Fetch blog posts from database
const featuredArticle = {
  title: "Getting Started with ESP32: A Complete Beginner's Guide",
  excerpt:
    "Everything you need to know to start building IoT projects with the ESP32 microcontroller — from setup to your first WiFi connection.",
  author: "Makera Team",
  date: "Jul 2, 2026",
  readTime: "12 min read",
  category: "Tutorials",
  likes: 234,
  views: 5600,
  image:
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=450&fit=crop",
};

// TODO: Fetch popular articles from database
const popularArticles = [
  {
    title: "Top 10 Sensors Every Maker Should Own",
    author: "Sachin Perera",
    date: "Jun 28, 2026",
    readTime: "6 min read",
    category: "Resources",
    likes: 156,
    image:
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=250&fit=crop",
  },
  {
    title: "Understanding PWM: A Practical Guide",
    author: "Ravin Fernando",
    date: "Jun 25, 2026",
    readTime: "8 min read",
    category: "Tutorials",
    likes: 142,
    image:
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b60?w=400&h=250&fit=crop",
  },
  {
    title: "How to Choose the Right Microcontroller",
    author: "Dilshan Kumar",
    date: "Jun 22, 2026",
    readTime: "10 min read",
    category: "Guides",
    likes: 128,
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
  },
];

// TODO: Fetch latest articles from database
const latestArticles = [
  {
    title: "Building a Smart Garden with Arduino",
    author: "Amaya Silva",
    date: "Jul 1, 2026",
    readTime: "7 min read",
    category: "Projects",
    excerpt:
      "Create an automated garden monitoring system that tracks soil moisture, temperature, and sunlight.",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=400&fit=crop",
  },
  {
    title: "Introduction to Computer Vision with OpenCV",
    author: "Kasun Jayawardena",
    date: "Jun 29, 2026",
    readTime: "9 min read",
    category: "AI/ML",
    excerpt:
      "Learn the basics of computer vision and how to implement real-time object detection on a Raspberry Pi.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
  },
  {
    title: "Powering Your Projects: Battery Guide",
    author: "Makera Team",
    date: "Jun 27, 2026",
    readTime: "5 min read",
    category: "Resources",
    excerpt:
      "A comprehensive guide to choosing the right power source for your portable electronics projects.",
    image:
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b60?w=600&h=400&fit=crop",
  },
  {
    title: "Debugging Arduino: Common Mistakes",
    author: "Nimal Perera",
    date: "Jun 24, 2026",
    readTime: "6 min read",
    category: "Tutorials",
    excerpt:
      "Learn to identify and fix the most common Arduino programming mistakes that beginners make.",
    image:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop",
  },
];

// TODO: Fetch categories from database
const blogCategories = [
  { name: "All", count: 24 },
  { name: "Tutorials", count: 8 },
  { name: "Projects", count: 6 },
  { name: "Guides", count: 4 },
  { name: "Resources", count: 3 },
  { name: "AI/ML", count: 2 },
  { name: "News", count: 1 },
];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Tutorials",
    author: "",
    image: "",
  });

  const filteredArticles =
    selectedCategory === "All"
      ? latestArticles
      : latestArticles.filter((a) => a.category === selectedCategory);

  const handleSubmitArticle = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit article for admin approval before publishing
    // TODO: Connect to backend/database to store article
    setShowSubmitForm(false);
    setFormData({ title: "", excerpt: "", content: "", category: "Tutorials", author: "", image: "" });
    alert("Your article has been submitted for review. It will be published once approved by our team.");
  };

  return (
    <div className="pt-20 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-6">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">
              Makera Blog
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 mb-2">
              Learn & Discover
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Tutorials, project guides, and insights from the maker community
            </p>
          </div>
          <button
            onClick={() => setShowSubmitForm(true)}
            className="flex items-center gap-2 px-5 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Submit Article
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Featured Article */}
        <div className="relative group rounded-2xl overflow-hidden mb-12">
          <div className="aspect-[21/9] overflow-hidden">
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <span className="inline-block text-[11px] font-semibold text-white bg-blue-600 px-3 py-1 rounded-full mb-3">
              {featuredArticle.category}
            </span>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-2 max-w-2xl leading-tight">
              {featuredArticle.title}
            </h2>
            <p className="text-white/70 text-sm max-w-xl leading-relaxed mb-4">
              {featuredArticle.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {featuredArticle.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {featuredArticle.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {featuredArticle.readTime}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {/* Categories */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-blue-600" />
                Categories
              </h3>
              <div className="space-y-1">
                {blogCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.name
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs opacity-70">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                Popular Articles
              </h3>
              <div className="space-y-4">
                {popularArticles.map((article, i) => (
                  <div key={i} className="flex gap-3 group cursor-pointer">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {article.likes}
                        </span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {blogCategories.slice(0, 5).map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.name
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article, i) => (
                  <div
                    key={i}
                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                  >
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="inline-block text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
                        {article.category}
                      </span>
                      <h3 className="font-bold text-slate-800 text-[15px] mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          {article.author}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime}
                          </span>
                          <span>{article.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No articles found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Article Modal */}
      {showSubmitForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800">Submit an Article</h2>
              <button
                onClick={() => setShowSubmitForm(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitArticle} className="p-6 space-y-4">
              {/* TODO: Integrate authentication - get user info from auth context */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Getting Started with ESP32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Short Excerpt *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Brief summary of your article..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Article Content *
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Write your article content here... (Markdown supported)"
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
                    {blogCategories.filter((c) => c.name !== "All").map((cat) => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                <p className="font-medium mb-1">Admin Approval Required</p>
                <p className="text-amber-600 text-xs">
                  Your article will be reviewed by our editorial team before
                  publication. This ensures quality content for the community.
                </p>
                {/* TODO: Notify admin when new article is submitted for approval */}
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
