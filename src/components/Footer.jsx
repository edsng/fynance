import { motion } from 'framer-motion';
import '../css/Footer.css';

function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <p>&copy; {new Date().getFullYear()} Fynance</p>
        </motion.footer>
    );
}

export default Footer;