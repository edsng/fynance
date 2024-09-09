import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import logo from '../assets/icon_w.png'; // Adjust the file name and path as necessary

function Header() {
    return (
        <motion.header
            className="header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="header-content">
                <Link to="/" className="logo-link">
                    <img src={logo} alt="Fynance Logo" className="logo" />
                    <h1>Fynance</h1>
                </Link>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/form">Create Plan</Link></li>
                    </ul>
                </nav>
            </div>
        </motion.header>
    );
}

export default Header;