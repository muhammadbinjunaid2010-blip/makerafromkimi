import { useState } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import {
  FolderGit2, FileText, Award, Trophy, Zap, Github, Globe, MapPin,
  ExternalLink, Download, Heart, MessageSquare, Shield,
} from "lucide-react";

const mockPortfolio = {
  userId: 1,
  name: "TechMaker",
  bio: "Electronics enthusiast and maker from Colombo. I love building Arduino projects, exploring IoT, and sharing knowledge with the community.",
  avatar: "",
  skills: ["Arduino", "ESP32", "PCB Design", "IoT", "Robotics", "Python", "Circuit Design", "Soldering"],
  projects: [
    { id: 1, title: "Smart Home Automation", slug: "smart-home-automation", description: "ESP32-based home automation system", image: "", likes: 234, views: 1200, difficulty: "Intermediate" },
    { id: 2, title: "Weather Station", slug: "weather-station", description: "IoT weather station with real-time data", image: "", likes: 156, views: 890, difficulty: "Beginner" },
    { id: 3, title: "Robot Arm", slug: "robot-arm", description: "3D-printed robotic arm controlled by Arduino", image: "", likes: 312, views: 2100, difficulty: "Advanced" },
  ],
  blogs: [
    { id: 1, title: "Getting Started with Arduino", slug: "getting-started-arduino", excerpt: "A complete beginner's guide to Arduino", date: "2024-01-15", readTime: "5 min" },
    { id: 2, title: "ESP32 WiFi Tutorial", slug: "esp32-wifi-tutorial", excerpt: "Connect your ESP32 to WiFi networks", date: "2024-02-20", readTime: "8 min" },
  ],
  badges: [
    { name: "First Project", icon: "🚀", description: "Published your first project" },
    { name: "5 Projects", icon: "📦", description: "Published 5 projects" },
    { name: "Community Helper", icon: "❤️", description: "Helped fellow makers" },
    { name: "Featured Creator", icon: "⭐", description: "Featured in spotlight" },
  ],
  certificates: [
    { title: "Arduino Fundamentals", type: "Learning Path", issuedAt: "2024-03-01" },
    { title: "Robotics Challenge Winner", type: "Competition", issuedAt: "2024-02-15" },
  ],
  xp: 3500,
  level: 5,
  reputationTitle: "Creator",
  competitions: [
    { title: "Robotics Challenge 2024", place: 1, date: "2024-02-01" },
    { title: "IoT Innovation Contest", place: 3, date: "2024-01-15" },
  ],
  github: "https://github.com/techmaker",
  socialLinks: { twitter: "https://twitter.com/techmaker", linkedin: "https://linkedin.com/in/techmaker" },
  resumeUrl: "",
};

export default function MakerPortfolio() {
  useParams();
  const [activeTab, setActiveTab] = useState("projects");
  const p = mockPortfolio;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />
          <CardContent className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16">
              <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                <AvatarImage src={p.avatar} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {p.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pt-2 sm:pt-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold">{p.name}</h1>
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                    {p.reputationTitle}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 max-w-xl">{p.bio}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Colombo</span>
                  <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-amber-500" /> {p.xp.toLocaleString()} XP</span>
                  <span className="flex items-center gap-1"><Award className="h-3 w-3 text-purple-500" /> Level {p.level}</span>
                  <span className="flex items-center gap-1"><FolderGit2 className="h-3 w-3" /> {p.projects.length} Projects</span>
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {p.blogs.length} Blogs</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"><Heart className="h-3.5 w-3.5 mr-1" /> Follow</Button>
                <Button size="sm" variant="outline"><MessageSquare className="h-3.5 w-3.5 mr-1" /> Message</Button>
                <Button size="sm"><ExternalLink className="h-3.5 w-3.5 mr-1" /> Share</Button>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mt-4">
              {p.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 mt-3">
              <a href={p.github} target="_blank" className="text-muted-foreground hover:text-foreground">
                <Github className="h-4 w-4" />
              </a>
              {Object.entries(p.socialLinks).map(([key, url]) => (
                <a key={key} href={url} target="_blank" className="text-muted-foreground hover:text-foreground">
                  <Globe className="h-4 w-4" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* XP Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium">Level {p.level} — {p.reputationTitle}</span>
            </div>
            <span className="text-xs text-muted-foreground">{p.xp.toLocaleString()} / 5,000 XP to next level</span>
          </div>
          <Progress value={65} className="h-2" />
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-6 w-full">
          <TabsTrigger value="projects"><FolderGit2 className="h-3.5 w-3.5 mr-1" /> Projects</TabsTrigger>
          <TabsTrigger value="blogs"><FileText className="h-3.5 w-3.5 mr-1" /> Blogs</TabsTrigger>
          <TabsTrigger value="badges"><Award className="h-3.5 w-3.5 mr-1" /> Badges</TabsTrigger>
          <TabsTrigger value="achievements"><Trophy className="h-3.5 w-3.5 mr-1" /> Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {p.projects.map((project) => (
              <motion.div key={project.id} whileHover={{ y: -2 }}>
                <Link to={`/projects/${project.slug}`}>
                  <Card className="h-full hover:border-blue-200 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{project.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{project.description}</p>
                        </div>
                        <Badge variant="outline" className="text-[10px] shrink-0 ml-2">{project.difficulty}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span>❤️ {project.likes}</span>
                        <span>👁️ {project.views}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="blogs" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {p.blogs.map((blog) => (
              <motion.div key={blog.id} whileHover={{ y: -2 }}>
                <Link to={`/blog/${blog.slug}`}>
                  <Card className="h-full hover:border-green-200 transition-colors">
                    <CardContent className="p-4">
                      <p className="font-medium text-sm">{blog.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{blog.excerpt}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{blog.date}</span>
                        <span>·</span>
                        <span>{blog.readTime} read</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="badges" className="mt-4">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {p.badges.map((badge, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white p-4 text-center">
                <span className="text-3xl">{badge.icon}</span>
                <p className="font-semibold text-sm mt-1">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {p.certificates.map((cert, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">{cert.title}</p>
                    <p className="text-xs text-muted-foreground">{cert.type} · {cert.issuedAt}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
              </motion.div>
            ))}
            {p.competitions.map((comp, i) => (
              <motion.div key={`comp-${i}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Trophy className={`h-5 w-5 ${comp.place === 1 ? "text-amber-500" : comp.place === 2 ? "text-slate-400" : "text-orange-600"}`} />
                  <div>
                    <p className="text-sm font-medium">{comp.title}</p>
                    <p className="text-xs text-muted-foreground">#{comp.place} place · {comp.date}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">🏆 Winner</Badge>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Resume Button */}
      {p.resumeUrl && (
        <div className="text-center">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download Resume
          </Button>
        </div>
      )}
    </div>
  );
}
