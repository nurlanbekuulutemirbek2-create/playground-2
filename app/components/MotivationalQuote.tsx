"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Heart, HeartOff } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { QuoteService } from "../../lib/firebase-utils";

interface Quote {
  text: string;
  author: string;
}

export default function MotivationalQuote() {
  const { user } = useUser();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [savingFavorite, setSavingFavorite] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/motivational-quote", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const data = await response.json();
      setQuote(data);
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError("Failed to load motivational quote");
      // Fallback quote
      setQuote({
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleSaveFavorite = async () => {
    if (!user || !quote) return;
    
    setSavingFavorite(true);
    try {
      await QuoteService.saveFavoriteQuote(user.id, {
        text: quote.text,
        author: quote.author,
        savedAt: new Date().toISOString()
      });
      setIsFavorite(true);
    } catch (error) {
      console.error('Error saving favorite quote:', error);
    } finally {
      setSavingFavorite(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg shadow-lg mb-6"
      >
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-lg font-medium">Loading inspiration...</span>
        </div>
      </motion.div>
    );
  }

  if (error && !quote) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6 rounded-lg shadow-lg mb-6"
      >
        <div className="text-center">
          <p className="text-lg font-medium">Unable to load quote</p>
          <button
            onClick={fetchQuote}
            className="mt-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-6 px-8 rounded-xl shadow-xl mb-8 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 opacity-10">
        <Sparkles className="w-24 h-24" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl font-medium leading-relaxed mb-3 italic"
            >
              "{quote?.text}"
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg opacity-90 font-medium"
            >
              — {quote?.author}
            </motion.p>
          </div>
          
          <div className="flex items-center space-x-2">
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveFavorite}
                disabled={savingFavorite || isFavorite}
                className={`p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                  isFavorite 
                    ? 'bg-red-500/30 text-red-200' 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
                title={isFavorite ? "Quote saved!" : "Save as favorite"}
              >
                {savingFavorite ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : isFavorite ? (
                  <Heart className="w-5 h-5 fill-current" />
                ) : (
                  <HeartOff className="w-5 h-5" />
                )}
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchQuote}
              className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200 flex-shrink-0"
              title="Get new quote"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center space-x-2 text-sm opacity-80"
        >
          <Sparkles className="w-4 h-4" />
          <span>AI-powered motivation</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
