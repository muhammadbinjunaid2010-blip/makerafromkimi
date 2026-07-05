import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, MessageSquare, Flag } from "lucide-react";

interface Review {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  likes: number;
  replies?: Review[];
}

interface ReviewsProps {
  targetType: "product" | "project" | "blog" | "creator";
  targetId: number;
  averageRating?: number;
  totalReviews?: number;
}

const mockReviews: Review[] = [
  {
    id: 1, userId: 1, userName: "TechMaker", userAvatar: "",
    rating: 5, title: "Perfect for beginners!", body: "Great quality board. I've built 3 projects with it so far and it works flawlessly. Highly recommended for anyone starting with Arduino.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), likes: 12,
  },
  {
    id: 2, userId: 2, userName: "RoboCrafter", userAvatar: "",
    rating: 4, title: "Good but could be better", body: "Works well for basic projects. The documentation could be more detailed though. Still a solid purchase for the price.",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), likes: 5,
  },
];

function StarRating({ rating, onRate, size = "sm", interactive = false }: {
  rating: number; onRate?: (r: number) => void; size?: "sm" | "md" | "lg"; interactive?: boolean;
}) {
  const sizeClass = size === "lg" ? "h-6 w-6" : size === "md" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
        >
          <Star className={`${sizeClass} ${star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
        </button>
      ))}
    </div>
  );
}

export function RatingBadge({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <StarRating rating={Math.round(rating)} />
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted-foreground">({count} reviews)</span>
    </div>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg border">
      <div className="flex items-start gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={review.userAvatar} />
          <AvatarFallback className="text-xs">{review.userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{review.userName}</span>
            <StarRating rating={review.rating} />
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm font-medium mt-1">{review.title}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{review.body}</p>
          <div className="flex items-center gap-3 mt-2">
            <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" /> {review.likes}
            </button>
            <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> Reply
            </button>
            <button className="text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 ml-auto">
              <Flag className="h-3 w-3" /> Report
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Reviews({ averageRating = 4.5, totalReviews = 12 }: ReviewsProps) {
  const [reviews] = useState<Review[]>(mockReviews);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reviews & Ratings</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Write Review"}
        </Button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Your Rating</p>
                  <StarRating rating={newRating} onRate={setNewRating} size="md" interactive />
                </div>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Review title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Share your experience..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={3}
                />
                <Button size="sm" disabled={!newRating || !newBody}>
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review List */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Star className="h-10 w-10 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        )}
      </div>
    </div>
  );
}
