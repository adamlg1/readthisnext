import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    📚 ReadThisNext
                </Link>
                <nav>
                    <ul className="nav">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/recommendations">Recommendations</Link></li>
                        <li><Link to="/search">Search</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
