import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  phase: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  phase: number;
  speed: number;
}

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const nebulasRef = useRef<Nebula[]>([]);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize 200+ stars
    const starCount = 250;
    starsRef.current = [];
    for (let i = 0; i < starCount; i++) {
      starsRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Initialize 3 nebula clouds
    nebulasRef.current = [
      {
        x: canvas.width * 0.2,
        y: canvas.height * 0.3,
        radius: Math.max(canvas.width, canvas.height) * 0.35,
        color: 'rgba(6, 182, 212, 0.12)',
        phase: 0,
        speed: 0.0003,
      },
      {
        x: canvas.width * 0.8,
        y: canvas.height * 0.6,
        radius: Math.max(canvas.width, canvas.height) * 0.4,
        color: 'rgba(139, 92, 246, 0.15)',
        phase: Math.PI * 0.67,
        speed: 0.00025,
      },
      {
        x: canvas.width * 0.5,
        y: canvas.height * 0.8,
        radius: Math.max(canvas.width, canvas.height) * 0.3,
        color: 'rgba(236, 72, 153, 0.08)',
        phase: Math.PI * 1.33,
        speed: 0.00035,
      },
    ];

    let time = 0;

    const animate = () => {
      time += 1;
      ctx.fillStyle = '#05050e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula clouds first (behind stars)
      nebulasRef.current.forEach((nebula) => {
        const driftX = Math.sin(time * nebula.speed + nebula.phase) * 30;
        const driftY = Math.cos(time * nebula.speed * 0.7 + nebula.phase) * 20;
        const gradient = ctx.createRadialGradient(
          nebula.x + driftX,
          nebula.y + driftY,
          0,
          nebula.x + driftX,
          nebula.y + driftY,
          nebula.radius
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(0.5, nebula.color.replace(/[\d.]+\)$/, '0.05)'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Draw and animate stars
      starsRef.current.forEach((star) => {
        // Twinkle with sine wave
        const twinkle = Math.sin(time * 0.02 * star.speed + star.phase) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();

        // Glow for larger stars
        if (star.size > 1.5) {
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          );
          glow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.3})`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Occasional shooting star (every ~10 seconds)
      const shootTrigger = (time * 0.016) % 10;
      if (shootTrigger < 0.5 && Math.random() > 0.98) {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height * 0.5;
        const length = 80 + Math.random() * 60;
        const angle = Math.PI * 0.25 + Math.random() * 0.3;

        const gradient = ctx.createLinearGradient(
          startX, startY,
          startX - Math.cos(angle) * length,
          startY + Math.sin(angle) * length
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'transparent');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(
          startX - Math.cos(angle) * length,
          startY + Math.sin(angle) * length
        );
        ctx.stroke();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
