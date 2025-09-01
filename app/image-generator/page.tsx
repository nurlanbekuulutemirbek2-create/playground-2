"use client";

import { motion } from "framer-motion";
import ImageGenerator from "../components/ImageGenerator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ImageGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <Link 
              href="/" 
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-lg hover:bg-white/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Image Generator</h1>
              <p className="text-gray-600">Create stunning visuals with the power of DALL-E 3</p>
            </div>
          </div>
        </motion.div>

        {/* Image Generator Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ImageGenerator />
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Tips for Better Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Be Specific</h4>
              <p className="text-gray-600 text-sm">
                Include details about style, lighting, composition, and mood. 
                Instead of "a cat", try "a majestic orange tabby cat sitting in a sunlit window, 
                photorealistic style with warm golden lighting".
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Use Descriptive Language</h4>
              <p className="text-gray-600 text-sm">
                Add adjectives and descriptive words. Mention colors, textures, 
                time of day, weather, and artistic styles like "oil painting", 
                "digital art", or "photography".
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Consider Composition</h4>
              <p className="text-gray-600 text-sm">
                Think about camera angles, framing, and perspective. 
                Use terms like "close-up", "wide shot", "bird's eye view", 
                or "portrait orientation".
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Style References</h4>
              <p className="text-gray-600 text-sm">
                Reference famous artists, art movements, or specific styles. 
                Try "in the style of Van Gogh", "cyberpunk aesthetic", 
                or "minimalist design".
              </p>
            </div>
          </div>
        </motion.div>

        {/* Example Prompts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🎨 Example Prompts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "A serene mountain landscape at sunset with a crystal clear lake reflecting the sky, photorealistic style",
              "A futuristic cityscape with flying cars and neon lights, cyberpunk aesthetic, digital art",
              "A cozy coffee shop interior with warm lighting, people reading books, oil painting style",
              "A magical forest with glowing mushrooms and fairy lights, fantasy art style",
              "A minimalist workspace with a modern computer setup, clean design aesthetic",
              "A vintage car driving through a desert landscape at golden hour, cinematic photography"
            ].map((prompt, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => {
                  // This would be used to populate the prompt input
                  console.log("Example prompt:", prompt);
                }}
              >
                <p className="text-sm text-gray-700 line-clamp-3">{prompt}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
