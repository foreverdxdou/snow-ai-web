import React, { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  angle: number;
  rotation: number;
}

const BackgroundEffects: React.FC = () => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  // 绘制星星
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    
    // 添加星星光晕
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.8})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.4})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.1})`);
    
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 绘制星星主体
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const radius = i % 2 === 0 ? size : size / 2;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.fill();
    
    ctx.restore();
  };

  // 绘制雪花
  const drawSnowflake = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, rotation: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    // 添加雪花光晕
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.2);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.3})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.1})`);
    
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = Math.cos(angle) * size;
      const py = Math.sin(angle) * size;
      
      // 绘制主分支
      ctx.moveTo(0, 0);
      ctx.lineTo(px, py);
      
      // 绘制侧分支
      const sideAngle = angle + Math.PI / 6;
      const sideSize = size / 2;
      const sideX = Math.cos(sideAngle) * sideSize;
      const sideY = Math.sin(sideAngle) * sideSize;
      ctx.moveTo(px / 2, py / 2);
      ctx.lineTo(px / 2 + sideX, py / 2 + sideY);
      
      const sideAngle2 = angle - Math.PI / 6;
      const sideX2 = Math.cos(sideAngle2) * sideSize;
      const sideY2 = Math.sin(sideAngle2) * sideSize;
      ctx.moveTo(px / 2, py / 2);
      ctx.lineTo(px / 2 + sideX2, py / 2 + sideY2);
    }
    ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.lineWidth = 2.5; // 增加线条宽度
    ctx.stroke();
    
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 创建粒子
    const createParticles = () => {
      const particles: Particle[] = [];
      const count = theme.palette.mode === 'dark' ? 50 : 50; // 减少数量以适应更大的尺寸

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (theme.palette.mode === 'dark' ? 8 : 10) + 6, // 增大雪花尺寸
          speed: Math.random() * 0.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.7, // 增加基础不透明度
          angle: Math.random() * Math.PI * 2,
          rotation: Math.random() * Math.PI * 2,
        });
      }
      return particles;
    };

    particlesRef.current = createParticles();

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // 更新位置
        if (theme.palette.mode === 'dark') {
          // 星星闪烁效果
          particle.opacity = Math.random() * 0.3 + 0.7; // 增加基础亮度
          // 轻微移动
          particle.x += Math.sin(particle.angle) * 0.2;
          particle.y += Math.cos(particle.angle) * 0.2;
          particle.angle += 0.01;
          particle.rotation += 0.01;

          // 绘制星星
          drawStar(ctx, particle.x, particle.y, particle.size, particle.opacity);
        } else {
          // 雪花飘落效果
          particle.y += particle.speed;
          particle.x += Math.sin(particle.angle) * 0.5;
          particle.angle += 0.01;
          particle.rotation += 0.02;

          if (particle.y > canvas.height) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
          }

          // 绘制雪花
          drawSnowflake(ctx, particle.x, particle.y, particle.size, particle.opacity, particle.rotation);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme.palette.mode]);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

export default BackgroundEffects; 