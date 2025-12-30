import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImage from '../../assets/feliz_.png'
import leftImage from '../../assets/left.png'
import rightImage from '../../assets/right.png'
import './Header.css'

const Header = ({ cartItemCount, onCartClick, selectedCategory, onCategorySelect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currency, setCurrency] = useState('USD')

  // Category mapping: display name (with emojis) -> actual category name (for filtering)
  const categoryMap = {
    '🤩Clothing🤩': 'Clothing',
    '👻Stickers👻': 'Stickers',
    '😎Accessories😎': 'Accessories'
  }

  const categories = Object.keys(categoryMap)

  const handleCategoryClick = (displayCategory) => {
    const actualCategory = categoryMap[displayCategory]
    // Check if the actual category matches the selected one
    const isCurrentlySelected = selectedCategory === actualCategory
    onCategorySelect(isCurrentlySelected ? null : actualCategory)
    setIsMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <img src={leftImage} alt="Left" className="header-left-image" />
        </div>
        
        <div className="header-center">
          <Link to="/" className="logo" onClick={() => onCategorySelect(null)}>
            <img src={logoImage} alt="FELIZ" className="logo-image" />
          </Link>
          <nav className="desktop-nav">
            {categories.map(displayCategory => {
              const actualCategory = categoryMap[displayCategory]
              return (
                <button
                  key={displayCategory}
                  className={`desktop-menu-item ${selectedCategory === actualCategory ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(displayCategory)}
                >
                  {displayCategory}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="header-right">
          <div className="header-right-image-container">
            <img src={rightImage} alt="Right" className="header-right-image" />
            <div className="header-right-overlay">
              <div className="currency-selector">
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="currency-select"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <button 
                className="cart-button"
                onClick={onCartClick}
                aria-label="Shopping cart"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </button>
            </div>
          </div>

          <button 
            className="menu-button mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="mobile-menu">
          <ul className="menu-list">
            {categories.map(displayCategory => {
              const actualCategory = categoryMap[displayCategory]
              return (
                <li key={displayCategory}>
                  <button
                    className={`menu-item ${selectedCategory === actualCategory ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(displayCategory)}
                  >
                    {displayCategory}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header

