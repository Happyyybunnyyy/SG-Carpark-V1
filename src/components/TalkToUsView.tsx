import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    disqus_config?: () => void;
    DISQUS?: {
      reset: (params: { reload: boolean; config?: () => void }) => void;
    };
  }
}

interface TalkToUsViewProps {
  onBackToCarparks: () => void;
}

interface Reaction {
  id: string;
  emoji: string;
  label: string;
  count: number;
}

interface CommentItem {
  id: string;
  author: string;
  initial: string;
  text: string;
  timestamp: string;
  upvotes: number;
  hasUpvoted: boolean;
}

const DEFAULT_REACTIONS: Reaction[] = [
  { id: 'upvote', emoji: '👍', label: 'Upvote', count: 12 },
  { id: 'funny', emoji: '😝', label: 'Funny', count: 3 },
  { id: 'love', emoji: '😍', label: 'Love', count: 18 },
  { id: 'surprised', emoji: '😮', label: 'Surprised', count: 4 },
  { id: 'angry', emoji: '😤', label: 'Angry', count: 1 },
  { id: 'sad', emoji: '😢', label: 'Sad', count: 0 },
];

const SEED_COMMENTS: CommentItem[] = [
  {
    id: 'c-seed-1',
    author: 'Yiwan',
    initial: 'Y',
    text: "(Testing) Hi it's me! Really enjoying the real-time carpark availability and ERP rates feature.",
    timestamp: '15 mins ago',
    upvotes: 2,
    hasUpvoted: true,
  },
  {
    id: 'c-seed-2',
    author: 'Kelvin T.',
    initial: 'K',
    text: 'Great app for Orchard shopping weekends. Would love to see EV charger lot statuses in the next update!',
    timestamp: '1 hour ago',
    upvotes: 5,
    hasUpvoted: false,
  },
];

const DISQUS_SHORTNAME = 'bunny-carpark';
const PAGE_IDENTIFIER = 'sgcarmart-talk-to-us';
const PAGE_TITLE = 'Talk to Us - sgCarMart Carpark Rates Community';

