import React, { useState, useEffect } from 'react';
import { Star, User, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService } from '../../../firebase/services';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface DestinationReviewsProps {
  destinationId: string;
}

export const DestinationReviews: React.FC<DestinationReviewsProps> = ({ destinationId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const { user } = useAuth();

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const data = await dbService.getReviews(destinationId);
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [destinationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please log in to leave a review.");
    
    await dbService.submitReview(destinationId, user.uid, {
      rating,
      comment,
      authorName: user.displayName || 'Traveler'
    });
    
    setIsWriting(false);
    setComment('');
    setRating(5);
    fetchReviews(); // refresh
  };

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          Traveler Reviews
        </h3>
        {user && !isWriting && (
          <Button variant="outline" size="sm" onClick={() => setIsWriting(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {isWriting && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
          <h4 className="font-semibold dark:text-white mb-4">How was your experience?</h4>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 mb-4 min-h-[100px]"
            placeholder="Share your thoughts about this destination..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsWriting(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Post Review</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
          <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl w-full"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          No reviews yet. Be the first to share your experience!
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((rev, index) => (
            <motion.div 
              key={rev.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold dark:text-white">{rev.authorName}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-xs text-slate-400">
                  {new Date(rev.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 ml-13 pl-13">
                {rev.comment}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
