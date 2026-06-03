import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, ThumbsUp, MessageCircle, Plus, Flame, 
  User, Calendar, Compass, Sparkles, Send, Check, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ForumPost, ForumReply } from '../types';

interface ForumBoardProps {
  isAdmin?: boolean;
  onPostDeleted?: (id: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Discussions', emoji: '🌐' },
  { id: 'tricks', label: 'Chef Tricks 🔥', emoji: '🔥' },
  { id: 'favorites', label: 'Menu Favorites 🍣', emoji: '🍣' },
  { id: 'students', label: 'Cornell & Student Life 🎓', emoji: '🎓' },
  { id: 'general', label: 'General Chit-Chat 💬', emoji: '💬' }
];

const PRESET_AVATARS = ['🔥', '🍣', '🍤', '🍱', '🎓', '🥩', '🐉', '⭐', '🍜', '🌋'];

export default function ForumBoard({ isAdmin = false }: ForumBoardProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New post form states
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('tricks');
  const [selectedAvatar, setSelectedAvatar] = useState('🔥');
  const [isSuccess, setIsSuccess] = useState(false);

  // New reply state
  const [replyInputs, setReplyInputs] = useState<{[postId: string]: string}>({});
  const [replyAuthors, setReplyAuthors] = useState<{[postId: string]: string}>({});
  const [activeReplyBox, setActiveReplyBox] = useState<string | null>(null);

  // Load initial posts from localStorage or mock
  useEffect(() => {
    const saved = localStorage.getItem('tokyo_hibachi_forum_posts');
    if (saved) {
      setPosts(JSON.parse(saved));
    } else {
      const initial: ForumPost[] = [
        {
          id: 'post-1',
          category: 'tricks',
          author: 'Brendan S. (Cornell Senior)',
          avatarText: '🎓',
          title: 'Tips on how to catch the flying shrimp? 🍤',
          content: 'I missed twice last Saturday! The chef Kenji flicked it exactly at my mouth but it hit me on the forehead. Any veterans have some catching techniques? I swear my friend swallowed it in one try.',
          date: 'yesterday at 7:45 PM',
          likes: 24,
          replies: [
            {
              id: 'rep-1-1',
              author: 'Diner Dave',
              avatarText: '🌋',
              content: 'Haha, the key is to not close your eyes at the last second! Also, keep your mouth wide open and follow the arc. If you back down, it bounces off right away. Good luck next time!',
              date: 'yesterday at 8:12 PM'
            },
            {
              id: 'rep-1-2',
              author: 'Chef Kenji Support',
              avatarText: '🍤',
              content: 'Actually, as the chef, I always aim for the tip of the chin or direct arc. Open wide, stay completely steady, and trust the spatula! See you soon!',
              date: 'today at 10:20 AM'
            }
          ]
        },
        {
          id: 'post-2',
          category: 'favorites',
          author: 'Dr. Evelyn Clark',
          avatarText: '⭐',
          title: 'The Secret Yum-Yum Sauce Mystery 🥣',
          content: 'Okay, I am legally obsessed with the Tokyo Hibachi Yum-Yum sauce. It is so creamy and tangy compared to other places. Has anyone managed to deduce if they use fresh ginger juice or sweet saké inside? Let\'s guess the secret recipe!',
          date: 'May 30, 2026',
          likes: 38,
          replies: [
            {
              id: 'rep-2-1',
              author: 'SushiLover_NY',
              avatarText: '🍱',
              content: 'Definitely sweet paprika, garlic powder, melted butter, Japanese mayo (Kewpie), and a subtle dash of mirin! That\'s how they get that glorious gold shine.',
              date: 'May 30, 2026'
            }
          ]
        },
        {
          id: 'post-3',
          category: 'students',
          author: 'Meera Patel',
          avatarText: '🐉',
          title: 'Cornell Student Birthdays Offer Info?',
          content: 'Is there a discount or birthday drum for student birthday parties? We are planning a party of 12 next Friday on the big corner Teppan table. Please share details!',
          date: 'May 28, 2026',
          likes: 15,
          replies: [
            {
              id: 'rep-3-1',
              author: 'Tokyo Hibachi Hostess',
              avatarText: '🐉',
              content: 'Yes, absolutely Meera! For table reservations celebrating a birthday (especially larger groups 8+), we do a special birthday celebration with Japanese drums (Taiko), a complimentary dessert, and full table applause! Please mention it in the booking requests form.',
              date: 'May 28, 2026'
            }
          ]
        }
      ];
      localStorage.setItem('tokyo_hibachi_forum_posts', JSON.stringify(initial));
      setPosts(initial);
    }
  }, []);

  const savePosts = (newPosts: ForumPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('tokyo_hibachi_forum_posts', JSON.stringify(newPosts));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newAuthor.trim()) return;

    const newPostObj: ForumPost = {
      id: `post-${Date.now()}`,
      category: newCategory,
      author: newAuthor.trim(),
      avatarText: selectedAvatar,
      title: newTitle.trim(),
      content: newContent.trim(),
      date: 'Just now',
      likes: 0,
      replies: []
    };

    const updated = [newPostObj, ...posts];
    savePosts(updated);
    
    // Clear inputs
    setNewTitle('');
    setNewContent('');
    setNewAuthor('');
    setIsCreatingPost(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleAddReply = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const replyText = replyInputs[postId] || '';
    const nameText = replyAuthors[postId] || 'Anonymous Patron';
    if (!replyText.trim()) return;

    const newReply: ForumReply = {
      id: `rep-${Date.now()}`,
      author: nameText.trim(),
      avatarText: '💬',
      content: replyText.trim(),
      date: 'Just now'
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, replies: [...p.replies, newReply] };
      }
      return p;
    });

    savePosts(updated);

    // Clear specific input state
    setReplyInputs(prev => ({ ...prev, [postId]: '' }));
    setReplyAuthors(prev => ({ ...prev, [postId]: '' }));
    setActiveReplyBox(null);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Are you sure you want to delete this forum post permanently?')) {
      const updated = posts.filter(p => p.id !== postId);
      savePosts(updated);
    }
  };

  // Filter posts based on category and query searching
  const filteredPosts = posts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="forum" className="py-24 bg-zinc-950 px-4 md:px-8 border-b border-zinc-900 scroll-mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest font-bold">
            <MessageSquare className="w-3.5 h-3.5" /> Tokyo Hibachi Club
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white tracking-tight">
            Patron Guest Forum
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-xs md:text-sm leading-relaxed">
            Connect with Ithaca locals and student foodies! Discuss your favorite chef shows, discover recipes, share birthday booking stories, or coordinate grill gatherings.
          </p>
        </div>

        {/* Search & Action Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 pb-6 border-b border-zinc-900">
          {/* Categories select pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium uppercase font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-gold-400 text-black border border-gold-400 font-bold'
                    : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search bar & Trigger Button */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search forum threads..."
                value={searchQuery}
                aria-label="Search forum threads"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-xs rounded px-3 py-2.5 focus:outline-none focus:border-gold-400 text-white placeholder-zinc-500"
              />
            </div>

            <button
              id="btn-create-thread-trigger"
              onClick={() => setIsCreatingPost(!isCreatingPost)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded inline-flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" /> Start Thread
            </button>
          </div>
        </div>

        {/* Success Prompt */}
        {isSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-xs mb-6 max-w-2xl mx-auto flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <div>
              <strong>Thread Published!</strong> Your topic is now live on the forum page for other foodies to respond.
            </div>
          </div>
        )}

        {/* Interactive Thread Creation Box */}
        <AnimatePresence>
          {isCreatingPost && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-10 max-w-3xl mx-auto"
            >
              <form 
                onSubmit={handleCreatePost}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-4 text-left shadow-2xl relative"
              >
                <h3 className="text-white font-serif font-semibold text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-400" /> Start a New Community Thread
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Your Username/Nick</label>
                    <input
                      type="text"
                      placeholder="e.g., CornellSteakFan"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-gold-400"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Discussion Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-gold-400 select-custom"
                    >
                      <option value="tricks">Chef Tricks 🔥</option>
                      <option value="favorites">Menu Favorites 🍣</option>
                      <option value="students">Cornell & Student Life 🎓</option>
                      <option value="general">General Chit-Chat 💬</option>
                    </select>
                  </div>
                </div>

                {/* Avatar presets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Pick Discussion Emblem</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PRESET_AVATARS.map(avatar => (
                      <button
                        key={avatar}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`w-9 h-9 text-base rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          selectedAvatar === avatar 
                            ? 'bg-gold-400/20 border-gold-400 scale-110' 
                            : 'bg-zinc-950 border-zinc-850 hover:bg-zinc-800'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Thread Title</label>
                  <input
                    type="text"
                    placeholder="Briefly capture your query or experience..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white rounded px-3 py-2.5 text-xs focus:outline-none focus:border-gold-400 font-serif"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase block">Write your request or post details</label>
                  <textarea
                    rows={4}
                    placeholder="Elaborate details so other diners can drop solutions..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded p-3 text-xs focus:outline-none focus:border-gold-400 resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingPost(false)}
                    className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white rounded text-xs uppercase tracking-wider font-mono cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gold-400 hover:bg-gold-500 text-black font-extrabold text-xs uppercase tracking-wider rounded cursor-pointer transition-colors shadow"
                  >
                    Publish Thread
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Threads List Layout */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800/65 rounded-2xl py-12 px-6 text-center text-zinc-500 space-y-3">
              <Compass className="w-10 h-10 mx-auto text-zinc-700 animate-pulse" />
              <p className="text-sm font-mono">No active community threads match your search terms.</p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 hover:text-white rounded text-xs uppercase tracking-widest font-mono border border-zinc-700 transition"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredPosts.map(post => {
              const catObj = CATEGORIES.find(c => c.id === post.category);
              return (
                <div
                  key={post.id}
                  className="bg-zinc-900 border border-zinc-900/90 rounded-2xl p-6 md:p-8 text-left hover:border-zinc-800 transition-all flex flex-col md:flex-row gap-5 items-start relative group"
                >
                  {/* Left Avatar Column */}
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0 shadow-lg text-xl">
                    {post.avatarText}
                  </div>

                  {/* Main content body */}
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      {/* Topic Category badge */}
                      <span className="bg-zinc-950/80 border border-zinc-800 text-[#f5eebd] px-2.5 py-1 rounded text-[9.5px] uppercase font-mono tracking-wider font-semibold">
                        {catObj ? `${catObj.emoji} ${catObj.label}` : '💬 Discussion'}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Posted by <strong className="text-zinc-400">{post.author}</strong> • {post.date}
                      </span>
                    </div>

                    <h3 className="text-white font-serif font-semibold text-lg md:text-xl group-hover:text-gold-300 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-zinc-400 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Likes & replies footer row */}
                    <div className="flex flex-wrap gap-3 items-center justify-between pt-4 border-t border-zinc-950/80">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className="px-3 py-1.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-gold-400 text-[11px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer hover:scale-[1.03] transition-all"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" /> Like Thread &nbsp;
                          <span className="bg-gold-400/10 text-gold-400 font-mono text-xs px-1.5 py-0.5 rounded font-black">{post.likes}</span>
                        </button>

                        <button
                          onClick={() => setActiveReplyBox(activeReplyBox === post.id ? null : post.id)}
                          className="px-3 py-1.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-700 text-zinc-300 text-[11px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-zinc-500" /> Leave Comment
                        </button>
                      </div>

                      {/* Delete logic for Admin */}
                      {(isAdmin || localStorage.getItem('tokyo_hibachi_admin_logged') === 'true') && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-[10px] text-red-400 bg-red-400/5 hover:bg-red-400/10 border border-red-500/15 px-2.5 py-1 rounded hover:text-red-300 cursor-pointer transition-colors"
                        >
                          Delete Thread
                        </button>
                      )}
                    </div>

                    {/* Active Reply box */}
                    <AnimatePresence>
                      {activeReplyBox === post.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-4 pt-4 border-t border-zinc-950"
                        >
                          <form onSubmit={(e) => handleAddReply(post.id, e)} className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-850">
                            <span className="text-[10px] text-zinc-500 font-mono tracking-widest block uppercase">Post a Response</span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="Your Nickname"
                                value={replyAuthors[post.id] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setReplyAuthors(prev => ({ ...prev, [post.id]: val }));
                                }}
                                className="bg-zinc-900 border border-zinc-800 text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-gold-400 w-full"
                                required
                              />
                              <div className="text-[10px] text-zinc-600 flex items-center justify-end">
                                * Your reply matches current thread instantly
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add your helpful comment or answer..."
                                value={replyInputs[post.id] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setReplyInputs(prev => ({ ...prev, [post.id]: val }));
                                }}
                                className="bg-zinc-900 border border-zinc-850 text-white rounded px-3 py-2 text-xs focus:outline-none focus:border-red-500 flex-1 placeholder-zinc-600"
                                required
                              />
                              <button
                                type="submit"
                                aria-label="Reply to thread"
                                className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded cursor-pointer transition-colors shrink-0"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Replied details (nested comments rendering) */}
                    {post.replies.length > 0 && (
                      <div className="space-y-2 mt-4 pt-4 border-t border-zinc-950/70">
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider block uppercase mb-2">Replies Received ({post.replies.length})</span>
                        
                        <div className="space-y-2.5 pl-3 border-l-2 border-red-500/25">
                          {post.replies.map(reply => (
                            <div key={reply.id} className="bg-zinc-950/60 p-3.5 rounded-lg border border-zinc-950 text-xs">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="font-semibold text-white flex items-center gap-1.5 font-mono">
                                  <span className="text-[10.5px] p-0.5 bg-zinc-900 border border-zinc-800 rounded">💬</span> {reply.author}
                                </span>
                                <span className="text-[9.5px] text-zinc-650 font-mono">{reply.date}</span>
                              </div>
                              <p className="text-zinc-400 leading-relaxed font-sans">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
