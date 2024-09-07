import React from 'react';
import { motion } from 'framer-motion';
import '../css/BackgroundParticles.css';

const BackgroundParticles = () => {
  const particles = Array.from({ length: 75 }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="background-particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          initial={{
            x: `${particle.x}vw`,
            y: `${particle.y}vh`,
            scale: 0,
          }}
          animate={{
            x: [`${particle.x}vw`, `${(particle.x + 10) % 100}vw`],
            y: [`${particle.y}vh`, `${(particle.y + 10) % 100}vh`],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundParticles;