'use client';

import { useEffect, useRef, useState } from 'react';

// --- Helper Functions ---
function setShadow(ctx: CanvasRenderingContext2D, x: number, y: number, blur: number, color: string) {
  ctx.shadowOffsetX = x;
  ctx.shadowOffsetY = y;
  ctx.shadowBlur = blur;
  ctx.shadowColor = color;
}

function clearShadow(ctx: CanvasRenderingContext2D) {
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

function drawArrow(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, length: number, color: string) {
  if (length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(length, 0);
  ctx.lineTo(length - 6, -4);
  ctx.lineTo(length - 6, 4);
  ctx.fill();
  ctx.restore();
}

// ==========================================
// 1. LeastActionSim (Principle of Least Action)
// ==========================================
export function LeastActionSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [c, setC] = useState(0); // Start with a straight line (c=0)
  const cRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    cRef.current = c;
  }, [c]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const currentC = cRef.current;
      
      // Update time for the moving particle
      timeRef.current += 0.015;
      if (timeRef.current > 2) timeRef.current = 0;
      const t = timeRef.current;

      const isOptimal = Math.abs(currentC - 5) < 0.1;

      // --- Left Pane: Trajectory ---
      ctx.fillStyle = '#888888';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("Particle Trajectory (Space)", 220, 30);

      // Draw ground line
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, 280);
      ctx.lineTo(440, 280);
      ctx.stroke();

      // Draw True Path (faint green dashed line)
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      for(let u = 0; u <= 2; u += 0.05) {
          const px = 50 + (u / 2) * 340;
          const py = 280 - (5 * u * (2 - u)) * 20;
          if (u === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Current Path
      ctx.strokeStyle = isOptimal ? '#22c55e' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for(let u = 0; u <= 2; u += 0.05) {
          const px = 50 + (u / 2) * 340;
          const py = 280 - (currentC * u * (2 - u)) * 20;
          if (u === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Draw Moving Particle
      const bx = 50 + (t / 2) * 340;
      const by = 280 - (currentC * t * (2 - t)) * 20;
      
      setShadow(ctx, 0, 4, 8, isOptimal ? 'rgba(34, 197, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)');
      ctx.fillStyle = isOptimal ? '#22c55e' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(bx, by, 8, 0, Math.PI*2);
      ctx.fill();
      clearShadow(ctx);

      // Start & End points
      ctx.fillStyle = '#1d1d1f';
      ctx.beginPath(); ctx.arc(50, 280, 4, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(390, 280, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#888888';
      ctx.fillText("A", 50, 300);
      ctx.fillText("B", 390, 300);

      // --- Right Pane: Action Graph ---
      ctx.fillStyle = '#888888';
      ctx.fillText("Action (S) vs Path", 580, 30);

      // Draw axes for graph
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(480, 280 - (0 - (-10)) * 5); // S=0 line
      ctx.lineTo(680, 280 - (0 - (-10)) * 5);
      ctx.stroke();

      // Draw Action Curve (Parabola)
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for(let dc = 0; dc <= 10; dc += 0.2) {
          const S = 25 + (4/3)*dc*dc - (40/3)*dc;
          const cx = 480 + (dc / 10) * 200;
          const cy = 280 - (S + 10) * 5;
          if (dc === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
      }
      ctx.stroke();

      // Draw Minimum Line
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(480 + 100, 280 - (-8.33 + 10) * 5);
      ctx.lineTo(480 + 100, 280);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Current Action Point
      const currentS = 25 + (4/3)*currentC*currentC - (40/3)*currentC;
      const cx = 480 + (currentC / 10) * 200;
      const cy = 280 - (currentS + 10) * 5;

      setShadow(ctx, 0, 2, 6, 'rgba(0,0,0,0.2)');
      ctx.fillStyle = isOptimal ? '#22c55e' : '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI*2);
      ctx.fill();
      clearShadow(ctx);

      // Text for current Action
      ctx.fillStyle = isOptimal ? '#22c55e' : '#888888';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText(`S = ${currentS.toFixed(1)}`, cx, cy - 15);

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-col items-center my-12 bg-muted/30 rounded-3xl p-8 border border-border">
      <div className="text-xl font-semibold mb-2">Interactive: The Principle of Least Action</div>
      <div className="text-sm text-muted-foreground text-center mb-6 max-w-2xl">
        Instead of tracking vectors, nature calculates a single scalar number called <strong>Action (S)</strong> for the entire path. The true physical path is the one where the Action is minimized.
      </div>
      
      <div className="rounded-2xl overflow-hidden shadow-xl bg-white dark:bg-zinc-900 mb-6 w-full max-w-[700px]">
        <canvas ref={canvasRef} width={700} height={320} className="w-full h-auto block" />
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-2">
        <label className="text-sm font-medium text-foreground flex justify-between w-full">
          <span>Straight Line</span>
          <span>Adjust Path Arc</span>
          <span>High Arc</span>
        </label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={c}
          onChange={(e) => setC(parseFloat(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="text-sm text-center mt-3 h-6">
          {Math.abs(c - 5) < 0.1
            ? <span className="text-green-600 dark:text-green-400 font-bold">Nature's Path Found! Action is minimized.</span>
            : <span className="text-muted-foreground">Slide to explore different paths. Notice how the Action (S) changes.</span>}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. MomentumSim (Spatial Symmetry)
// ==========================================
export function MomentumSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sysRef = useRef({
    isRunning: false,
    sys1: { x1: 80, x2: 200, v1: 0, v2: 0 },
    sys2: { x1: 430, x2: 550, v1: 0, v2: 0 }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const drawBlock = (x: number, color: string, label: string) => {
      setShadow(ctx, 0, 4, 10, 'rgba(0,0,0,0.15)');
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x - 15, 90, 30, 30, 6);
      ctx.fill();
      clearShadow(ctx);
      
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText(label, x, 105);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const state = sysRef.current;

      // Ground
      ctx.fillStyle = '#f5f5f7';
      ctx.fillRect(0, 120, canvas.width, 80);
      ctx.strokeStyle = '#e5e5ea';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 120);
      ctx.lineTo(canvas.width, 120);
      ctx.stroke();

      // Physics Update
      if (state.isRunning) {
        state.sys1.x1 += state.sys1.v1;
        state.sys1.x2 += state.sys1.v2;
        state.sys2.x1 += state.sys2.v1;
        state.sys2.x2 += state.sys2.v2;

        // Collision
        if (state.sys1.x1 + 30 > state.sys1.x2) {
          state.sys1.v2 = state.sys1.v1;
          state.sys1.v1 = 0;
        }
        if (state.sys2.x1 + 30 > state.sys2.x2) {
          state.sys2.v2 = state.sys2.v1;
          state.sys2.v1 = 0;
        }
      }

      // Draw System 1 (Left)
      drawBlock(state.sys1.x1, '#0071e3', "m");
      drawBlock(state.sys1.x2, '#86868b', "m");
      
      // Draw System 2 (Right)
      drawBlock(state.sys2.x1, '#ff3b30', "m");
      drawBlock(state.sys2.x2, '#86868b', "m");

      // UI
      ctx.fillStyle = '#1d1d1f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText("Experiment at x = 100", 140, 150);
      ctx.fillText("Experiment at x = 450", 490, 150);
      
      ctx.fillStyle = '#86868b';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
      ctx.fillText("Identical outcomes prove Momentum is conserved.", canvas.width/2, 180);

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const runSim = () => {
    sysRef.current.isRunning = true;
    sysRef.current.sys1.v1 = 4;
    sysRef.current.sys2.v1 = 4;
  };

  const resetSim = () => {
    sysRef.current = {
      isRunning: false,
      sys1: { x1: 80, x2: 200, v1: 0, v2: 0 },
      sys2: { x1: 430, x2: 550, v1: 0, v2: 0 }
    };
  };

  return (
    <div className="flex flex-col items-center my-12 bg-muted/30 rounded-3xl p-8 border border-border">
      <div className="text-xl font-semibold mb-2">Spatial Symmetry (Momentum Conservation)</div>
      <div className="text-sm text-muted-foreground text-center mb-6 max-w-2xl">
        Colliding blocks at x=100 behave identically to blocks at x=400 because space is uniform. Their total momentum never changes.
      </div>
      <div className="rounded-2xl overflow-hidden shadow-xl bg-white mb-6">
        <canvas ref={canvasRef} width={700} height={200} className="max-w-full h-auto block" />
      </div>
      <div className="flex gap-4">
        <button onClick={runSim} className="px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-sm">
          Collide Blocks
        </button>
        <button onClick={resetSim} className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
          Reset Space
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. AngularSim (Rotational Symmetry)
// ==========================================
export function AngularSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [metrics, setMetrics] = useState({ radius: 120, omega: 0.02, L: 0 });
  
  const stateRef = useRef({
    angle: 0,
    radius: 120,
    mass: 1,
    L_const: 1 * (120 * 120) * 0.02,
    isPulling: false,
    trails: [] as {x: number, y: number}[]
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const state = stateRef.current;

      const originX = canvas.width / 2;
      const originY = canvas.height / 2;

      if (state.isPulling && state.radius > 40) {
        state.radius -= 0.5;
      }

      const omega = state.L_const / (state.mass * state.radius * state.radius);
      state.angle += omega;

      const bobX = originX + state.radius * Math.cos(state.angle);
      const bobY = originY + state.radius * Math.sin(state.angle);

      // Trails
      if (frameCount % 2 === 0) {
        state.trails.push({x: bobX, y: bobY});
      }
      if (state.trails.length > 40) {
        state.trails.shift();
      }

      ctx.lineWidth = 4;
      for (let i = 0; i < state.trails.length - 1; i++) {
        const alpha = i / state.trails.length;
        ctx.strokeStyle = `rgba(191, 90, 242, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(state.trails[i].x, state.trails[i].y);
        ctx.lineTo(state.trails[i+1].x, state.trails[i+1].y);
        ctx.stroke();
      }

      // String & Center
      ctx.strokeStyle = '#86868b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();
      
      ctx.fillStyle = '#1d1d1f';
      ctx.beginPath();
      ctx.arc(originX, originY, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Mass
      setShadow(ctx, 0, 6, 12, 'rgba(191, 90, 242, 0.4)');
      ctx.fillStyle = '#bf5af2';
      ctx.beginPath();
      ctx.arc(bobX, bobY, 12, 0, 2 * Math.PI);
      ctx.fill();
      clearShadow(ctx);

      // Update React state for UI occasionally to avoid too many re-renders
      if (frameCount % 5 === 0) {
        setMetrics({ radius: state.radius, omega, L: state.L_const });
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const pullMass = () => { stateRef.current.isPulling = true; };
  const stopPull = () => { stateRef.current.isPulling = false; };
  const resetSim = () => {
    stateRef.current = {
      angle: 0,
      radius: 120,
      mass: 1,
      L_const: 1 * (120 * 120) * 0.02,
      isPulling: false,
      trails: []
    };
  };

  return (
    <div className="flex flex-col items-center my-12 bg-muted/30 rounded-3xl p-8 border border-border">
      <div className="text-xl font-semibold mb-2">Rotational Symmetry (Angular Momentum)</div>
      <div className="text-sm text-muted-foreground text-center mb-6 max-w-2xl">
        Pull the mass inward. Notice how the rotation accelerates to keep the scalar quantity J = mr²ω perfectly constant!
      </div>
      
      <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white mb-6">
        <div className="absolute top-4 left-4 text-sm font-mono z-10 pointer-events-none text-gray-900">
          <div>Radius (r): {metrics.radius.toFixed(0)}</div>
          <div>Velocity (ω): {metrics.omega.toFixed(3)}</div>
          <div className="text-purple-600 font-bold mt-1">Angular Momentum (J): {metrics.L.toFixed(0)} (Constant)</div>
        </div>
        <canvas ref={canvasRef} width={700} height={300} className="max-w-full h-auto block" />
      </div>
      
      <div className="flex gap-4">
        <button 
          onMouseDown={pullMass} 
          onMouseUp={stopPull}
          onMouseLeave={stopPull}
          onTouchStart={pullMass}
          onTouchEnd={stopPull}
          className="px-6 py-3 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors shadow-md hover:shadow-sm select-none"
        >
          Pull Mass Inward (Hold)
        </button>
        <button onClick={resetSim} className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
          Reset Orbit
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. ThermoSim (Thermodynamics)
// ==========================================
export function ThermoSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [internalEnergy, setInternalEnergy] = useState(0);
  
  const stateRef = useRef({
    particles: [] as {x: number, y: number, vx: number, vy: number}[],
    pistonX: 550,
    isCompressing: false
  });

  const initParticles = () => {
    const pts = [];
    for (let i = 0; i < 120; i++) {
      pts.push({
        x: 20 + Math.random() * (550 - 40),
        y: 20 + Math.random() * 260,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3
      });
    }
    stateRef.current.particles = pts;
    stateRef.current.pistonX = 550;
  };

  useEffect(() => {
    initParticles();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameCount = 0;

    // Helper to interpolate colors
    const lerpColor = (a: number[], b: number[], amount: number) => {
      const rr = a[0] + amount * (b[0] - a[0]);
      const rg = a[1] + amount * (b[1] - a[1]);
      const rb = a[2] + amount * (b[2] - a[2]);
      return `rgb(${Math.round(rr)}, ${Math.round(rg)}, ${Math.round(rb)})`;
    };
    const coldColor = [0, 113, 227]; // #0071e3
    const hotColor = [255, 59, 48];  // #ff3b30

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const state = stateRef.current;

      // Container Box
      ctx.strokeStyle = '#e5e5ea';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(10, 10, 680, 280, 16);
      ctx.stroke();

      // Piston logic
      if (state.isCompressing && state.pistonX > 200) {
        state.pistonX -= 3;
      }

      // Draw Piston
      setShadow(ctx, -4, 0, 15, 'rgba(0,0,0,0.1)');
      ctx.fillStyle = '#f5f5f7';
      ctx.beginPath();
      ctx.roundRect(state.pistonX, 12, 680 - state.pistonX - 2, 276, 8);
      ctx.fill();
      clearShadow(ctx);
      
      ctx.fillStyle = '#d2d2d7';
      ctx.beginPath();
      ctx.roundRect(state.pistonX, 12, 8, 276, 4);
      ctx.fill();

      let totalEnergy = 0;

      // Particles
      for (const pt of state.particles) {
        pt.x += pt.vx;
        pt.y += pt.vy;

        // Bounce walls
        if (pt.x < 15) { pt.x = 15; pt.vx *= -1; }
        if (pt.y < 15) { pt.y = 15; pt.vy *= -1; }
        if (pt.y > 285) { pt.y = 285; pt.vy *= -1; }
        
        // Bounce piston (Transfer of Macroscopic Work to Microscopic Energy)
        if (pt.x > state.pistonX - 5) {
          pt.x = state.pistonX - 5;
          // Piston velocity is -3 if compressing, 0 otherwise
          const vPiston = state.isCompressing ? -3 : 0;
          // Relative velocity
          const vRel = pt.vx - vPiston;
          // If moving towards the piston (vRel > 0)
          if (vRel > 0) {
            pt.vx = -vRel + vPiston;
          }
        }

        const speed = Math.sqrt(pt.vx * pt.vx + pt.vy * pt.vy);
        totalEnergy += 0.5 * (speed * speed);
        
        // Color based on temperature/speed
        let lerpAmt = (speed - 1) / 6;
        if (lerpAmt < 0) lerpAmt = 0;
        if (lerpAmt > 1) lerpAmt = 1;
        
        const c = lerpColor(coldColor, hotColor, lerpAmt);
        
        // Glow effect for hot particles
        if (speed > 4) {
          setShadow(ctx, 0, 0, 10, 'rgba(255, 59, 48, 0.5)');
        } else {
          clearShadow(ctx);
        }
        
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
      clearShadow(ctx);

      if (frameCount % 5 === 0) {
        setInternalEnergy(totalEnergy);
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const addHeat = () => {
    stateRef.current.particles.forEach(pt => {
      pt.vx *= 1.3;
      pt.vy *= 1.3;
    });
  };

  const startCompress = () => { stateRef.current.isCompressing = true; };
  const stopCompress = () => { stateRef.current.isCompressing = false; };

  return (
    <div className="flex flex-col items-center my-12 bg-muted/30 rounded-3xl p-8 border border-border">
      <div className="text-xl font-semibold mb-2">Visualizing Heat and Work</div>
      <div className="text-sm text-muted-foreground text-center mb-6 max-w-2xl">
        Particles turn <span className="text-red-500 font-bold">red</span> as their microscopic scalar energy increases. Work is organized macroscopic pushing; Heat is random microscopic jiggling.
      </div>
      
      <div className="rounded-2xl overflow-hidden shadow-xl bg-white mb-4">
        <canvas ref={canvasRef} width={700} height={300} className="max-w-full h-auto block" />
      </div>
      
      <div className="mb-6 text-lg font-medium">
        Internal Energy (U): <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-lg">{internalEnergy.toFixed(0)} J</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4">
        <button onClick={addHeat} className="px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors shadow-md hover:shadow-sm">
          Add Heat (δQ)
        </button>
        <button 
          onMouseDown={startCompress}
          onMouseUp={stopCompress}
          onMouseLeave={stopCompress}
          onTouchStart={startCompress}
          onTouchEnd={stopCompress}
          className="px-6 py-3 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors shadow-md hover:shadow-sm select-none"
        >
          Compress (δW)
        </button>
        <button onClick={initParticles} className="px-6 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
          Reset Gas
        </button>
      </div>
    </div>
  );
}
