import { useParams, Link } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft, CheckCircle, Clock, Cpu, CircuitBoard, Brain, Wifi, Sparkles } from "lucide-react";

const learningPaths = [
  {
    id: 1, title: "Arduino Beginner", slug: "arduino-beginner", description: "Start your maker journey with Arduino. Learn electronics fundamentals, programming, and build your first projects.", difficulty: "Beginner", duration: "4 weeks", image: "", icon: Cpu, lessons: 12, projects: 4, quizzes: 3, certificateAvailable: true, color: "blue",
  },
  {
    id: 2, title: "Embedded Systems", slug: "embedded-systems", description: "Dive deep into microcontrollers, sensors, and real-time systems. Master C++ and hardware interfaces.", difficulty: "Intermediate", duration: "8 weeks", image: "", icon: CircuitBoard, lessons: 20, projects: 6, quizzes: 5, certificateAvailable: true, color: "purple",
  },
  {
    id: 3, title: "Robotics", slug: "robotics", description: "Build robots from scratch. Learn mechanics, motor control, sensors, and autonomous navigation.", difficulty: "Intermediate", duration: "10 weeks", image: "", icon: Cpu, lessons: 24, projects: 8, quizzes: 6, certificateAvailable: true, color: "red",
  },
  {
    id: 4, title: "AI & Machine Learning", slug: "ai-machine-learning", description: "Apply AI to your maker projects. Learn TensorFlow Lite, computer vision, and edge AI.", difficulty: "Advanced", duration: "12 weeks", image: "", icon: Brain, lessons: 18, projects: 5, quizzes: 4, certificateAvailable: true, color: "green",
  },
  {
    id: 5, title: "PCB Design", slug: "pcb-design", description: "Learn to design professional PCBs using KiCad. From schematic to manufacturing-ready files.", difficulty: "Intermediate", duration: "6 weeks", image: "", icon: CircuitBoard, lessons: 15, projects: 3, quizzes: 3, certificateAvailable: true, color: "amber",
  },
  {
    id: 6, title: "IoT: Internet of Things", slug: "iot", description: "Connect your projects to the internet. Learn WiFi, MQTT, cloud platforms, and IoT security.", difficulty: "Intermediate", duration: "8 weeks", image: "", icon: Wifi, lessons: 16, projects: 5, quizzes: 4, certificateAvailable: true, color: "cyan",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", gradient: "from-blue-500 to-blue-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", gradient: "from-purple-500 to-purple-600" },
  red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", gradient: "from-red-500 to-red-600" },
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", gradient: "from-green-500 to-green-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", gradient: "from-amber-500 to-orange-600" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", gradient: "from-cyan-500 to-teal-600" },
};

function PathCard({ path }: { path: typeof learningPaths[0] }) {
  const colors = colorMap[path.color] || colorMap.blue;
  const Icon = path.icon;

  return (
    <Link to={`/learn/${path.slug}`}>
      <motion.div whileHover={{ y: -3 }} className={`rounded-xl border-2 ${colors.border} p-5 h-full hover:shadow-lg transition-all`}>
        <div className={`h-12 w-12 rounded-lg ${colors.bg} flex items-center justify-center mb-3`}>
          <Icon className={`h-6 w-6 ${colors.text}`} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-[10px]">{path.difficulty}</Badge>
          <Badge variant="outline" className="text-[10px]">{path.duration}</Badge>
        </div>
        <h3 className="font-semibold">{path.title}</h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{path.description}</p>
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span>{path.lessons} lessons</span>
          <span>·</span>
          <span>{path.projects} projects</span>
          {path.certificateAvailable && <Badge variant="outline" className="text-[10px] ml-auto">🎓 Certificate</Badge>}
        </div>
        <Progress value={0} className="h-1.5 mt-3" />
      </motion.div>
    </Link>
  );
}

function PathDetail() {
  const { slug } = useParams();
  const path = learningPaths.find((p) => p.slug === slug);

  if (!path) {
    return (
      <div className="text-center py-16">
        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold">Learning path not found</h2>
        <Button asChild variant="link"><Link to="/learn">Browse all paths</Link></Button>
      </div>
    );
  }

  const colors = colorMap[path.color] || colorMap.blue;
  const Icon = path.icon;

  const lessons = [
    { id: 1, title: "Introduction to Electronics", type: "lesson", duration: "30 min", completed: true },
    { id: 2, title: "Tools & Equipment Setup", type: "lesson", duration: "20 min", completed: true },
    { id: 3, title: "Understanding Voltage & Current", type: "lesson", duration: "45 min", completed: false },
    { id: 4, title: "Blink an LED", type: "project", duration: "1 hour", completed: false },
    { id: 5, title: "Reading Sensor Data", type: "lesson", duration: "40 min", completed: false },
    { id: 6, title: "Quiz 1: Fundamentals", type: "quiz", duration: "15 min", completed: false },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/learn"><ArrowLeft className="h-4 w-4 mr-1" /> All Learning Paths</Link>
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={`border-2 ${colors.border}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className={`h-24 w-24 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-12 w-12 ${colors.text}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold">{path.title}</h1>
                  <Badge variant="secondary">{path.difficulty}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {path.duration}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2">{path.description}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span>📚 {path.lessons} lessons</span>
                  <span>🔧 {path.projects} projects</span>
                  <span>📝 {path.quizzes} quizzes</span>
                  {path.certificateAvailable && <Badge className="bg-green-100 text-green-700 border-0">🎓 Certificate on completion</Badge>}
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">Progress</span>
                    <span className="text-muted-foreground">2 / {lessons.length} completed</span>
                  </div>
                  <Progress value={Math.round((2 / lessons.length) * 100)} className="h-2" />
                </div>
                <Button className="mt-4" size="sm">
                  Continue Learning
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lessons */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Course Content</h3>
          <div className="space-y-2">
            {lessons.map((lesson, i) => (
              <motion.div key={lesson.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  lesson.completed ? "bg-green-50 border-green-200" : "hover:bg-slate-50"
                }`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  lesson.completed ? "bg-green-100" : "bg-slate-100"
                }`}>
                  {lesson.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${lesson.completed ? "text-green-700" : ""}`}>{lesson.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{lesson.type} · {lesson.duration}</p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0 capitalize">{lesson.type}</Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LearningPathsPage() {
  const { slug } = useParams();

  if (slug) {
    return <PathDetail />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          Learning Paths
        </h1>
        <p className="text-muted-foreground mt-1">Structured learning tracks to guide you from beginner to expert maker</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => <PathCard key={path.id} path={path} />)}
      </div>
    </div>
  );
}
