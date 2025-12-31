import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { opacity: 0.45; }
  40% { opacity: 0.9; }
  70% { opacity: 0.55; }
  100% { opacity: 0.45; }
`;

const Layer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const GradientNoise = styled.div`
  position: absolute;
  inset: -20%;
  background: radial-gradient(1200px circle at 20% 20%, rgba(124, 58, 237, 0.14), transparent 38%),
    radial-gradient(900px circle at 70% 10%, rgba(56, 189, 248, 0.16), transparent 30%),
    radial-gradient(700px circle at 60% 80%, rgba(52, 211, 153, 0.12), transparent 42%);
  filter: blur(60px);
  opacity: 0.65;
`;

const Particle = styled.span`
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 18px rgba(255, 255, 255, 0.4);
  animation: ${float} 6s ease-in-out infinite, ${shimmer} 7s ease-in-out infinite;
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.6));
`;

const particlePositions = [
  { top: '8%', left: '12%' },
  { top: '18%', left: '72%' },
  { top: '30%', left: '44%' },
  { top: '42%', left: '18%' },
  { top: '56%', left: '64%' },
  { top: '68%', left: '32%' },
  { top: '72%', left: '78%' },
  { top: '82%', left: '48%' },
];

export const ParticleField = () => (
  <Layer aria-hidden>
    <GradientNoise />
    {particlePositions.map((position, index) => (
      <Particle key={index} style={{ ...position, animationDelay: `${index * 0.6}s` }} />
    ))}
  </Layer>
);
