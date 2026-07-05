import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Video, Monitor, Trophy, CalendarDays, Wrench } from "lucide-react";

interface Event {
  id: number;
  title: string;
  type: "workshop" | "webinar" | "hackathon" | "meetup" | "livestream";
  description: string;
  image: string;
  startsAt: string;
  endsAt: string;
  location: string;
  isOnline: boolean;
  maxAttendees: number;
  registeredCount: number;
  host: string;
}

const events: Event[] = [
  { id: 1, title: "Arduino Workshop: Build Your First Robot", type: "workshop", description: "Hands-on workshop where you'll build a line-following robot from scratch. All components provided.", image: "", startsAt: "2024-04-15T10:00:00", endsAt: "2024-04-15T16:00:00", location: "Makera Lab, Colombo", isOnline: false, maxAttendees: 20, registeredCount: 15, host: "TechMaker" },
  { id: 2, title: "Introduction to PCB Design with KiCad", type: "webinar", description: "Learn PCB design fundamentals using KiCad. From schematic to gerber files.", image: "", startsAt: "2024-04-20T14:00:00", endsAt: "2024-04-20T16:00:00", location: "Online (Zoom)", isOnline: true, maxAttendees: 100, registeredCount: 45, host: "PCB Master" },
  { id: 3, title: "48-Hour IoT Hackathon", type: "hackathon", description: "Build an IoT project in 48 hours. Teams of 2-4. Prizes for best projects!", image: "", startsAt: "2024-05-01T09:00:00", endsAt: "2024-05-03T09:00:00", location: "Makera Lab, Colombo", isOnline: false, maxAttendees: 50, registeredCount: 28, host: "Makera Team" },
  { id: 4, title: "Monthly Maker Meetup", type: "meetup", description: "Monthly gathering of makers to share projects, exchange ideas, and collaborate.", image: "", startsAt: "2024-04-25T18:00:00", endsAt: "2024-04-25T20:00:00", location: "Makera Cafe, Colombo", isOnline: false, maxAttendees: 30, registeredCount: 12, host: "Community" },
  { id: 5, title: "Live Coding: ESP32 Web Server", type: "livestream", description: "Live coding session building a web server on ESP32 step by step.", image: "", startsAt: "2024-04-18T19:00:00", endsAt: "2024-04-18T21:00:00", location: "YouTube Live", isOnline: true, maxAttendees: 500, registeredCount: 89, host: "IoTExpert" },
];

const typeIcons: Record<string, typeof Calendar> = {
  workshop: Wrench, webinar: Video, hackathon: Trophy, meetup: Users, livestream: Monitor,
};

const typeColors: Record<string, string> = {
  workshop: "bg-blue-100 text-blue-700",
  webinar: "bg-purple-100 text-purple-700",
  hackathon: "bg-red-100 text-red-700",
  meetup: "bg-green-100 text-green-700",
  livestream: "bg-orange-100 text-orange-700",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function EventCard({ event }: { event: Event }) {
  const Icon = typeIcons[event.type] || Calendar;
  const isUpcoming = new Date(event.startsAt) > new Date();
  const isFull = event.registeredCount >= event.maxAttendees;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }}>
      <Card className="hover:border-blue-200 transition-all">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shrink-0">
              <Icon className={`h-7 w-7 ${event.type === "workshop" ? "text-blue-600" : event.type === "webinar" ? "text-purple-600" : event.type === "hackathon" ? "text-red-600" : event.type === "meetup" ? "text-green-600" : "text-orange-600"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={typeColors[event.type]}>{event.type}</Badge>
                {!isUpcoming && <Badge variant="outline" className="text-red-500 border-red-200">Past</Badge>}
                {isFull && <Badge variant="destructive" className="text-[10px]">Full</Badge>}
              </div>
              <h3 className="font-semibold text-sm mt-1">{event.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatDate(event.startsAt)}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(event.startsAt)}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.registeredCount}/{event.maxAttendees}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Button size="sm" disabled={!isUpcoming || isFull}>
                  {isFull ? "Full" : isUpcoming ? "Register Now" : "View Recording"}
                </Button>
                <span className="text-xs text-muted-foreground">Hosted by {event.host}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Events() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-blue-500" />
          Events
        </h1>
        <p className="text-muted-foreground mt-1">Workshops, webinars, hackathons, and meetups for the maker community</p>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="workshop">Workshops</TabsTrigger>
          <TabsTrigger value="webinar">Webinars</TabsTrigger>
          <TabsTrigger value="hackathon">Hackathons</TabsTrigger>
          <TabsTrigger value="meetup">Meetups</TabsTrigger>
          <TabsTrigger value="livestream">Livestreams</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <Card><CardContent className="text-center py-12">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No events found</p>
            </CardContent></Card>
          ) : (
            filtered.map((event) => <EventCard key={event.id} event={event} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
