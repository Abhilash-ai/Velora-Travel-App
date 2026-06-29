import React from 'react';
import { motion } from 'framer-motion';
import { Globe, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';

interface ProfileSidebarProps {
  savedCount: number;
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.68, -0.55, 0.265, 1.55] as const } }
} as const;

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ savedCount }) => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      {/* Identity Card */}
      <motion.div variants={itemVariants}>
        <Card className="text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600" />
          
          <div className="relative z-10 p-8">
            <div className="w-28 h-28 bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-800 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-black shadow-xl mt-6 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.displayName?.charAt(0)?.toUpperCase() || 'V'
              )}
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user?.displayName || 'VIP Traveler'}</h2>
            <p className="text-sm font-medium text-blue-600 mb-8 uppercase tracking-widest">{user?.phoneNumber || 'Premium Member'}</p>
            
            <div className="pt-8 border-t border-slate-100 dark:border-slate-700 flex justify-between text-sm">
              <div className="text-center w-1/2 border-r border-slate-100 dark:border-slate-700">
                <div className="font-black text-slate-900 dark:text-white text-3xl mb-1">{savedCount > 0 ? 1 : 0}</div>
                <div className="text-slate-500 dark:text-slate-400 font-medium">Upcoming</div>
              </div>
              <div className="text-center w-1/2">
                <div className="font-black text-slate-900 dark:text-white text-3xl mb-1">{savedCount}</div>
                <div className="text-slate-500 dark:text-slate-400 font-medium">Saved</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Travel Stats Widget */}
      <motion.div variants={itemVariants}>
        <Card className="p-8">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" /> Travel Stats
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>World Explored</span>
                <span>12%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '12%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">12 / 195 Countries</p>
            </div>

            <div>
              <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Miles Flown</span>
                <span>45,200</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                  className="h-full bg-purple-600 rounded-full"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Gold Tier Status</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Actions */}
      <motion.div variants={itemVariants}>
        <Button 
          variant="outline" 
          className="w-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-100 dark:hover:border-red-800/50 border-slate-200 dark:border-slate-700 transition-colors" 
          leftIcon={<LogOut className="w-5 h-5" />}
          onClick={logout}
        >
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
};
