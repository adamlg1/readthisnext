import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo" onClick={closeMenu}>
                    📚 ReadThisNext
                </Link>

                {/* Hamburger Button */}
                <button
                    className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Navigation */}
                <nav className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
                    <ul className="nav">
                        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                        <li><Link to="/recommendations" onClick={closeMenu}>Recommendations</Link></li>
                        <li><Link to="/search" onClick={closeMenu}>Search</Link></li>
                    </ul>
                </nav>

                {/* Mobile Overlay */}
                {isMenuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}
            </div>
        </header>
    );
};

export default Header;
