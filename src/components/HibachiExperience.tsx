import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChefShow } from '../types';
import { Flame, Sparkles, Utensils, Heart } from 'lucide-react';

const chefShows: ChefShow[] = [
  {
    id: 'volcano',
    title: 'The Flaming Onion Volcano',
    japaneseTitle: '玉ねぎ火山',
    description: 'Our world-renowned showstopper! Watch in awe as sliced onion rings are stacked to form a mountain peak, filled with liquor, and erupted into a safe, spectacular tower of flame right before your eyes!',
    visualGlow: 'from-orange-600 via-amber-500 to-red-600',
    interactiveSizzleText: '🔥 ERUPT THE FLAME! 🔥'
  },
  {
    id: 'shrimp-toss',
    title: 'The Flying Shrimp Catch',
    japaneseTitle: '空飛ぶ海老',
    description: 'Prepare your reflexes and appetite! Our master chefs flip juicy grilled shrimp directly into guests\' mouths with lightning speed and precision. Are you ready for the shrimp toss challenge?',
    visualGlow: 'from-amber-400 via-gold-500 to-yellow-600',
    interactiveSizzleText: '🦐 GO FOR THE CATCH! 🦐'
  },
  {
    id: 'steak-sear',
    title: 'Sizzling Butter Sea Sear',
    japaneseTitle: 'ステーキの鉄板焼き',
    description: 'The hypnotic rhythm of clanging iron knives! Filet mignon and Strip steaks are seared at 500°F with house garlic butter, producing a dramatic, delicious steam column and succulent searing crust.',
    visualGlow: 'from-red-600 via-rose-500 to-orange-500',
    interactiveSizzleText: '🥩 HEAR THE SIZZLE! 🥩'
  },
  {
    id: 'heart-rice',
    title: 'Heart-Shaped Fried Rice',
    japaneseTitle: 'ハート型炒飯',
    description: 'Crafted with genuine care. The chef expertly shapes a huge mound of fried rice into a beating heart, drumming a pulse with his spatulas that echoes through the room, perfect for birthdays and anniversaries.',
    visualGlow: 'from-pink-600 via-red-500 to-rose-600',
    interactiveSizzleText: '💖 FEEL THE BEAT! 💖'
  }
];

