"use client";

import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { 
  User, 
  Settings, 
  Bell, 
  BarChart3, 
  TrendingUp,
  Activity,
  Target,
  Award,
  Image
} from "lucide-react";
import Link from "next/link";
import MotivationalQuote from "../components/MotivationalQuote";

export default function Dashboard() {
  const { user } = useUser();

  const stats = [
    { label: "Total Views", value: "12,847", change: "+12%", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Engagement", value: "89%", change: "+5%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Goals Met", value: "23/25", change: "+2", icon: <Target className="w-5 h-5" /> },
    { label: "Achievements", value: "15", change: "+3", icon: <Award className="w-5 h-5" /> }
  ];

  const recentActivity = [
    { action: "Profile updated", time: "2 minutes ago", type: "profile" },
    { action: "New login from Chrome", time: "1 hour ago", type: "security" },
    { action: "Settings changed", time: "3 hours ago", type: "settings" },
    { action: "Email verified", time: "1 day ago", type: "verification" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MotivationalQuote />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}!
          </h1>
          <p className="text-xl text-gray-600">
            Here's what's happening with your account today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                                                                  {[
                           { label: "Update Profile", icon: <User className="w-4 h-4" /> },
                           { label: "View Analytics", icon: <BarChart3 className="w-4 h-4" /> },
                           { label: "Change Settings", icon: <Settings className="w-4 h-4" /> },
                           { label: "Generate Images", icon: <Image className="w-4 h-4" />, href: "/image-generator" }
                         ].map((action, index) => (
                           action.href ? (
                             <Link key={index} href={action.href}>
                               <motion.div
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.98 }}
                                 className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                               >
                                 {action.icon}
                                 <span className="text-sm font-medium text-gray-700">{action.label}</span>
                               </motion.div>
                             </Link>
                           ) : (
                             <motion.button
                               key={index}
                               whileHover={{ scale: 1.02 }}
                               whileTap={{ scale: 0.98 }}
                               className="w-full flex items-center space-x-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                             >
                               {action.icon}
                               <span className="text-sm font-medium text-gray-700">{action.label}</span>
                             </motion.button>
                           )
                         ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
