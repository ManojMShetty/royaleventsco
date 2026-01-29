import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  size: number;
}

const Confetti: React.FC = () => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = [
      'hsl(var(--gold))',
      'hsl(var(--primary))',
      '#FFD700',
      '#F4E4C1',
      '#8B1538',
      '#D4AF37',
    ];

    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
      size: Math.random() * 8 + 4,
    }));

    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            y: -20,
            x: `${piece.x}vw`,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: '100vh',
            rotate: piece.rotation + 720,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: piece.delay,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
