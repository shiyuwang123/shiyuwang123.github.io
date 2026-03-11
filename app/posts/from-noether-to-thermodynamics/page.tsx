import PostLayout from '@/components/PostLayout';
import Math from '@/components/Math';
import { PendulumSim, MomentumSim, AngularSim, ThermoSim } from '@/components/NoetherAnimations';

export default function FromNoetherToThermodynamics() {
	return (
		<PostLayout
			title="From Noether to Thermodynamics"
			date="2026-03-10 21:41:00 -0700"
			categories={['Physics', 'Mathematics']}
			tags={['Noether', 'Thermodynamics', 'Symmetry', 'Calculus']}
		>
			<p className="text-xl text-muted-foreground mb-12">
				How the symmetries of the universe dictate the laws of motion and give birth to the First Law of Thermodynamics.
			</p>

			<h2>1. The Premise</h2>
			<p>
				In basic physics, you learned the <strong>First Law of Thermodynamics</strong>: Energy cannot be created or destroyed (<Math math="dU = \delta Q + \delta W" />). You also learned that Momentum and Angular Momentum are conserved.
			</p>
			<p>
				But <em>why</em> are they conserved? In 1915, mathematician Emmy Noether proved a mind-bending theorem: <strong>Every continuous symmetry in the universe corresponds to a mathematically conserved quantity.</strong>
			</p>
			<p>
				Today, we will use basic calculus to prove that Time, Space, and Rotational symmetries give us Energy, Momentum, and Angular Momentum. Then, we will scale this up to show how these mechanics form Thermodynamics.
			</p>

			<h2>2. Vectors vs. Scalars (The Lagrangian)</h2>
			<p>
				In classical mechanics, tracking particles using Newton's <Math math="\vec{F} = m\vec{a}" /> is exhausting because vectors constantly change directions. Joseph-Louis Lagrange realized we can solve mechanics using entirely <strong>scalars</strong> (numbers with no direction).
			</p>

			<p>He defined the <strong>Lagrangian (<Math math="L" />)</strong> as Kinetic Energy (<Math math="K" />) minus Potential Energy (<Math math="V" />):</p>
			<Math math="L = K - V" block />

			<p>
				Nature inherently obeys the <strong>Principle of Least Action</strong>. Out of all possible paths a particle could take, it chooses the path that <em>minimizes</em> the accumulation of <Math math="L" /> over time. Just like setting a derivative to zero in calculus finds a minimum, we use the <strong>Euler-Lagrange Equation</strong> to find this path:
			</p>

			<div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 my-8 text-center">
				<strong className="text-blue-900 block mb-4">The Euler-Lagrange Equation</strong>
				<Math math="\frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}}\right) - \frac{\partial L}{\partial q} = 0" block />
			</div>

			<PendulumSim />

			<h2>3. Spatial Symmetry &rarr; Momentum</h2>
			<p>
				Let's look at <strong>Spatial Translation Symmetry</strong>. This means the laws of physics don't care <em>where</em> you are. Empty space is uniform. An experiment done at coordinate <Math math="x = 0" /> yields the exact same results at <Math math="x = 100" />.
			</p>

			<p>
				Mathematically, if the environment is uniform, the Potential Energy doesn't depend on your absolute position <Math math="q" />. Therefore, the Lagrangian <Math math="L" /> does not depend on <Math math="q" />. The partial derivative is zero:
			</p>
			<Math math="\frac{\partial L}{\partial q} = 0" block />

			<p>Now, plug this zero into the Euler-Lagrange equation:</p>
			<Math math="\frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}}\right) - 0 = 0 \implies \frac{d}{dt}\left(\frac{\partial L}{\partial \dot{q}}\right) = 0" block />

			<p>
				In calculus, if the time derivative of a quantity is zero, that quantity is a <strong>constant</strong>. We call this conserved quantity <strong>Momentum (<Math math="p" />)</strong>!
			</p>
			<Math math="p = \frac{\partial L}{\partial \dot{q}} = \text{Constant}" block />
			<p className="text-center text-sm text-muted-foreground italic mb-8">
				(Since <Math math="L = \frac{1}{2}m\dot{q}^2" />, taking the derivative with respect to <Math math="\dot{q}" /> literally gives <Math math="p = m\dot{q} = mv" />)
			</p>

			<MomentumSim />

			<h2>4. Rotational Symmetry &rarr; Angular Momentum</h2>
			<p>
				What if we use polar coordinates? <strong>Rotational Symmetry</strong> means empty space is isotropic—it has no "up" or "down". The laws of physics don't care which angle <Math math="\theta" /> you face.
			</p>

			<p>
				If a system is rotationally symmetric (like a planet orbiting a star), the Lagrangian doesn't depend on the absolute angle <Math math="\theta" />.
			</p>
			<Math math="\frac{\partial L}{\partial \theta} = 0 \implies \frac{d}{dt}\left(\frac{\partial L}{\partial \dot{\theta}}\right) = 0" block />

			<p>
				The resulting constant is <strong>Angular Momentum (<Math math="J" />)</strong>. For a mass <Math math="m" /> spinning at radius <Math math="r" /> with angular velocity <Math math="\dot{\theta}" />, the angular momentum is <Math math="J = mr^2\dot{\theta}" />. Because <Math math="J" /> is constant, if the radius <Math math="r" /> decreases, the rotation speed <Math math="\dot{\theta}" /> <em>must</em> increase to compensate!
			</p>

			<AngularSim />

			<h2>5. Time Symmetry &rarr; Energy</h2>
			<p>
				Finally, <strong>Time Translation Symmetry</strong>. The background rules of physics don't have a clock. Gravity doesn't fade over time. Therefore, <Math math="L" /> has no explicit time dependence: <Math math="\frac{\partial L}{\partial t} = 0" />.
			</p>

			<p>
				Taking the total derivative of <Math math="L" /> with the chain rule, and substituting the Euler-Lagrange equation, Noether proved that the following quantity perfectly drops out as a constant:
			</p>
			<Math math="E = \dot{q}\frac{\partial L}{\partial \dot{q}} - L = \text{Constant}" block />

			<p>
				This constant is <strong>Energy</strong>. (If you plug in <Math math="L = K-V" />, you get <Math math="E = K+V" />).
			</p>

			<div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-2xl my-8">
				<strong className="text-orange-900 block mb-2 text-lg">The Noether Master Key:</strong>
				<ul className="list-disc pl-5 space-y-2 text-orange-900">
					<li>Space is uniform &rarr; <strong>Momentum</strong> is conserved.</li>
					<li>Space is isotropic &rarr; <strong>Angular Momentum</strong> is conserved.</li>
					<li>Time is uniform &rarr; <strong>Energy</strong> is conserved.</li>
				</ul>
			</div>

			<h2>6. Scaling up to Thermodynamics</h2>
			<p>
				We proved a single particle conserves energy over time. But for a gas made of <Math math="10^{23}" /> particles, we group the energy into two macroscopic categories:
			</p>
			<ol className="list-decimal pl-5 space-y-2 mb-8">
				<li><strong>Macroscopic Energy:</strong> The kinetic energy of the entire box moving (Momentum).</li>
				<li><strong>Internal Energy (<Math math="U" />):</strong> The invisible, random kinetic jiggling of the trillions of particles inside.</li>
			</ol>

			<ThermoSim />

			<h2>7. The First Law</h2>
			<p>
				According to Noether's theorem, total energy is strictly conserved (<Math math="\Delta E_{total} = 0" />).
			</p>
			<p>
				If our gas box is sitting still, its macroscopic momentum is zero. Any change to its Internal Energy (<Math math="dU" />) must come from energy crossing its boundaries. There are only two methods:
			</p>
			<ul className="list-disc pl-5 space-y-2 mb-8">
				<li><strong>Heat (<Math math="\delta Q" />):</strong> Energy transferred through random microscopic collisions.</li>
				<li><strong>Work (<Math math="\delta W" />):</strong> Energy transferred through macroscopic, organized force (a piston).</li>
			</ul>
			<p>
				Because Noether mathematically guarantees total energy is constant, the change in the internal energy <em>must</em> equal the heat added minus the work done by the system.
			</p>
			<Math math="dU = \delta Q + \delta W" block />

			<p className="text-lg font-medium bg-gray-50 p-6 rounded-2xl border border-gray-200 mt-8">
				<strong>Conclusion:</strong> The First Law of Thermodynamics is not a separate rule of nature. It is the direct macroscopic manifestation of <em>Time Translation Symmetry</em> operating on a microscopic scale!
			</p>
		</PostLayout>
	);
}

