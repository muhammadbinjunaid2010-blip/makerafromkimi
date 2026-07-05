import { useState } from "react";
import { Link } from "react-router";
import {
  MessageSquare,
  Heart,
  Eye,
  TrendingUp,
  Users,
  BookOpen,
  Trophy,
  Activity,
  Plus,
  Search,
  Clock,
  MessageCircle,
  Award,
  Zap,
  UserPlus,
} from "lucide-react";

// TODO: Fetch discussions from database
const discussions = [
  {
    id: 1,
    title: "Best microcontroller for a drone project?",
    author: "Ravin Fernando",
    replies: 24,
    likes: 56,
    category: "Hardware",
    timeAgo: "2 hours ago",
    avatar: "RF",
  },
  {
    id: 2,
    title: "Help! My servo motor is jittering at high speeds",
    author: "Sachin Perera",
    replies: 18,
    likes: 32,
    category: "Troubleshooting",
    timeAgo: "5 hours ago",
    avatar: "SP",
  },
  {
    id: 3,
    title: "Getting started with TensorFlow Lite on ESP32",
    author: "Dilshan Kumar",
    replies: 31,
    likes: 89,
    category: "AI/ML",
    timeAgo: "1 day ago",
    avatar: "DK",
  },
  {
    id: 4,
    title: "Share your 2026 summer build plans!",
    author: "Amaya Silva",
    replies: 42,
    likes: 120,
    category: "General",
    timeAgo: "3 days ago",
    avatar: "AS",
  },
];

// TODO: Fetch trending builds from database
const trendingBuilds = [
  {
    id: 1,
    name: "Solar-Powered Weather Station",
    author: "Kasun Jayawardena",
    likes: 89,
    views: 2300,
    image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=250&fit=crop",
  },
  {
    id: 2,
    name: "DIY 3D Printer from e-Waste",
    author: "Nimal Perera",
    likes: 73,
    views: 1800,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
  },
  {
    id: 3,
    name: "AI-Powered Plant Health Monitor",
    author: "Tharushi Gamage",
    likes: 65,
    views: 1500,
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=250&fit=crop",
  },
];

// TODO: Fetch newest members from database
const newestMembers = [
  { name: "Danushka Silva", joined: "Today", badge: "New Maker" },
  { name: "Priya K.", joined: "Yesterday", badge: "Joined" },
  { name: "Mohamed R.", joined: "2 days ago", badge: "Joined" },
  { name: "Chamath V.", joined: "3 days ago", badge: "Joined" },
  { name: "Samanthi G.", joined: "4 days ago", badge: "Joined" },
];

// TODO: Fetch upcoming challenges from database
const challenges = [
  {
    title: "30-Day IoT Challenge",
    participants: 156,
    deadline: "Jul 31, 2026",
    difficulty: "All Levels",
  },
  {
    title: "Line-Following Robot Competition",
    participants: 89,
    deadline: "Aug 15, 2026",
    difficulty: "Beginner+",
  },
  {
    title: "Smart Home Hackathon",
    participants: 234,
    deadline: "Sep 1, 2026",
    difficulty: "Intermediate+",
  },
];

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="pt-20 pb-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 gap-6">
          <div>
            <p className="text-blue-600 font-semibold text-xs uppercase tracking-widest mb-3">
              Makera Community
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 mb-2">
              Where Makers Connect
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Join thousands of makers. Share projects, ask questions, and
              build together.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all duration-200 shadow-sm">
            <Plus className="w-5 h-5" />
            Create Post
          </button>
        </div>

        {/* Search + Quick Stats */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, projects, members..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <strong className="text-slate-800">2,847</strong> members
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <strong className="text-slate-800">1,203</strong> discussions
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              <strong className="text-slate-800">47</strong> online
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Discussions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Discussions */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  Featured Discussions
                </h2>
                <Link
                  to="#"
                  className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  View all &rarr;
                </Link>
              </div>
              <div className="space-y-3">
                {discussions.map((d) => (
                  <div
                    key={d.id}
                    className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                      {d.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                          {d.title}
                        </h3>
                        <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0">
                          {d.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        by {d.author} &middot; {d.timeAgo}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {d.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          {d.likes} likes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
              <div className="flex items-start gap-4">
                <BookOpen className="w-10 h-10 text-blue-200 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    Community Guidelines
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed mb-4">
                    Be respectful. Share knowledge. Build together. Our
                    community thrives on collaboration, not competition.
                    Everyone was a beginner once.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full">
                      Be kind &amp; respectful
                    </span>
                    <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full">
                      Share your knowledge
                    </span>
                    <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full">
                      Credit creators
                    </span>
                    <span className="text-xs bg-white/20 px-3 py-1.5 rounded-full">
                      No spam
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-5">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Activity
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-slate-500 py-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-medium text-slate-700">Ravin</span>
                  <span>started a new discussion in</span>
                  <span className="text-blue-600">Hardware</span>
                  <Clock className="w-3 h-3 ml-auto" />
                  <span>12m ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 py-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-slate-700">Sachin</span>
                  <span>updated project</span>
                  <span className="text-blue-600">Smart Monitor</span>
                  <Clock className="w-3 h-3 ml-auto" />
                  <span>45m ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 py-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-slate-700">Amaya</span>
                  <span>earned badge</span>
                  <span className="text-amber-600">Sensor Master</span>
                  <Award className="w-3 h-3 ml-auto text-amber-500" />
                  <span>2h ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 py-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="font-medium text-slate-700">Dilshan</span>
                  <span>submitted a project for review</span>
                  <Clock className="w-3 h-3 ml-auto" />
                  <span>3h ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Trending Builds */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                Trending Builds
              </h3>
              <div className="space-y-4">
                {trendingBuilds.map((build) => (
                  <div
                    key={build.id}
                    className="flex gap-3 group cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={build.image}
                        alt={build.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {build.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        by {build.author}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {build.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {build.views}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newest Members */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-blue-600" />
                Newest Members
              </h3>
              <div className="space-y-3">
                {newestMembers.map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-400">{member.joined}</p>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      {member.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Challenges */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                <Trophy className="w-4 h-4" />
                Upcoming Challenges
              </h3>
              <div className="space-y-4">
                {challenges.map((c, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-sm font-semibold mb-1">{c.title}</h4>
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {c.participants} joined
                      </span>
                      <span>{c.deadline}</span>
                    </div>
                    <span className="inline-block mt-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
                      {c.difficulty}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors text-sm">
                <Zap className="w-4 h-4" />
                Join a Challenge
              </button>
            </div>

            {/* Quick Create */}
            <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-blue-200 rounded-2xl text-blue-600 font-medium hover:bg-blue-50 hover:border-blue-400 transition-all text-sm">
              <UserPlus className="w-4 h-4" />
              Invite Fellow Makers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
