import React, { useState } from 'react';
import type { MouseEvent } from 'react';
import { Search, Star, Heart } from 'lucide-react';
import { destinations } from '../data/destinations';
import type { Destination } from '../data/destinations';
import './HomeView.css';

interface HomeViewProps {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  onCardClick: (destination: Destination, rect: DOMRect) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ savedIds, toggleSaved, onCardClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Mountains', 'Adventure', 'Nature', 'Spiritual', 'Coastal', 'Gastronomy', 'Relaxing', 'Culture', 'Luxury', 'History'];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, dest: Destination) => {
    // Avoid triggering card expand when clicking favorite button
    const target = e.target as HTMLElement;
    if (target.closest('.card-favorite-btn')) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    onCardClick(dest, rect);
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || dest.tags.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-view view-enter">
      {/* Hero Banner */}
      <section className="home-hero">
        <h1 className="text-gradient">Discover the Extraordinary</h1>
        <p>Experience custom-crafted routes and intelligence-backed travel planning for global explorer milestones.</p>
      </section>

      {/* Search Input Box */}
      <section className="search-container">
        <div className="search-input-wrapper glass-panel">
          <Search className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search by city or country..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn-premium search-btn">Search</button>
        </div>
      </section>

      {/* Horizontal Category Filters */}
      <section className="category-scroller">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? 'category-chip-active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Grid of Destination Cards */}
      <section className="cards-grid">
        {filteredDestinations.map((dest) => {
          const isSaved = savedIds.includes(dest.id);
          return (
            <div 
              key={dest.id}
              className="destination-card"
              onMouseMove={handleMouseMove}
              onClick={(e) => handleCardClick(e, dest)}
            >
              {/* Card Image */}
              <div className="card-image-wrapper">
                <img src={dest.image} alt={dest.title} className="card-image" loading="lazy" />
              </div>
              <div className="card-overlay" />

              {/* Save/Favorite Button */}
              <button 
                className={`card-favorite-btn ${isSaved ? 'card-favorite-active' : ''}`}
                onClick={() => toggleSaved(dest.id)}
                aria-label="Save destination"
              >
                <Heart className="nav-icon" style={{ fill: isSaved ? 'currentColor' : 'none' }} />
              </button>

              {/* Text Card Content */}
              <div className="card-content">
                <div className="card-tag-wrapper">
                  {dest.tags.map((tag) => (
                    <span key={tag} className="card-tag">{tag}</span>
                  ))}
                </div>
                <div className="card-title-row">
                  <div>
                    <h3 className="card-title">{dest.title}</h3>
                    <p className="card-country">{dest.country}</p>
                  </div>
                  <div className="card-rating">
                    <Star className="star-icon" />
                    <span>{dest.rating}</span>
                  </div>
                </div>
                <div className="card-meta">
                  <p className="text-sm text-white/70 line-clamp-2" style={{ lineHeight: '1.4' }}>{dest.description}</p>
                </div>
              </div>
            </div>
          );
        })}
        {filteredDestinations.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No destinations found matching your search.
          </div>
        )}
      </section>
    </div>
  );
};
