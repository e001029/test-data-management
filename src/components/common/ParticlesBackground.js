import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

function ParticlesBackground() {
  const particlesInit = async (engine) => await loadSlim(engine);
  const particleOptions = {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: '#0078D4' },
      shape: { type: 'circle' },
      opacity: { value: 0.7 },
      size: { value: 3 },
      move: { enable: true, speed: 1, direction: 'none', random: true },
      links: { enable: true, distance: 150, color: '#00C4B4', opacity: 0.5 },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
    },
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={particleOptions}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  );
}

export default ParticlesBackground;