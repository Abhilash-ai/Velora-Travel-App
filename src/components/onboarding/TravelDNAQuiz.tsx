import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Leaf, Palmtree, Landmark, Sparkles, User, Camera, ChefHat, Ship, Users, Mountain, Building } from 'lucide-react';
import { authService } from '../../firebase/services';
import type { UserProfile } from '../../firebase/services';

interface TravelDNAQuizProps {
  onComplete: (dna: NonNullable<UserProfile['travelDNA']>) => void;
}

interface Question {
  id: keyof NonNullable<UserProfile['travelDNA']>;
  title: string;
  subtitle: string;
  options: {
    value: string;
    label: string;
    icon: React.ComponentType<any>;
    desc: string;
  }[];
}

export const TravelDNAQuiz: React.FC<TravelDNAQuizProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Partial<NonNullable<UserProfile['travelDNA']>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions: Question[] = [
    {
      id: 'landscape',
      title: 'Choose your sanctuary',
      subtitle: 'Where does your mind wander when you close your eyes?',
      options: [
        { value: 'Nature', label: 'Nature & Valleys', icon: Leaf, desc: 'Quiet pine woodlands, roaring rivers, and hidden waterfalls.' },
        { value: 'Beaches', label: 'Coastal Breezes', icon: Palmtree, desc: 'Warm golden sands, coral shores, and coastal sunsets.' }
      ]
    },
    {
      id: 'budget',
      title: 'Define your exploration speed',
      subtitle: 'How do you prefer to experience local hospitality?',
      options: [
        { value: 'Luxury', label: 'Luxury Curation', icon: Ship, desc: 'Bespoke boutique lodges, wellness spas, and curated fine dining.' },
        { value: 'Budget', label: 'Backpacker Freedom', icon: Landmark, desc: 'Authentic local homestays, hostels, and raw trail exploration.' }
      ]
    },
    {
      id: 'style',
      title: 'What drives your journey?',
      subtitle: 'Select the primary force behind your travels.',
      options: [
        { value: 'Adventure', label: 'High Adrenaline', icon: Compass, desc: 'Hike mountain ridges, explore caves, and discover wild valleys.' },
        { value: 'Spiritual', label: 'Spiritual Serenity', icon: Sparkles, desc: 'Sacred temple trails, yoga ashrams, and pilgrimage circuits.' }
      ]
    },
    {
      id: 'focus',
      title: 'What is your primary lens?',
      subtitle: 'How do you capture and remember destinations?',
      options: [
        { value: 'Photography', label: 'Visual Captures', icon: Camera, desc: 'Sunrise viewpoints, golden hour timings, and dramatic panoramas.' },
        { value: 'Food', label: 'Gastronomy Trials', icon: ChefHat, desc: 'Backstreet noodle houses, local spices, and traditional recipes.' }
      ]
    },
    {
      id: 'companions',
      title: 'Choose your company',
      subtitle: 'Who is sharing the stories you build?',
      options: [
        { value: 'Solo', label: 'Solo Nomad', icon: User, desc: 'Absolute freedom to change routes, reflect, and wander alone.' },
        { value: 'Group', label: 'Collective Story', icon: Users, desc: 'Shared laughter, group cabins, and memories with friends.' }
      ]
    },
    {
      id: 'terrain',
      title: 'Where do you focus?',
      subtitle: 'Select your preferred spatial landscape.',
      options: [
        { value: 'Mountains', label: 'Alpine Heights', icon: Mountain, desc: 'Snow peaks, high glacier routes, and fresh mountain air.' },
        { value: 'Cities', label: 'Metropolitan Neon', icon: Building, desc: 'Ancient shrines tucked behind neon skyscrapers and alleys.' }
      ]
    }
  ];

  const handleSelect = async (value: string) => {
    const currentQuestion = questions[currentIdx];
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Completed the quiz
      setIsSubmitting(true);
      try {
        const completedDNA = newAnswers as NonNullable<UserProfile['travelDNA']>;
        await authService.updateTravelDNA(completedDNA);
        onComplete(completedDNA);
      } catch (err) {
        console.error("Failed to save Travel DNA:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const currentQuestion = questions[currentIdx];

  return (
    <div className="fixed inset-0 z-[3000] bg-[#060B16] flex flex-col justify-center items-center px-6">
      
      {/* Background glowing layer */}
      <div className="absolute inset-0 bg-radial-gradient from-primary/10 via-transparent to-transparent pointer-events-none z-0" />

      <div className="w-full max-w-lg relative z-10">
        
        {/* Onboarding progress header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary animate-spin-slow" />
            <span className="font-heading font-extrabold tracking-widest text-xs uppercase text-white">Velora Profile</span>
          </div>
          <span className="text-xs font-semibold text-muted">
            Question {currentIdx + 1} of {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-white/5 rounded-full mb-12 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question Panel Card with AnimatePresence slide transitions */}
        <div className="min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 leading-tight">
                {currentQuestion.title}
              </h1>
              <p className="text-sm text-muted mb-8">
                {currentQuestion.subtitle}
              </p>

              {/* Options Grid */}
              <div className="flex flex-col gap-4">
                {currentQuestion.options.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      disabled={isSubmitting}
                      className="w-full liquid-glass p-5 rounded-2xl border border-white/5 hover:border-primary/40 text-left flex items-start gap-4 transition-all group cursor-pointer active:scale-[0.99]"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/30 flex items-center justify-center text-muted group-hover:text-primary transition-colors flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-white text-md mb-1 group-hover:text-primary transition-colors">
                          {opt.label}
                        </h3>
                        <p className="text-xs text-muted leading-relaxed">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {isSubmitting && (
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-secondary">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Structuring Travel DNA...
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
export default TravelDNAQuiz;
