"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { QuoteService } from "../../lib/firebase-utils";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FavoriteQuote {
  id: string;
  text: string;
  author: string;
  savedAt: string;
}

export default function FavoritesPage() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userFavorites = await QuoteService.getFavoriteQuotes(user.id);
      setFavorites(userFavorites as FavoriteQuote[]);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setError('Failed to load favorite quotes');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleDeleteFavorite = async (quoteId: string) => {
    try {
      await QuoteService.deleteFavoriteQuote(quoteId);
      setFavorites(favorites.filter(quote => quote.id !== quoteId));
    } catch (error) {
      console.error('Error deleting favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your favorites</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Your Favorite Quotes</h1>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Heart className="w-5 h-5" />
              <span className="font-medium">{favorites.length} saved</span>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your favorite quotes...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
          >
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadFavorites}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && favorites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No favorite quotes yet</h2>
            <p className="text-gray-600 mb-6">Start saving quotes you love from the homepage!</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Explore Quotes
            </Link>
          </motion.div>
        )}

        {/* Favorites List */}
        {!loading && !error && favorites.length > 0 && (
          <div className="space-y-6">
            {favorites.map((quote, index) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                      className="text-lg md:text-xl font-medium text-gray-900 mb-3 italic leading-relaxed"
                    >
                      &ldquo;{quote.text}&rdquo;
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      className="text-lg text-gray-600 font-medium"
                    >
                      — {quote.author}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      className="text-sm text-gray-500 mt-3"
                    >
                      Saved on {new Date(quote.savedAt).toLocaleDateString()}
                    </motion.p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteFavorite(quote.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
