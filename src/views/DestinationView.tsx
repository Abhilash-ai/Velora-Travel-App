import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Heart, Share2, Sparkles, Compass, Calendar, CloudSun, CreditCard } from 'lucide-react';
import type { SeedDestination } from '../data/dbSeed';
import { HotelBookingModal } from '../components/booking/HotelBookingModal';
import { authService, dbService } from '../firebase/services';
import { EmergencyHub } from '../components/ui/EmergencyHub';
import { TransportHub } from '../components/booking/TransportHub';
import { LeafletMapViewer } from '../components/map/LeafletMapViewer';
import { NearbyPlacesList } from '../components/map/NearbyPlacesList';
import { AlertCircle, Navigation } from 'lucide-react';
import './DestinationView.css';

interface DestinationViewProps {
  destination: SeedDestination;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onStartJourney: (routeType?: 'scenic' | 'spiritual') => void;
  onCreateAIPlan: () => void;
}

export const DestinationView: React.FC<DestinationViewProps> = ({
  destination,
  onBack,
  isSaved,
  onToggleSave,
  onStartJourney,
  onCreateAIPlan
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'explore' | 'gems' | 'journey' | 'food' | 'culture' | 'reviews'>('overview');
  const [previewRouteType, setPreviewRouteType] = useState<'scenic' | 'spiritual'>('scenic');
  const [reviews, setReviews] = useState(destination.reviewsList);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [sharedMessage, setSharedMessage] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showTransport, setShowTransport] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setSharedMessage(true);
    setTimeout(() => setSharedMessage(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev = {
      user: 'Anonymous Explorer',
      text: newReviewText.trim(),
      rating: newRating
    };
    setReviews([newRev, ...reviews]);
    setNewReviewText('');
  };

  return (
    <div className="dest-view-container view-enter">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="fixed top-24 left-6 z-40 w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer transition-all backdrop-blur-md"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Hero Cover Card */}
      <div className="dest-hero-panel">
        <img src={destination.image} alt={destination.title} className="dest-hero-img" />
        <div className="dest-hero-overlay" />
        <div className="dest-hero-content">
          <div className="flex gap-2 mb-3">
            {destination.tags.map(t => (
              <span key={t} className="px-2.5 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-heading font-semibold uppercase tracking-wider text-[#A8B3CF]">
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-1 tracking-tight">
            {destination.title}
          </h1>
          <p className="text-sm md:text-md text-muted font-heading font-medium tracking-wide uppercase">
            {destination.country}
          </p>
        </div>
      </div>

      {/* Action Row */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button 
          onClick={onToggleSave}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-heading font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            isSaved 
              ? 'bg-[#EC4899]/15 border-[#EC4899]/30 text-[#EC4899]' 
              : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
          }`}
        >
          <Heart className="w-4 h-4" style={{ fill: isSaved ? 'currentColor' : 'none' }} />
          {isSaved ? 'Saved' : 'Save Itinerary'}
        </button>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-heading font-semibold uppercase tracking-wider text-white transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          {sharedMessage ? 'Link Copied!' : 'Share Itinerary'}
        </button>

        <button 
          onClick={() => setShowBooking(true)}
          className="btn-shimmer flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-heading font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(236,72,153,0.25)] transition-all cursor-pointer ml-auto"
        >
          <CreditCard className="w-4 h-4" />
          Book Package & Hotel
        </button>

        <button 
          onClick={() => onStartJourney()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-heading font-semibold text-xs tracking-wider uppercase backdrop-blur-md transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4 text-primary" />
          Start Journey
        </button>

        <button 
          onClick={onCreateAIPlan}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-heading font-semibold text-xs tracking-wider uppercase backdrop-blur-md transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-secondary" />
          Ask Yatra Mitra
        </button>
      </div>

      {/* Scores Dashboard */}
      <div className="scores-grid">
        <div className="score-card liquid-glass">
          <p className="score-title">Beauty Score</p>
          <p className="score-value text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            {destination.beautyScore}%
          </p>
          <p className="score-sub">Top Scenic Rarity</p>
        </div>
        <div className="score-card liquid-glass">
          <p className="score-title">Photo Score</p>
          <p className="score-value text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
            {destination.photoScore}%
          </p>
          <p className="score-sub">Golden Hour Capture</p>
        </div>
        <div className="score-card liquid-glass">
          <p className="score-title">Serenity</p>
          <p className="score-value">{destination.serenityScore}%</p>
          <p className="score-sub">Quiet Index</p>
        </div>
        <div className="score-card liquid-glass">
          <p className="score-title">Crowd Level</p>
          <p className="score-value text-md uppercase font-heading font-bold" style={{ fontSize: '1.25rem', paddingTop: '6px' }}>
            {destination.crowdLevel}
          </p>
          <p className="score-sub">Tourist Volume</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dest-tabs-row">
        {(['overview', 'explore', 'gems', 'journey', 'food', 'culture', 'reviews'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`dest-tab-btn uppercase tracking-wider ${activeTab === tab ? 'dest-tab-active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div className="tab-content-panel">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overview-grid">
            <div className="flex flex-col gap-6">
              <p className="text-md text-muted leading-relaxed font-light">
                {destination.description}
              </p>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                <h3 className="font-heading font-bold text-lg mb-3">Travel Weather Almanac</h3>
                <p className="text-sm text-muted leading-relaxed">{destination.weather}</p>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="local-guide-card liquid-glass">
                <Calendar className="w-5 h-5 text-primary mb-3" />
                <h4 className="font-heading font-bold text-white text-md mb-1">Best Season</h4>
                <p className="text-xs text-muted leading-relaxed">{destination.bestTime}</p>
              </div>
              <div className="local-guide-card liquid-glass">
                <CloudSun className="w-5 h-5 text-secondary mb-3" />
                <h4 className="font-heading font-bold text-white text-md mb-1">Daylight Coverage</h4>
                <p className="text-xs text-muted leading-relaxed">Optimal golden hour photographic cycles recorded.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 1.5: Explore Maps & Places */}
        {activeTab === 'explore' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            <div className="h-[400px] rounded-2xl overflow-hidden border border-white/10 relative">
              <LeafletMapViewer lat={destination.lat} lng={destination.lng} title={destination.title} />
              
              {/* Floating Action Buttons for Map */}
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <button 
                  onClick={() => setShowEmergency(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  <AlertCircle className="w-4 h-4" /> SOS
                </button>
                <button 
                  onClick={() => setShowTransport(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  <Navigation className="w-4 h-4" /> Transport
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NearbyPlacesList lat={destination.lat} lng={destination.lng} type="lodging" title="Hotels & Stays" />
              <NearbyPlacesList lat={destination.lat} lng={destination.lng} type="restaurant" title="Food & Dining" />
            </div>
          </motion.div>
        )}

        {/* Tab 2: Hidden Gems */}
        {activeTab === 'gems' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destination.hiddenGems.map((gem, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-heading font-bold text-white text-lg">{gem.name}</h3>
                    <span className="px-2 py-0.5 rounded bg-[#EC4899]/15 text-[#EC4899] text-[9px] font-heading font-semibold uppercase tracking-wider">
                      Secret Spot
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mb-4">{gem.desc}</p>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-4 text-[10px] text-muted">
                  <span>GPS: {gem.lat.toFixed(4)}°, {gem.lng.toFixed(4)}°</span>
                  <span>Optimal: {gem.bestTime}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 3: Journey */}
        {activeTab === 'journey' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h3 className="font-heading font-bold text-xl">Winding Path Timeline</h3>
              
              {destination.spiritualTrails && destination.spiritualTrails.length > 0 && (
                <div className="flex p-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] backdrop-blur-sm">
                  <button
                    onClick={() => setPreviewRouteType('scenic')}
                    className={`px-3 py-1 rounded-md font-heading font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      previewRouteType === 'scenic' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-muted hover:text-white'
                    }`}
                  >
                    Scenic
                  </button>
                  <button
                    onClick={() => setPreviewRouteType('spiritual')}
                    className={`px-3 py-1 rounded-md font-heading font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      previewRouteType === 'spiritual' ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-muted hover:text-white'
                    }`}
                  >
                    Spiritual
                  </button>
                </div>
              )}
            </div>

            {/* Launch Map Directly */}
            <div className="mb-8 flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p className="text-xs font-heading font-bold text-white mb-0.5">Interactive Telemetry Map</p>
                <p className="text-[10px] text-muted">Examine path curvatures, local secrets, and booking pre-fills.</p>
              </div>
              <button
                onClick={() => onStartJourney(previewRouteType)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-heading font-semibold text-xs uppercase hover:shadow-[0_0_12px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
              >
                Launch Map
              </button>
            </div>

            <div className="relative pl-8 border-l border-white/10 flex flex-col gap-8">
              {(previewRouteType === 'spiritual' && destination.spiritualTrails && destination.spiritualTrails.length > 0
                ? destination.spiritualTrails[0].stops
                : destination.stops
              ).map((stop, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-[#060B16] border-2 border-primary flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-heading font-bold text-white text-md">{stop.name}</h4>
                    <span className="text-xs text-secondary font-semibold">{stop.time}</span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed mb-1">{stop.desc}</p>
                  <p className="text-[10px] text-muted">Distance from previous: {stop.distance}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab 4: Food */}
        {activeTab === 'food' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destination.localFood.map((food, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
                <div>
                  <h3 className="font-heading font-bold text-white text-lg mb-2">{food.name}</h3>
                  <p className="text-xs text-muted leading-relaxed">{food.desc}</p>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-6">
                  <span className="text-xs text-muted">Average Cost Index</span>
                  <span className="text-sm font-heading font-extrabold text-primary">{food.cost}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tab 5: Culture */}
        {activeTab === 'culture' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
            <h3 className="font-heading font-bold text-xl mb-4">Historical & Cultural Heritage</h3>
            <p className="text-md text-muted leading-relaxed font-light mb-6">
              {destination.culture}
            </p>
            {destination.spiritualTrails && destination.spiritualTrails.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#7C3AED]/5 border border-[#7C3AED]/20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 pb-4 border-b border-white/5">
                  <div>
                    <h4 className="font-heading font-bold text-white text-md mb-1">Sacred Pilgrimage Route</h4>
                    <p className="text-xs text-muted leading-relaxed">{destination.spiritualTrails[0].desc}</p>
                  </div>
                  <button
                    onClick={() => onStartJourney('spiritual')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-heading font-semibold text-xs uppercase hover:shadow-[0_0_12px_rgba(124,58,237,0.3)] transition-all cursor-pointer flex-shrink-0"
                  >
                    Launch Sacred Map
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {destination.spiritualTrails[0].stops.map((stop, i) => (
                    <React.Fragment key={stop.name}>
                      {i > 0 && <span className="text-muted text-xs">→</span>}
                      <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-white">
                        {stop.name}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 6: Reviews */}
        {activeTab === 'reviews' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Reviews list */}
            <div className="lg:col-span-8">
              {reviews.map((rev, idx) => (
                <div key={idx} className="review-item">
                  <div className="review-header">
                    <span className="review-user">{rev.user}</span>
                    <div className="review-stars">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{rev.text}</p>
                </div>
              ))}
            </div>

            {/* Leave a review form */}
            <div className="lg:col-span-4">
              <form onSubmit={handleAddReview} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
                <h3 className="font-heading font-bold text-white text-md">Write a Review</h3>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider">Rating</label>
                  <select 
                    value={newRating} 
                    onChange={e => setNewRating(parseInt(e.target.value))}
                    className="w-full p-3 rounded-xl bg-[#060B16] border border-white/10 text-white text-xs outline-none"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="3">⭐⭐⭐ 3 Stars</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-muted uppercase tracking-wider">Your Experience</label>
                  <textarea
                    rows={4}
                    value={newReviewText}
                    onChange={e => setNewReviewText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#060B16] border border-white/10 text-white text-xs outline-none resize-none placeholder-muted"
                    placeholder="Wander experiences..."
                    required
                  />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-primary text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-primary/95 transition-all">
                  Submit Review
                </button>
              </form>
            </div>

          </motion.div>
        )}

      </div>

      {/* Booking Modal */}
      {showBooking && (
        <HotelBookingModal 
          destination={destination} 
          onClose={() => setShowBooking(false)} 
          onSuccess={(bookingData) => {
            const user = authService.getCurrentUser();
            if (user) {
              dbService.saveTrip(user.uid, bookingData).catch(console.error);
            }
          }}
        />
      )}

      {/* Hubs */}
      <EmergencyHub isOpen={showEmergency} onClose={() => setShowEmergency(false)} />
      
      <TransportHub 
        isOpen={showTransport} 
        onClose={() => setShowTransport(false)}
        destinationName={destination.title}
        destinationLat={destination.lat}
        destinationLng={destination.lng}
      />
    </div>
  );
};
export default DestinationView;
