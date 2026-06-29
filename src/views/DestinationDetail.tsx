import React, { useEffect, useState } from 'react';
import { ArrowLeft, Star, Compass, Calendar, MapPin } from 'lucide-react';
import type { Destination } from '../data/destinations';
import './DestinationDetail.css';

interface DestinationDetailProps {
  destination: Destination;
  startRect: DOMRect | null;
  onClose: () => void;
  onStartJourney: (destination: Destination) => void;
}

export const DestinationDetail: React.FC<DestinationDetailProps> = ({
  destination,
  startRect,
  onClose,
  onStartJourney,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Initial styling based on the clicked card's bounding box
  const initialStyle = startRect
    ? {
        top: `${startRect.top}px`,
        left: `${startRect.left}px`,
        width: `${startRect.width}px`,
        height: `${startRect.height}px`,
        borderRadius: '24px',
      }
    : {
        top: '10%',
        left: '10%',
        width: '80%',
        height: '80%',
        borderRadius: '24px',
      };

  useEffect(() => {
    // Trigger expansion on the next animation frame
    const timer = requestAnimationFrame(() => {
      setIsExpanded(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsExpanded(false);
    // Wait for the collapse animation to finish before unmounting
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <>
      {/* Background Fade Overlay */}
      <div 
        className={`detail-overlay ${isExpanded && !isClosing ? 'detail-overlay-active' : ''}`} 
        onClick={handleClose} 
      />

      {/* Morphing Details Card */}
      <div
        className={`detail-card-morph ${isExpanded && !isClosing ? 'detail-card-morph-expanded' : ''}`}
        style={!isExpanded || isClosing ? initialStyle : undefined}
      >
        {/* Back / Close button */}
        <button 
          className="detail-back-btn" 
          onClick={handleClose}
          aria-label="Back to explore"
        >
          <ArrowLeft className="nav-icon" />
        </button>

        {/* Hero Section */}
        <div className="detail-hero">
          <img 
            src={destination.image} 
            alt={destination.title} 
            className="detail-hero-image" 
          />
          <div className="detail-hero-overlay" />
          <div className="detail-hero-content">
            <div className="detail-tags">
              {destination.tags.map((tag) => (
                <span key={tag} className="detail-tag">{tag}</span>
              ))}
            </div>
            <h1 className="detail-title">{destination.title}</h1>
            <p className="detail-subtitle">{destination.country}</p>
          </div>
        </div>

        {/* Detail text and lists */}
        <div className={`detail-body ${isExpanded && !isClosing ? 'detail-body-visible' : ''}`}>
          
          {/* Intro Description and Quick Stats */}
          <div className="detail-intro-section">
            <div>
              <p className="detail-description">{destination.description}</p>
            </div>
            
            <div className="detail-quick-stats glass-panel">
              <div className="stat-item">
                <span className="stat-label">Rating</span>
                <span className="stat-value stat-rating">
                  <Star style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
                  {destination.rating} ({destination.reviewsCount} reviews)
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Average Cost</span>
                <span className="stat-value" style={{ color: 'var(--color-accent-cyan)' }}>
                  {destination.price}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Ideal Stay</span>
                <span className="stat-value">4 - 5 Days</span>
              </div>
            </div>
          </div>

          {/* Scenic Viewpoints Carousel */}
          <div className="detail-section-title">
            <MapPin style={{ color: 'var(--color-accent-cyan)' }} />
            <h2>Scenic Viewpoints</h2>
          </div>
          <div className="scenic-carousel">
            {destination.hiddenGems.map((point, index) => (
              <div key={index} className="scenic-card glass-panel">
                <img src={point.image} alt={point.name} className="scenic-img" />
                <div className="scenic-overlay">
                  <h3 className="scenic-name">{point.name}</h3>
                  <p className="scenic-desc">{point.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Itinerary Waypoints Timeline */}
          <div className="detail-section-title">
            <Calendar style={{ color: 'var(--color-accent-purple)' }} />
            <h2>Suggested Route</h2>
          </div>
          <div className="stops-timeline">
            {destination.stops.map((stop, index) => (
              <div key={index} className="stop-timeline-item">
                <div className="stop-dot" />
                <div className="stop-header">
                  <h3 className="stop-name">{stop.name}</h3>
                  <span className="stop-time">{stop.time}</span>
                </div>
                <p className="stop-desc">{stop.desc}</p>
                <p className="stop-distance">Distance: {stop.distance}</p>
              </div>
            ))}
          </div>

          {/* Call To Action Box */}
          <div className="detail-cta-box glass-panel">
            <h3>Ready for an Immersive Experience?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '8px' }}>
              Launch Journey Mode to draw this route progressively and explore each stop with live telemetry.
            </p>
            <button 
              className="btn-premium"
              onClick={() => onStartJourney(destination)}
            >
              <Compass className="nav-icon" />
              Launch Journey Mode
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
