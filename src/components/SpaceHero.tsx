"use client";

import { useRef, useEffect } from "react";

export function SpaceHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Star field animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Create stars
    const stars: {
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
    }[] = [];
    const shootingStars: {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
    }[] = [];

    // Initialize stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.05,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    // Initialize shooting stars
    for (let i = 0; i < 5; i++) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: (Math.random() * canvas.height) / 2,
        length: Math.random() * 80 + 20,
        speed: Math.random() * 10 + 5,
        angle: (Math.random() * Math.PI) / 4 + Math.PI / 4,
        opacity: 0,
        active: false,
      });
    }

    // Animation loop
    let animationFrameId: number;
    let lastShootingStarTime = 0;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Move stars slightly
        star.y += star.speed;

        // Reset stars that go off screen
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Activate a shooting star randomly
      if (time - lastShootingStarTime > 2000 && Math.random() < 0.02) {
        const inactiveStar = shootingStars.find((star) => !star.active);
        if (inactiveStar) {
          inactiveStar.active = true;
          inactiveStar.opacity = 1;
          inactiveStar.x = Math.random() * canvas.width;
          inactiveStar.y = (Math.random() * canvas.height) / 3;
          lastShootingStarTime = time;
        }
      }

      // Draw shooting stars
      shootingStars.forEach((star) => {
        if (!star.active) return;

        const tailX = star.x - Math.cos(star.angle) * star.length;
        const tailY = star.y + Math.sin(star.angle) * star.length;

        // Create gradient for the tail
        const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Move shooting star
        star.x += Math.cos(star.angle) * star.speed;
        star.y -= Math.sin(star.angle) * star.speed;

        // Fade out as it moves
        star.opacity -= 0.01;

        // Reset if off screen or faded out
        if (star.x > canvas.width || star.y < 0 || star.opacity <= 0) {
          star.active = false;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-black via-slate-950 to-slate-900">
      {/* Star field canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Edward Lee
          </h1>
        </div>
      </div>
    </div>
  );
}
