import React, { useEffect, useRef, useState } from 'react';
import { playTickSound } from '../utils/audio';

interface Props {
  items: string[];
  isSpinning: boolean;
  targetIndex: number;
  duration: number;
  onStop: () => void;
}

export default function RouletteWheel({ items, isSpinning, targetIndex, duration, onStop }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const prevRotationRef = useRef(0);
  const isSpinningRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 800; // High res for crisp rendering
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    if (items.length === 0) return;

    const sliceAngle = (2 * Math.PI) / items.length;
    const colors = ['#4f46e5', '#818cf8', '#c7d2fe', '#312e81', '#6366f1'];

    for (let i = 0; i < items.length; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, i * sliceAngle, (i + 1) * sliceAngle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(i * sliceAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = i % colors.length === 2 ? '#1e1b4b' : '#ffffff';
      ctx.font = items.length > 40 ? 'bold 14px sans-serif' : 'bold 20px sans-serif';
      
      const text = items[i];
      const displayText = text.length > 25 ? text.substring(0, 25) + '...' : text;
      
      ctx.fillText(displayText, radius - 30, 6);
      ctx.restore();
    }
  }, [items]);

  useEffect(() => {
    if (isSpinning && !isSpinningRef.current) {
      isSpinningRef.current = true;
      
      const sliceAngle = 360 / items.length;
      const A = targetIndex * sliceAngle + sliceAngle / 2;
      const k = 8; // 8 full spins
      const newRotation = prevRotationRef.current + (360 - (prevRotationRef.current % 360)) + 360 * k - A;
      
      setRotation(newRotation);
      prevRotationRef.current = newRotation;
      
      // Simulate ticks
      let ticks = 0;
      const maxTicks = 40;
      const tick = () => {
        if (!isSpinningRef.current) return;
        playTickSound();
        ticks++;
        if (ticks < maxTicks) {
           const progress = ticks / maxTicks;
           const delay = 20 + Math.pow(progress, 3) * 400;
           setTimeout(tick, delay);
        }
      };
      tick();
      
      const timer = setTimeout(() => {
        isSpinningRef.current = false;
        onStop();
      }, duration * 1000);
      
      return () => {
        clearTimeout(timer);
        isSpinningRef.current = false;
      };
    }
  }, [isSpinning, targetIndex, duration, items.length, onStop]);

  return (
    <div className="relative w-full max-w-[320px] sm:max-w-md mx-auto aspect-square">
      {/* Pointer at 3 o'clock */}
      <div className="absolute top-1/2 right-[-10px] sm:right-[-20px] translate-x-0 -translate-y-1/2 w-0 h-0 border-t-[15px] border-b-[15px] border-r-[30px] sm:border-t-[20px] sm:border-b-[20px] sm:border-r-[40px] border-t-transparent border-b-transparent border-r-amber-500 z-10 drop-shadow-lg" />
      
      <div className="w-full h-full rounded-full overflow-hidden border-[8px] sm:border-[12px] border-white shadow-2xl bg-white">
        <canvas 
          ref={canvasRef}
          className="w-full h-full"
          style={{ 
            transform: `rotate(${rotation}deg)`, 
            transition: isSpinning ? `transform ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1)` : 'none'
          }}
        />
      </div>
    </div>
  );
}