export const TalkToUsView: React.FC<TalkToUsViewProps> = ({ onBackToCarparks }) => {
  const [isReloading, setIsReloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Community reactions state
  const [reactions, setReactions] = useState<Reaction[]>(() => {
    try {
      const saved = localStorage.getItem('sgcarpark_talk_reactions');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_REACTIONS;
  });

  const [userReaction, setUserReaction] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sgcarpark_user_reaction');
    } catch {
      return null;
    }
  });

  // Comments state
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem('sgcarpark_talk_comments');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SEED_COMMENTS;
  });

  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('Yiwan');
  const [isEditingName, setIsEditingName] = useState(false);
  const [sortOrder, setSortOrder] = useState<'best' | 'newest' | 'oldest'>('best');
  const [isLikedTopic, setIsLikedTopic] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sgcarpark_talk_reactions', JSON.stringify(reactions));
      if (userReaction) {
        localStorage.setItem('sgcarpark_user_reaction', userReaction);
      } else {
        localStorage.removeItem('sgcarpark_user_reaction');
      }
    } catch {}
  }, [reactions, userReaction]);

  useEffect(() => {
    try {
      localStorage.setItem('sgcarpark_talk_comments', JSON.stringify(comments));
    } catch {}
  }, [comments]);

  const totalReactions = reactions.reduce((acc, r) => acc + r.count, 0);

  const handleToggleReaction = (id: string) => {
    setReactions((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (userReaction === id) {
            return { ...item, count: Math.max(0, item.count - 1) };
          }
          return { ...item, count: item.count + 1 };
        }
        if (item.id === userReaction && userReaction !== id) {
          return { ...item, count: Math.max(0, item.count - 1) };
        }
        return item;
      })
    );
    setUserReaction((prev) => (prev === id ? null : id));
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = newCommentText.trim();
    if (!text) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: authorName || 'Driver',
      initial: (authorName || 'D').charAt(0).toUpperCase(),
      text,
      timestamp: 'Just now',
      upvotes: 0,
      hasUpvoted: false,
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentText('');
  };

  const handleToggleCommentUpvote = (id: string) => {
    setComments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextUpvoted = !item.hasUpvoted;
          return {
            ...item,
            hasUpvoted: nextUpvoted,
            upvotes: nextUpvoted ? item.upvotes + 1 : Math.max(0, item.upvotes - 1),
          };
        }
        return item;
      })
    );
  };

  const handleShareLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch {}
  };

  // Disqus loader & SPA tab reset
  const loadDisqus = () => {
    setIsReloading(true);
    const canonicalUrl =
      typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null'
        ? `${window.location.origin}/#talk-to-us`
        : 'https://sg-carpark-v1.vercel.app/#talk-to-us';

    try {
      if (typeof window !== 'undefined' && window.DISQUS) {
        window.DISQUS.reset({
          reload: true,
          config: function (this: any) {
            this.page = this.page || {};
            this.page.url = canonicalUrl;
            this.page.identifier = PAGE_IDENTIFIER;
            this.page.title = PAGE_TITLE;
          },
        });
        setTimeout(() => setIsReloading(false), 500);
      } else {
        window.disqus_config = function (this: any) {
          this.page = this.page || {};
          this.page.url = canonicalUrl;
          this.page.identifier = PAGE_IDENTIFIER;
          this.page.title = PAGE_TITLE;
        };

        const existingScript = document.getElementById('disqus-embed-script');
        if (existingScript) {
          setTimeout(() => {
            try {
              if (window.DISQUS) {
                window.DISQUS.reset({
                  reload: true,
                  config: function (this: any) {
                    this.page = this.page || {};
                    this.page.url = canonicalUrl;
                    this.page.identifier = PAGE_IDENTIFIER;
                    this.page.title = PAGE_TITLE;
                  },
                });
              }
            } catch {}
            setIsReloading(false);
          }, 300);
        } else {
          const doc = document;
          const s = doc.createElement('script');
          s.id = 'disqus-embed-script';
          s.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
          s.setAttribute('data-timestamp', String(+new Date()));
          s.onload = () => setIsReloading(false);
          s.onerror = () => setIsReloading(false);
          (doc.head || doc.body).appendChild(s);
        }
      }
    } catch {
      setIsReloading(false);
    }
  };

  useEffect(() => {
    loadDisqus();
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  }, []);

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === 'best') return b.upvotes - a.upvotes;
    if (sortOrder === 'newest') return b.id.localeCompare(a.id);
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8" data-purpose="talk-to-us-view">
      {/* Top Header Card Matching Template */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-2">
            <span className="material-symbols-outlined text-[16px]">forum</span>
            <span>DRIVER COMMUNITY & FEEDBACK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
            Talk to Us
          </h1>
          <p className="text-secondary text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            Have questions about carpark rates, feedback on lot availability accuracy, or feature ideas for sgCarMart Carpark Rates? Join the discussion below or leave a note for our team.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={loadDisqus}
            disabled={isReloading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-surface-container hover:border-primary/40 text-secondary hover:text-on-surface text-xs font-semibold shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[16px] text-primary ${
                isReloading ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span>Reload Discussion</span>
          </button>

          <button
            type="button"
            onClick={onBackToCarparks}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Back to Carparks</span>
          </button>
        </div>
      </div>

      {/* 3 Info Cards Grid from Template */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-surface-container shadow-2xs transition hover:border-primary/30">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Feature Requests</h2>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                Suggest new carparks, EV charging filters, grace period alerts, or customizable rates.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-surface-container shadow-2xs transition hover:border-primary/30">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">pin_drop</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Rate & Lot Feedback</h2>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                Found a carpark price change or availability discrepancy? Let the community know.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-surface-container shadow-2xs transition hover:border-primary/30">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Community Guidelines</h2>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                Be respectful to fellow drivers. Spam and offensive speech are moderated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feedback & Discussion Card from Template */}
      <div className="bg-white border border-surface-container rounded-2xl shadow-xs p-6 sm:p-8 space-y-6">
        {/* Reactions Section */}
        <div className="text-center">
          <h2 className="text-base sm:text-lg font-bold text-on-surface">What do you think?</h2>
          <p className="text-xs text-secondary mt-0.5">{totalReactions} Responses</p>

          <div className="flex items-center justify-center gap-3 sm:gap-6 mt-5 overflow-x-auto py-2">
            {reactions.map((r) => {
              const isSelected = userReaction === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleToggleReaction(r.id)}
                  className={`group flex flex-col items-center gap-1 cursor-pointer transition-transform duration-150 active:scale-95 focus:outline-none ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                  title={`${r.label} (${r.count})`}
                >
                  <span className="text-3xl sm:text-4xl filter drop-shadow-xs transition-transform group-hover:-translate-y-1">
                    {r.emoji}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-primary font-bold' : 'text-secondary group-hover:text-on-surface'
                    }`}
                  >
                    {r.count}
                  </span>
                  <span className="text-[11px] text-secondary group-hover:text-on-surface">
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-surface-container my-6" />

        {/* Comment Header with Display Name Picker */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-on-surface">{comments.length} Comments</span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsEditingName(!isEditingName)}
              className="inline-flex items-center gap-1.5 text-secondary hover:text-on-surface font-medium py-1 px-2 rounded-lg hover:bg-surface-container transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">person</span>
              <span>{authorName}</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </button>

            {isEditingName && (
              <div className="absolute right-0 mt-1 z-20 w-48 p-2 rounded-xl bg-white border border-surface-container shadow-lg">
                <label className="block text-[10px] text-secondary mb-1 font-semibold uppercase tracking-wider">
                  Your Display Name
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter name..."
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="p-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white shrink-0"
                  >
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comment Post Form */}
        <form onSubmit={handlePostComment} className="mb-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container border border-surface-container flex items-center justify-center text-primary font-bold text-sm shrink-0 shadow-2xs">
              {(authorName || 'Y').charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="(Testing) Hi it's me"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container text-sm text-on-surface placeholder-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              />

              <div className="flex items-center justify-between mt-2.5 px-1">
                <div className="flex items-center gap-4 text-xs text-secondary">
                  <button
                    type="button"
                    onClick={() => setIsLikedTopic(!isLikedTopic)}
                    className={`inline-flex items-center gap-1 hover:text-on-surface transition cursor-pointer ${
                      isLikedTopic ? 'text-rose-500 font-medium' : ''
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isLikedTopic ? 'favorite' : 'favorite_border'}
                    </span>
                    <span>{isLikedTopic ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareLink}
                    className="inline-flex items-center gap-1 hover:text-on-surface transition cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">share</span>
                    <span>{copiedLink ? 'Copied link!' : 'Share'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-secondary">
                    {(['best', 'newest', 'oldest'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setSortOrder(mode)}
                        className={`capitalize px-1.5 py-0.5 rounded transition cursor-pointer ${
                          sortOrder === mode
                            ? 'text-primary font-bold underline underline-offset-4 decoration-primary'
                            : 'hover:text-on-surface'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:hover:bg-primary text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Comment Thread List */}
        {sortedComments.length > 0 && (
          <div className="space-y-3.5 mb-8">
            {sortedComments.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-container-low border border-surface-container hover:border-surface-container-high transition"
              >
                <div className="w-8 h-8 rounded-full bg-surface-container border border-surface-container flex items-center justify-center text-xs font-bold text-secondary shrink-0">
                  {c.initial}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-on-surface truncate">
                      {c.author}
                    </span>
                    <span className="text-[11px] text-secondary shrink-0">{c.timestamp}</span>
                  </div>
                  <p className="text-xs text-on-surface mt-1 leading-relaxed break-words">
                    {c.text}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => handleToggleCommentUpvote(c.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium transition cursor-pointer ${
                        c.hasUpvoted ? 'text-primary font-bold' : 'text-secondary hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                      <span>{c.upvotes > 0 ? c.upvotes : 'Upvote'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Disqus Live Community Embed Container */}
        <div className="mt-8 pt-6 border-t border-surface-container">
          <div className="text-[11px] text-secondary mb-3 flex items-center justify-between">
            <span>Powered by Disqus Community Network</span>
            <span className="text-primary/80 font-mono">#sgcarmart-talk-to-us</span>
          </div>

          <div id="disqus_thread" className="disqus-container w-full min-h-[160px]" />

          <noscript>
            Please enable JavaScript to view the{' '}
            <a
              href="https://disqus.com/?ref_noscript"
              rel="noopener noreferrer"
              target="_blank"
              className="text-primary underline"
            >
              comments powered by Disqus.
            </a>
          </noscript>
        </div>
      </div>
    </div>
  );
};
