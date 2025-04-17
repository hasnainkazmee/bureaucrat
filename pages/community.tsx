"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/MainLayout"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { Heart, MessageCircle, Plus, Globe, Clock, Filter, X, Share2, ChevronDown, ChevronUp } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useRouter } from "next/navigation"

// Import the useNotifications hook
import { useNotifications } from "@/context/NotificationContext"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { EmptyState } from "@/components/ui/EmptyState"

// Types for community posts
type PostType = "note" | "notes" | "subject" | "syllabus"

type Comment = {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

type Post = {
  id: string
  userId: string
  userName: string
  type: PostType
  title: string
  preview: string
  content: any // Can be a note, multiple notes, subject, or syllabus
  likes: number
  comments: Comment[]
  createdAt: string
  userLiked?: boolean
}

export default function CommunityPage() {
  const { user, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<PostType | "all">("all")
  const [sortBy, setSortBy] = useState<"recent" | "likes">("recent")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [commentInput, setCommentInput] = useState("")
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const router = useRouter()

  // Add the useNotifications hook to the component
  const { addNotification } = useNotifications()
  const { toast: addToast } = useToast()

  // Load mock data
  useEffect(() => {
    // TODO: Fetch from Firestore under communityPosts collection
    const mockPosts: Post[] = [
      {
        id: "post1",
        userId: "user1",
        userName: "Fatima Ahmed",
        type: "note",
        title: "CSS Flexbox Notes",
        preview: "Comprehensive guide to CSS Flexbox layouts",
        content: {
          title: "CSS Flexbox Notes",
          text: "# CSS Flexbox\n\nFlexbox is a one-dimensional layout method for arranging items in rows or columns. Items flex (expand) to fill additional space or shrink to fit into smaller spaces.\n\n## Basic Properties\n\n- `display: flex` - Defines a flex container\n- `flex-direction` - Defines the direction of flex items\n- `justify-content` - Aligns items along the main axis\n- `align-items` - Aligns items along the cross axis\n\n## Example\n\n```css\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n```",
        },
        likes: 24,
        comments: [
          {
            id: "comment1",
            userId: "user2",
            userName: "Ahmed Khan",
            content: "This is so helpful for my CSS preparation!",
            createdAt: "2023-11-12T14:30:00Z",
          },
        ],
        createdAt: "2023-11-10T09:15:00Z",
        userLiked: false,
      },
      {
        id: "post2",
        userId: "user3",
        userName: "Zainab Malik",
        type: "subject",
        title: "Pakistan Affairs",
        preview: "Complete syllabus for Pakistan Affairs",
        content: {
          name: "Pakistan Affairs",
          topics: [
            {
              name: "History",
              subtopics: ["Independence Movement", "Post-Independence Era"],
            },
            {
              name: "Geography",
              subtopics: ["Physical Features", "Climate", "Natural Resources"],
            },
            {
              name: "Governance",
              subtopics: ["Constitution", "Political System", "Administrative Structure"],
            },
          ],
        },
        likes: 37,
        comments: [
          {
            id: "comment2",
            userId: "user4",
            userName: "Ibrahim Qureshi",
            content: "This covers all the important topics. Thanks for sharing!",
            createdAt: "2023-11-13T10:45:00Z",
          },
          {
            id: "comment3",
            userId: "user5",
            userName: "Ayesha Tariq",
            content: "I've incorporated this into my study plan.",
            createdAt: "2023-11-14T16:20:00Z",
          },
        ],
        createdAt: "2023-11-09T11:30:00Z",
        userLiked: true,
      },
      {
        id: "post3",
        userId: "user6",
        userName: "Omar Farooq",
        type: "notes",
        title: "Current Affairs Collection",
        preview: "3 comprehensive notes on recent current affairs",
        content: [
          {
            title: "International Relations",
            text: "# International Relations\n\nThis note covers the latest developments in international politics and Pakistan's foreign policy.",
          },
          {
            title: "Economic Developments",
            text: "# Economic Developments\n\nRecent economic indicators and policy changes in Pakistan's economy.",
          },
          {
            title: "Political Landscape",
            text: "# Political Landscape\n\nCurrent political scenario and major developments in Pakistan's politics.",
          },
        ],
        likes: 15,
        comments: [],
        createdAt: "2023-11-15T08:45:00Z",
        userLiked: false,
      },
      {
        id: "post4",
        userId: "user7",
        userName: "Saad Ali",
        type: "syllabus",
        title: "Complete CSS Exam Syllabus",
        preview: "Full syllabus with all subjects for CSS Examination",
        content: {
          subjects: [
            {
              name: "English",
              topics: ["Essay", "Précis", "Composition", "Grammar"],
            },
            {
              name: "Pakistan Affairs",
              topics: ["History", "Geography", "Economy", "Culture"],
            },
            {
              name: "Islamic Studies",
              topics: ["Basic Concepts", "History", "Ethics"],
            },
            {
              name: "Current Affairs",
              topics: ["National", "International", "Economic"],
            },
          ],
        },
        likes: 52,
        comments: [
          {
            id: "comment4",
            userId: "user8",
            userName: "Nadia Hussain",
            content: "This is the most comprehensive syllabus I've seen!",
            createdAt: "2023-11-11T19:15:00Z",
          },
        ],
        createdAt: "2023-11-08T14:20:00Z",
        userLiked: true,
      },
      {
        id: "post5",
        userId: "user9",
        userName: "Hamza Malik",
        type: "note",
        title: "CSS Grid Layout Mastery",
        preview: "Advanced techniques for CSS Grid layouts",
        content: {
          title: "CSS Grid Layout Mastery",
          text: '# CSS Grid Layout Mastery\n\nCSS Grid Layout is a powerful two-dimensional layout system designed for the web. It lets you layout items in rows and columns simultaneously.\n\n## Advanced Techniques\n\n- Grid Template Areas\n- Auto-fit and Auto-fill\n- Minmax Function\n- Named Grid Lines\n\n## Example\n\n```css\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  grid-gap: 20px;\n  grid-template-areas:\n    "header header header"\n    "sidebar content content"\n    "footer footer footer";\n}\n```',
        },
        likes: 18,
        comments: [
          {
            id: "comment5",
            userId: "user10",
            userName: "Asad Khan",
            content: "This helped me understand grid areas much better!",
            createdAt: "2023-11-14T11:20:00Z",
          },
        ],
        createdAt: "2023-11-13T15:30:00Z",
        userLiked: false,
      },
      {
        id: "post6",
        userId: "user11",
        userName: "Sana Javed",
        type: "subject",
        title: "Islamic Studies Syllabus",
        preview: "Detailed breakdown of Islamic Studies for CSS",
        content: {
          name: "Islamic Studies",
          topics: [
            {
              name: "Basic Concepts",
              subtopics: ["Tawhid", "Risalat", "Akhirah"],
            },
            {
              name: "Islamic History",
              subtopics: ["Early Period", "Golden Age", "Modern Era"],
            },
            {
              name: "Islamic Ethics",
              subtopics: ["Personal Ethics", "Social Ethics", "Economic Ethics"],
            },
          ],
        },
        likes: 29,
        comments: [],
        createdAt: "2023-11-12T09:45:00Z",
        userLiked: false,
      },
    ]

    setPosts(mockPosts)
    setFilteredPosts(mockPosts)
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...posts]

    // Apply type filter
    if (filter !== "all") {
      filtered = filtered.filter((post) => post.type === filter)
    }

    // Apply sorting
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === "likes") {
      filtered.sort((a, b) => b.likes - a.likes)
    }

    setFilteredPosts(filtered)
  }, [posts, filter, sortBy])

  // Update the handleLikePost function to trigger a notification
  const handleLikePost = (postId: string) => {
    // Find the post
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    // Check if we're liking or unliking
    const isLiking = !post.userLiked

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const wasLiked = post.userLiked
          return {
            ...post,
            likes: wasLiked ? post.likes - 1 : post.likes + 1,
            userLiked: !wasLiked,
          }
        }
        return post
      }),
    )

    // If we're liking (not unliking) and it's not our own post, create a notification
    if (isLiking && post.userId !== user?.id) {
      addNotification({
        type: "like",
        message: `You liked ${post.userName}'s ${post.type === "note" ? "note" : post.type === "notes" ? "notes" : post.type === "subject" ? "subject" : "syllabus"} on ${post.title}`,
        postId: post.id,
        userId: user?.id,
        userName: user?.name,
      })

      // Add toast notification
      addToast(`You liked ${post.userName}'s post`, "success")
    }

    // TODO: Update like in Firestore
  }

  // Update the handleAddComment function to trigger a notification
  const handleAddComment = () => {
    if (!selectedPost || !commentInput.trim() || !user) return

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      content: commentInput,
      createdAt: new Date().toISOString(),
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      }),
    )

    // Update selected post
    setSelectedPost((prev) => {
      if (!prev) return null
      return {
        ...prev,
        comments: [...prev.comments, newComment],
      }
    })

    // If it's not our own post, create a notification
    if (selectedPost.userId !== user.id) {
      addNotification({
        type: "comment",
        message: `You commented on ${selectedPost.userName}'s ${selectedPost.type === "note" ? "note" : selectedPost.type === "notes" ? "notes" : selectedPost.type === "subject" ? "subject" : "syllabus"} on ${selectedPost.title}`,
        postId: selectedPost.id,
        userId: user.id,
        userName: user.name,
      })

      // Add toast notification
      addToast("Comment added successfully", "success")
    }

    // Reset comment input and close modal
    setCommentInput("")
    setIsCommentModalOpen(false)

    // TODO: Save comment to Firestore
  }

  // Update the handleIncorporate function to trigger a notification
  const handleIncorporate = (post: Post) => {
    // TODO: Incorporate content into user's syllabus/notes
    console.log("Incorporating content:", post)

    // If it's not our own post, create a notification
    if (post.userId !== user?.id) {
      addNotification({
        type: "incorporate",
        message: `You incorporated ${post.userName}'s ${post.type === "note" ? "note" : post.type === "notes" ? "notes" : post.type === "subject" ? "subject" : "syllabus"} on ${post.title}`,
        postId: post.id,
        userId: user?.id,
        userName: user?.name,
      })
    }

    // Add toast notification
    addToast(`Content added to your ${post.type === "note" || post.type === "notes" ? "notes" : "syllabus"}`, "success")
  }

  // Handle sharing a post
  const handleSharePost = (post: Post) => {
    // Create a shareable link or copy to clipboard
    const shareableLink = `https://cssprep.app/community/post/${post.id}`

    // Copy to clipboard
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => {
        addToast("Link copied to clipboard!", "success")
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err)
        addToast("Failed to copy link. Please try again.", "error")
      })
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} days ago`
    }

    return date.toLocaleDateString()
  }

  // Render post preview based on type
  const renderPostPreview = (post: Post) => {
    switch (post.type) {
      case "note":
        return (
          <div>
            <h3 className="font-medium mb-1">{post.title}</h3>
            <p className="text-secondary-foreground text-sm line-clamp-2">{post.preview}</p>
          </div>
        )
      case "notes":
        const notesCount = Array.isArray(post.content) ? post.content.length : 0
        return (
          <div>
            <h3 className="font-medium mb-1">{post.title}</h3>
            <p className="text-secondary-foreground text-sm">{notesCount} notes shared</p>
          </div>
        )
      case "subject":
        const topicsCount = post.content.topics ? post.content.topics.length : 0
        return (
          <div>
            <h3 className="font-medium mb-1">{post.title}</h3>
            <p className="text-secondary-foreground text-sm">Subject with {topicsCount} topics</p>
          </div>
        )
      case "syllabus":
        const subjectsCount = post.content.subjects ? post.content.subjects.length : 0
        return (
          <div>
            <h3 className="font-medium mb-1">{post.title}</h3>
            <p className="text-secondary-foreground text-sm">Full syllabus with {subjectsCount} subjects</p>
          </div>
        )
      default:
        return <p>Unknown post type</p>
    }
  }

  // Render post content based on type
  const renderPostContent = (post: Post) => {
    switch (post.type) {
      case "note":
        return (
          <div className="markdown-preview p-4">
            <h2 className="text-2xl font-bold mb-4">{post.content.title}</h2>
            <ReactMarkdown>{post.content.text}</ReactMarkdown>
          </div>
        )
      case "notes":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
            <div className="space-y-6">
              {Array.isArray(post.content) &&
                post.content.map((note, index) => (
                  <div key={index} className="p-4 bg-[#2D2D2D]/50 rounded-md">
                    <h3 className="text-lg font-bold mb-2">{note.title}</h3>
                    <div className="markdown-preview">
                      <ReactMarkdown>{note.text}</ReactMarkdown>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )
      case "subject":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{post.content.name}</h2>
            <div className="space-y-4">
              {post.content.topics &&
                post.content.topics.map((topic: any, index: number) => (
                  <div key={index} className="p-3 bg-[#2D2D2D]/50 rounded-md">
                    <h3 className="text-lg font-bold mb-2">{topic.name}</h3>
                    {topic.subtopics && (
                      <ul className="list-disc pl-6">
                        {topic.subtopics.map((subtopic: string, idx: number) => (
                          <li key={idx} className="mb-1">
                            {subtopic}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )
      case "syllabus":
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
            <div className="space-y-4">
              {post.content.subjects &&
                post.content.subjects.map((subject: any, index: number) => (
                  <div key={index} className="p-3 bg-[#2D2D2D]/50 rounded-md">
                    <h3 className="text-lg font-bold mb-2">{subject.name}</h3>
                    {subject.topics && (
                      <ul className="list-disc pl-6">
                        {subject.topics.map((topic: string, idx: number) => (
                          <li key={idx} className="mb-1">
                            {topic}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )
      default:
        return <p>Unknown post type</p>
    }
  }

  if (authLoading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading community hub..." />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Community Hub</h1>
            <p className="text-secondary-foreground">Explore and share study resources with the CSS community</p>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <GlassCard className="mb-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center justify-between md:justify-start">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            <button
              className="md:hidden flex items-center text-sm text-secondary-foreground"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            >
              {isFilterExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 ml-1" />
                  <span className="sr-only">Collapse filters</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 ml-1" />
                  <span className="sr-only">Expand filters</span>
                </>
              )}
            </button>
          </div>

          <div className={`flex flex-wrap gap-2 ${isFilterExpanded || "md:flex hidden"}`}>
            <Button variant={filter === "all" ? "default" : "ghost"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "note" ? "default" : "ghost"} size="sm" onClick={() => setFilter("note")}>
              Notes
            </Button>
            <Button variant={filter === "notes" ? "default" : "ghost"} size="sm" onClick={() => setFilter("notes")}>
              Note Collections
            </Button>
            <Button variant={filter === "subject" ? "default" : "ghost"} size="sm" onClick={() => setFilter("subject")}>
              Subjects
            </Button>
            <Button
              variant={filter === "syllabus" ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter("syllabus")}
            >
              Syllabus
            </Button>
          </div>

          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent" | "likes")}
              className="px-3 py-1.5 bg-[#2D2D2D] text-white border border-white/10 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="likes">Most Liked</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <GlassCard>
            <div className="py-10 text-center">
              <Globe className="w-12 h-12 text-secondary-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No posts found</h3>
              <p className="text-secondary-foreground mb-4">Try adjusting your filters or check back later</p>
            </div>
          </GlassCard>
        ) : (
          filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="hover:border-primary/30 transition-colors cursor-pointer">
                <div className="p-4">
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                        {post.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{post.userName}</p>
                        <p className="text-xs text-secondary-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                      {post.type === "note"
                        ? "Note"
                        : post.type === "notes"
                          ? "Notes"
                          : post.type === "subject"
                            ? "Subject"
                            : "Syllabus"}
                    </div>
                  </div>

                  {/* Post Content Preview */}
                  <div
                    className="mb-4"
                    onClick={() => {
                      setSelectedPost(post)
                      setIsPostModalOpen(true)
                    }}
                  >
                    {renderPostPreview(post)}
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center gap-4 border-t border-white/10 pt-3">
                    <button
                      className={`flex items-center gap-1 text-sm ${post.userLiked ? "text-primary" : "text-secondary-foreground"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLikePost(post.id)
                      }}
                    >
                      <Heart className={`w-4 h-4 ${post.userLiked ? "fill-primary" : ""}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      className="flex items-center gap-1 text-sm text-secondary-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPost(post)
                        setIsCommentModalOpen(true)
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length}</span>
                    </button>
                    <button
                      className="flex items-center gap-1 text-sm text-secondary-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSharePost(post)
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button
                      className="flex items-center gap-1 text-sm text-secondary-foreground ml-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleIncorporate(post)
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Incorporate</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>

      {/* Post Content Modal */}
      <AnimatePresence>
        {isPostModalOpen && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setIsPostModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                    {selectedPost.userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{selectedPost.userName}</p>
                    <p className="text-xs text-secondary-foreground">{formatDate(selectedPost.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleIncorporate(selectedPost)}>
                    <Plus className="w-4 h-4 mr-1" />
                    Incorporate
                  </Button>
                  <button onClick={() => setIsPostModalOpen(false)} className="p-1 text-secondary-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">{renderPostContent(selectedPost)}</div>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <button
                    className={`flex items-center gap-1 ${selectedPost.userLiked ? "text-primary" : "text-secondary-foreground"}`}
                    onClick={() => handleLikePost(selectedPost.id)}
                  >
                    <Heart className={`w-4 h-4 ${selectedPost.userLiked ? "fill-primary" : ""}`} />
                    <span>{selectedPost.likes}</span>
                  </button>
                  <button
                    className="flex items-center gap-1 text-secondary-foreground"
                    onClick={() => {
                      setIsPostModalOpen(false)
                      setIsCommentModalOpen(true)
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{selectedPost.comments.length} Comments</span>
                  </button>
                  <button
                    className="flex items-center gap-1 text-secondary-foreground ml-auto"
                    onClick={() => handleSharePost(selectedPost)}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Link</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments Modal */}
      <AnimatePresence>
        {isCommentModalOpen && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setIsCommentModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-bold">Comments</h3>
                <button onClick={() => setIsCommentModalOpen(false)} className="p-1 text-secondary-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {selectedPost.comments.length === 0 ? (
                  <div className="py-8 text-center text-secondary-foreground">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-[#2D2D2D]/50 rounded-md">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-2 text-xs">
                            {comment.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{comment.userName}</p>
                            <p className="text-xs text-secondary-foreground">{formatDate(comment.createdAt)}</p>
                          </div>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 bg-[#2D2D2D] text-white border border-white/10 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAddComment()
                      }
                    }}
                  />
                  <Button onClick={handleAddComment} disabled={!commentInput.trim()}>
                    Post
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State - No Content */}
      {posts.length === 0 && (
        <GlassCard>
          <EmptyState
            icon={Globe}
            title="No community content yet"
            description="Be the first to share your notes or syllabus with the CSS community. Share your knowledge and help others succeed!"
            action={{
              label: "Share Your First Note",
              onClick: () => router.push("/notes"),
            }}
          />
        </GlassCard>
      )}
    </MainLayout>
  )
}