export default function HibachiExperience() {
  const [selectedShow, setSelectedShow] = useState<string>('volcano');
  const [isActivating, setIsActivating] = useState(false);

  const activeShow = chefShows.find(s => s.id === selectedShow) || chefShows[0];

  const triggerSizzleEffect = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
    }, 1500);
  };

  const getRandomEmoji = () => {
    if (selectedShow === 'volcano') return ['🔥', '🌋', '💨'];
    if (selectedShow === 'shrimp-toss') return ['🦐', '🎯', '🙌'];
    if (selectedShow === 'steak-sear') return ['🥩', '⚡', '😋'];
    return ['💖', '🍚', '🥁'];
  };

  return (
    <section id="experience" className="py-24 bg-shimmer relative overflow-hidden bg-zinc-950 border-t border-b border-zinc-900">
      {/* Absolute ambient backgrounds */}
      <div className="absolute inset-0 bg-grid-decor opacity-40 pointer-events-none" />
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-gold-400 font-mono tracking-widest text-xs uppercase block mb-3">
            Culinary Theatre & Showmanship
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-semibold text-white tracking-tight mb-4">
            The Interactive Hibachi Experience
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            Dining at Tokyo Hibachi is more than just a meal—it is a dazzling live performance. 
            Enjoy our chefs\' flawless skills, playful humor, and blazing fire shows right at your teppanyaki grill table.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Chef Show Menu List - Left (35%) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {chefShows.map((show) => {
              const isSelected = selectedShow === show.id;
              return (
                <button
                  key={show.id}
                  id={`btn-exp-${show.id}`}
                  onClick={() => {
                    setSelectedShow(show.id);
                    setIsActivating(false);
                  }}
                  className={`w-full text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-zinc-900/90 border-gold-400 shadow-lg shadow-gold-950/20'
                      : 'bg-zinc-950/40 border-zinc-900 hover:bg-zinc-900/30 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`p-3 rounded-lg transition-colors duration-300 ${
                      isSelected ? 'bg-gold-500/10 text-gold-400' : 'bg-zinc-900 text-zinc-500 group-hover:text-zinc-400'
                    }`}>
                      {show.id === 'volcano' && <Flame className="w-5 h-5" />}
                      {show.id === 'shrimp-toss' && <Sparkles className="w-5 h-5" />}
                      {show.id === 'steak-sear' && <Utensils className="w-5 h-5" />}
                      {show.id === 'heart-rice' && <Heart className="w-5 h-5" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className={`font-serif font-medium text-base md:text-lg transition-colors ${
                          isSelected ? 'text-white' : 'text-zinc-400'
                        }`}>
                          {show.title}
                        </h3>
                        <span className="font-mono text-xs text-gold-500/60 font-semibold">
                          {show.japaneseTitle}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                        {show.description}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-0 right-0 h-full w-1 bg-gold-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Interactive Screen - Right (65%) */}
          <div className="lg:col-span-7 rounded-2xl bg-zinc-950 border border-zinc-900 p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Ambient Background Glow matching selected show */}
            <div className={`absolute -right-24 -bottom-24 w-80 h-80 bg-gradient-to-tr ${activeShow.visualGlow} opacity-[0.06] rounded-full blur-3xl pointer-events-none transition-all duration-700`} />

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedShow}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6 border-b border-zinc-900 pb-5">
                    <div>
                      <span className="font-serif italic text-gold-400 tracking-wide block text-sm">
                        Signature Act No. {chefShows.findIndex(s => s.id === selectedShow) + 1}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-semibold text-white mt-1">
                        {activeShow.title}
                      </h3>
                    </div>
                    <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 px-4 py-2 rounded-lg text-center">
                      <span className="font-mono text-sm tracking-widest text-gold-400 block font-bold">
                        {activeShow.japaneseTitle}
                      </span>
                    </div>
                  </div>

                  {/* Visual Simulation Interactive Stage */}
                  <div className="w-full h-56 bg-zinc-900/30 rounded-xl border border-zinc-900/60 mb-6 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Simulated Stage grids */}
                    <div className="absolute inset-0 bg-grid-decor opacity-20" />
                    
                    {/* Visual action triggers */}
                    {isActivating ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                        className="text-center z-10 px-6"
                      >
                        <div className="flex justify-center gap-4 mb-4">
                          {getRandomEmoji().map((emoji, index) => (
                            <motion.span
                              key={index}
                              animate={{ 
                                y: [-10, -50, -10], 
                                scale: [1, 1.5, 1],
                                rotate: [0, (index - 1) * 30, 0] 
                              }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: index * 0.15 }}
                              className="text-4xl filter drop-shadow-md"
                            >
                              {emoji}
                            </motion.span>
                          ))}
                        </div>
                        <p className="font-mono text-gold-400 text-sm tracking-widest uppercase font-bold animate-pulse">
                          !!! ACTIVE PERFORMANCE !!!
                        </p>
                        <p className="text-zinc-400 text-xs mt-1">
                          Our Ithaca dining room is currently cheering with aroma and laughter!
                        </p>
                      </motion.div>
                    ) : (
                      <div className="text-center z-10 px-6">
                        <div className={`w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mx-auto mb-4 flex items-center justify-center text-gold-400 shadow-md ${
                          selectedShow === 'volcano' ? 'animate-bounce' : 'animate-pulse'
                        }`}>
                          {selectedShow === 'volcano' && <Flame className="w-8 h-8 text-red-500" />}
                          {selectedShow === 'shrimp-toss' && <Sparkles className="w-8 h-8 text-amber-500" />}
                          {selectedShow === 'steak-sear' && <Utensils className="w-8 h-8 text-orange-500" />}
                          {selectedShow === 'heart-rice' && <Heart className="w-8 h-8 text-rose-500" />}
                        </div>
                        <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider">
                          Ready for Interactive Simulation
                        </p>
                        <p className="text-white text-xs mt-1 font-sans">
                          Click the sizzle button below to trigger the performance show simulation.
                        </p>
                      </div>
                    )}

                    {/* Stage fire/steam elements shown when active */}
                    {isActivating && (
                      <div className={`absolute inset-0 bg-gradient-to-t ${activeShow.visualGlow} opacity-10 blur-xl pointer-events-none`} />
                    )}
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                    {activeShow.description}
                  </p>
                </div>

                <div className="flex justify-end pt-2 border-t border-zinc-950">
                  <button
                    id={`btn-sizzle-${selectedShow}`}
                    onClick={triggerSizzleEffect}
                    disabled={isActivating}
                    className={`px-6 py-3 font-mono text-xs font-bold rounded-lg uppercase tracking-wider transition-all duration-300 shadow-md flex items-center gap-2 ${
                      isActivating
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border-zinc-700'
                        : 'bg-gold-400 hover:bg-gold-300 text-black border border-gold-300 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                  >
                    <span>{activeShow.interactiveSizzleText}</span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
