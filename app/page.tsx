"use client";

import { motion } from "framer-motion";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import MotivationalQuote from "./components/MotivationalQuote";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <MotivationalQuote />
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
        <motion.h1 
          className="text-6xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ModernApp</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          A beautiful, modern website with Clerk authentication and animations
        </motion.p>
        
        <SignedOut>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4"
          >
            <p className="text-lg text-gray-600 mb-4">
              Sign up to access your personalized dashboard
            </p>
            <motion.button 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </motion.div>
        </SignedOut>
        
                           <SignedIn>
                     <motion.div
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ duration: 0.8, delay: 0.6 }}
                       className="space-y-4"
                     >
                       <p className="text-lg text-green-600 mb-4">
                         🎉 Welcome back! You&apos;re successfully signed in.
                       </p>
                       <div className="flex flex-col sm:flex-row gap-4">
                         <Link href="/dashboard">
                           <motion.button
                             className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                           >
                             Go to Dashboard
                           </motion.button>
                         </Link>
                         <Link href="/image-generator">
                           <motion.button
                             className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                           >
                             Generate Images
                           </motion.button>
                         </Link>
                       </div>
                     </motion.div>
                   </SignedIn>
        </motion.div>
      </div>
    </div>
  );
}
