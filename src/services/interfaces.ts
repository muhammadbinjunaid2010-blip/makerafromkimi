/**
 * Service interfaces for backend/database integration readiness.
 *
 * These interfaces define the data contracts for talking to external services.
 * Replace the mock/data implementations with real service adapters when 
 * the backend is connected.
 *
 * Each service function follows the Repository/Adapter pattern so that
 * swapping from mock → tRPC → direct DB requires changing only the adapter.
 */

// ──────────────────────────────────────────────
// Category types
// ──────────────────────────────────────────────
export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  itemCount: number;
}

// ──────────────────────────────────────────────
// Product types
// ──────────────────────────────────────────────
export interface ProductDTO {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  categoryId: number;
  stock: number;
  featured: number;
}

// ──────────────────────────────────────────────
// Community / User Content types
// ──────────────────────────────────────────────
export interface BlogPostDTO {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  status: "draft" | "pending" | "approved" | "rejected";
}

export interface ProjectDTO {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: string;
  difficulty: string;
  tags: string[];
  componentsUsed: string;
  author: string;
  likes: number;
  views: number;
  status: "draft" | "pending" | "approved" | "rejected";
  featured: boolean;
}

export interface CompetitionDTO {
  id: number;
  title: string;
  description: string;
  prize: string;
  difficulty: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

// ──────────────────────────────────────────────
// Stats types
// ──────────────────────────────────────────────
export interface CommunityStatsDTO {
  totalMembers: number;
  activeMembers: number;
  projectsSubmitted: number;
  projectsApproved: number;
  blogsSubmitted: number;
  blogsApproved: number;
  competitionEntries: number;
  activeContributors: Array<{
    userId: number;
    name: string;
    contributions: number;
  }>;
}

export interface AdminSettingsDTO {
  siteName: string;
  siteDescription: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaLink: string;
  heroBackgroundImage: string;
  socialLinks: {
    github: string;
    discord: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
  };
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  emailFrom: string;
  emailFooter: string;
  emailLogo: string;
  homepageSections: {
    showHero: boolean;
    showCategories: boolean;
    showFeaturedProducts: boolean;
    showFeaturedProjects: boolean;
    showLatestBlogs: boolean;
    showWhyChooseUs: boolean;
    showTrustedBy: boolean;
    showCTA: boolean;
  };
}

// ──────────────────────────────────────────────
// Search types
// ──────────────────────────────────────────────
export interface SearchResultDTO {
  products: ProductDTO[];
  projects: ProjectDTO[];
  blogs: BlogPostDTO[];
  users: Array<{ id: number; name: string; avatar: string; role: string }>;
  competitions: CompetitionDTO[];
  totalResults: number;
}

export interface SearchFilters {
  query: string;
  category?: string;
  type?: "products" | "projects" | "blogs" | "users" | "competitions" | "all";
  difficulty?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "relevance" | "newest" | "popular" | "price_asc" | "price_desc";
}

// ──────────────────────────────────────────────
// Review types
// ──────────────────────────────────────────────
export interface ReviewDTO {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  targetType: "product" | "project" | "blog" | "creator";
  targetId: number;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Follow types
// ──────────────────────────────────────────────
export interface FollowDTO {
  id: number;
  followerId: number;
  followingId: number;
  targetType: "user" | "project" | "blog" | "category";
  targetId: number;
  createdAt: string;
}

// ──────────────────────────────────────────────
// Event types
// ──────────────────────────────────────────────
export interface EventDTO {
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
  isActive: boolean;
}

// ──────────────────────────────────────────────
// Career types
// ──────────────────────────────────────────────
export interface InternshipDTO {
  id: number;
  company: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  isRemote: boolean;
  stipend: string;
  duration: string;
  postedAt: string;
  deadline: string;
  isActive: boolean;
}

// ──────────────────────────────────────────────
// Component types (educational)
// ──────────────────────────────────────────────
export interface ComponentDTO {
  id: number;
  name: string;
  slug: string;
  type: string;
  overview: string;
  datasheet: string;
  pinout: string;
  tutorials: string[];
  projectsUsingIt: number[];
  category: string;
  image: string;
}

// ──────────────────────────────────────────────
// Learning Path types
// ──────────────────────────────────────────────
export interface LearningPathDTO {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  duration: string;
  image: string;
  lessons: Array<{
    id: number;
    title: string;
    content: string;
    order: number;
    type: "lesson" | "project" | "quiz";
  }>;
  certificateAvailable: boolean;
}

// ──────────────────────────────────────────────
// Portfolio types
// ──────────────────────────────────────────────
export interface PortfolioDTO {
  userId: number;
  name: string;
  bio: string;
  avatar: string;
  skills: string[];
  projects: ProjectDTO[];
  blogs: BlogPostDTO[];
  badges: string[];
  certificates: Array<{
    title: string;
    type: string;
    issuedAt: string;
  }>;
  xp: number;
  level: number;
  reputationTitle: string;
  competitions: Array<{
    title: string;
    place: number;
    date: string;
  }>;
  github: string;
  socialLinks: Record<string, string>;
  resumeUrl: string;
}

// ──────────────────────────────────────────────
// Message types
// ──────────────────────────────────────────────
export interface MessageDTO {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface ConversationDTO {
  id: number;
  participants: Array<{ id: number; name: string; avatar: string }>;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

// ──────────────────────────────────────────────
// AI types
// ──────────────────────────────────────────────
export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIRecommendationDTO {
  productIds: number[];
  section: "recommended" | "frequently_bought" | "similar" | "complete_project";
  reason: string;
}

// ──────────────────────────────────────────────
// Category Service interface
// ──────────────────────────────────────────────
export interface ICategoryService {
  getAll(): Promise<CategoryDTO[]>;
  getBySlug(slug: string): Promise<CategoryDTO | null>;
}

// ──────────────────────────────────────────────
// Product Service interface
// ──────────────────────────────────────────────
export interface IProductService {
  getAll(): Promise<ProductDTO[]>;
  getBySlug(slug: string): Promise<ProductDTO | null>;
  getById(id: number): Promise<ProductDTO | null>;
  getFeatured(): Promise<ProductDTO[]>;
  getByCategory(categoryId: number): Promise<ProductDTO[]>;
}

// ──────────────────────────────────────────────
// Community Service interface
// ──────────────────────────────────────────────
export interface ICommunityService {
  getFeaturedProjects(): Promise<ProjectDTO[]>;
  getFeaturedBlogs(): Promise<BlogPostDTO[]>;
  getStats(): Promise<CommunityStatsDTO>;
}

// ──────────────────────────────────────────────
// Settings Service interface
// ──────────────────────────────────────────────
export interface ISettingsService {
  get(): Promise<AdminSettingsDTO>;
  update(settings: Partial<AdminSettingsDTO>): Promise<void>;
}

// ──────────────────────────────────────────────
// Search Service interface
// ──────────────────────────────────────────────
export interface ISearchService {
  search(filters: SearchFilters): Promise<SearchResultDTO>;
  getSuggestions(query: string): Promise<string[]>;
}

// ──────────────────────────────────────────────
// AI Service interface (future OpenAI/Ollama)
// ──────────────────────────────────────────────
export interface IAIService {
  chat(messages: AIChatMessage[]): Promise<AIChatMessage>;
  getRecommendations(userId: number): Promise<AIRecommendationDTO[]>;
  generateBom(projectDescription: string): Promise<Array<{ component: string; quantity: number; notes: string }>>;
  explainConcept(concept: string): Promise<string>;
  debugCode(code: string, platform: string): Promise<string>;
}

// ──────────────────────────────────────────────
// Review Service interface
// ──────────────────────────────────────────────
export interface IReviewService {
  getForTarget(targetType: string, targetId: number): Promise<ReviewDTO[]>;
  create(review: Omit<ReviewDTO, "id" | "createdAt" | "updatedAt">): Promise<ReviewDTO>;
  getAverageRating(targetType: string, targetId: number): Promise<number>;
}

// ──────────────────────────────────────────────
// Follow Service interface
// ──────────────────────────────────────────────
export interface IFollowService {
  follow(followerId: number, targetType: string, targetId: number): Promise<void>;
  unfollow(followerId: number, targetType: string, targetId: number): Promise<void>;
  isFollowing(followerId: number, targetType: string, targetId: number): Promise<boolean>;
  getFollowers(targetType: string, targetId: number): Promise<FollowDTO[]>;
  getFollowing(userId: number): Promise<FollowDTO[]>;
}

// ──────────────────────────────────────────────
// Event Service interface
// ──────────────────────────────────────────────
export interface IEventService {
  getAll(): Promise<EventDTO[]>;
  getById(id: number): Promise<EventDTO | null>;
  register(userId: number, eventId: number): Promise<void>;
  unregister(userId: number, eventId: number): Promise<void>;
}

// ──────────────────────────────────────────────
// Career Service interface
// ──────────────────────────────────────────────
export interface ICareerService {
  getAll(): Promise<InternshipDTO[]>;
  getById(id: number): Promise<InternshipDTO | null>;
  apply(userId: number, internshipId: number, coverLetter: string): Promise<void>;
}

// ──────────────────────────────────────────────
// Message Service interface
// ──────────────────────────────────────────────
export interface IMessageService {
  getConversations(userId: number): Promise<ConversationDTO[]>;
  getMessages(conversationId: number): Promise<MessageDTO[]>;
  send(senderId: number, receiverId: number, content: string): Promise<MessageDTO>;
  markRead(conversationId: number, userId: number): Promise<void>;
}

// ──────────────────────────────────────────────
// Portfolio Service interface
// ──────────────────────────────────────────────
export interface IPortfolioService {
  getByUserId(userId: number): Promise<PortfolioDTO | null>;
  generateResume(userId: number): Promise<string>;
}

// ──────────────────────────────────────────────
// Component Library Service interface
// ──────────────────────────────────────────────
export interface IComponentLibraryService {
  getAll(): Promise<ComponentDTO[]>;
  getBySlug(slug: string): Promise<ComponentDTO | null>;
  getByCategory(category: string): Promise<ComponentDTO[]>;
}

// ──────────────────────────────────────────────
// Learning Path Service interface
// ──────────────────────────────────────────────
export interface ILearningPathService {
  getAll(): Promise<LearningPathDTO[]>;
  getBySlug(slug: string): Promise<LearningPathDTO | null>;
  enroll(userId: number, pathId: number): Promise<void>;
  completeLesson(userId: number, pathId: number, lessonId: number): Promise<void>;
  getProgress(userId: number, pathId: number): Promise<{ completedLessons: number; totalLessons: number; certificateEarned: boolean }>;
}

// ──────────────────────────────────────────────
// Newsletter Service interface
// ──────────────────────────────────────────────
export interface INewsletterService {
  subscribe(email: string): Promise<void>;
  unsubscribe(email: string): Promise<void>;
  sendCampaign(subject: string, content: string, recipientFilter?: string): Promise<void>;
}

// ──────────────────────────────────────────────
// Helper — default factory
// ──────────────────────────────────────────────
export function createService<T>(adapter: T): T {
  return adapter;
}
