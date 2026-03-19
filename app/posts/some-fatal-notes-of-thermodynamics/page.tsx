import PostLayout from '@/components/PostLayout';
import CodeBlock from '@/components/CodeBlock';
import Math from '@/components/Math';
import FadeIn from '@/components/FadeIn';

export default function Post() {
  return (
    <PostLayout
      title="Some Fatal notes about Thermodynamics"
      date="2026-03-19 19:26:00 +0800"
      isHighlight={true}
    >
      <FadeIn delay={0.1}>
        <h1>Why the thermodynamics fundamental equations are fundamental.</h1>
        <h2>1. The Microscopic Origin of Degrees of Freedom</h2>
        <p>
          To deduce the degrees of freedom of a thermodynamic system without circular reasoning, we must discard macroscopic empirical laws entirely. We start from the absolute bottom: <strong>Quantum Mechanics</strong> and <strong>Statistical Mechanics</strong>.
        </p>
        <p>
          Consider a closed system (particle number <Math math="N" /> is fixed). Macroscopic internal energy <Math math="U" /> is defined as the ensemble average of the discrete microscopic quantum energy states <Math math="E_i" />, weighted by the probability <Math math="p_i" /> of the system occupying that state:
        </p>
        <Math math="U = \sum_i p_i E_i" block />
        <p>
          Applying the product rule of calculus to take the exact differential of <Math math="U" />, we uncover the absolute foundation of energy change:
        </p>
        <Math math="dU = \sum_i p_i dE_i + \sum_i E_i dp_i" block />
        <p>
          This exact differential splits energy variation into exactly <strong>two independent mathematical sums</strong>. Let us analyze what dictates each sum physically.
        </p>

        <h3>Degree of Freedom 1: Volume (The Quantum Eigenvalues)</h3>
        <p>
          The first term, <Math math="\sum p_i dE_i" />, involves the shifting of the quantum energy eigenvalues <Math math="E_i" /> themselves. What controls <Math math="E_i" />? For a simple compressible system, we look at the quantum mechanical "Particle in a 3D Box". The energy levels are:
        </p>
        <Math math="E_{n_x,n_y,n_z} = \frac{h^2}{8m L^2}(n_x^2 + n_y^2 + n_z^2) = \frac{h^2}{8m V^{2/3}}(n_x^2 + n_y^2 + n_z^2)" block />
        <p>
          Because <Math math="N" /> and mass <Math math="m" /> are constant, the <em>only</em> macroscopic variable that can alter the energy eigenvalues <Math math="E_i" /> is the physical geometry of the boundary—the <strong>Volume (<Math math="V" />)</strong>. Therefore, <Math math="E_i = E_i(V)" />, making <Math math="V" /> our first independent degree of freedom.
        </p>

        <h3>Degree of Freedom 2: Entropy (The Statistical Probabilities)</h3>
        <p>
          The second term, <Math math="\sum E_i dp_i" />, involves changing the probability distribution <Math math="p_i" /> among the states while the energy levels themselves remain fixed. In statistical mechanics, the probability distribution is the sole determinant of the Gibbs/von Neumann <strong>Entropy (<Math math="S" />)</strong>:
        </p>
        <Math math="S = -k_B \sum_i p_i \ln p_i" block />
        <p>
          Any variation in the probabilities (<Math math="dp_i" />) fundamentally manifests as a change in the macroscopic entropy (<Math math="dS" />). Thus, <Math math="S" /> mathematically encapsulates the second sum, establishing it as the second independent degree of freedom.
        </p>
        
        <p>
          <strong>Logical Conclusion:</strong> For a closed system, macroscopic internal energy <Math math="U" /> is exclusively determined by the quantum energy levels (parameterized by <Math math="V" />) and the occupation probabilities (parameterized by <Math math="S" />). Consequently, we have proven that <Math math="U" /> must be a state function of exactly two variables:
        </p>
        <Math math="U = U(S, V)" block />

        <h2>2. Rigorous Mathematical Definition of T and P</h2>
        <p>
          Because <Math math="U" /> is a continuous function of exactly two variables, <Math math="S" /> and <Math math="V" />, we invoke pure multivariate calculus. The exact total differential of <Math math="U(S, V)" /> is unavoidably:
        </p>
        <Math math="dU = \left(\frac{\partial U}{\partial S}\right)_V dS + \left(\frac{\partial U}{\partial V}\right)_S dV" block />
        <p>
          At this point, thermodynamics makes a definitional leap. We <em>define</em> the intensive conjugate variables, Temperature (<Math math="T" />) and Pressure (<Math math="P" />), purely as the partial derivatives (the slopes) of this energy surface:
        </p>
        <Math math="T \equiv \left(\frac{\partial U}{\partial S}\right)_V, \quad P \equiv -\left(\frac{\partial U}{\partial V}\right)_S" block />
        <p>
          Substituting these geometric definitions back into the differential yields the macroscopic First Law: <Math math="dU = T dS - P dV" />. This equation is not an empirical postulate; it is a mathematical identity born from the geometry of the <Math math="U(S,V)" /> manifold.
        </p>

        <h2>3. Consistency Check: Statistical Thermodynamics</h2>
        <p>
          Are these pure mathematical abstractions for <Math math="T" /> and <Math math="P" /> physically valid? Let's prove their consistency with physical phenomena.
        </p>

        <h3>Proving T represents Thermal Equilibrium</h3>
        <p>
          Consider two isolated systems (1 and 2) sharing energy such that <Math math="U_{tot} = U_1 + U_2 = \text{constant}" /> (hence <Math math="dU_1 = -dU_2" />). According to statistical mechanics, equilibrium is the most probable macrostate, which maximizes total entropy <Math math="S_{tot} = S_1(U_1) + S_2(U_2)" />. At the maximum, the first derivative is zero:
        </p>
        <Math math="dS_{tot} = \left(\frac{\partial S_1}{\partial U_1}\right)_V dU_1 + \left(\frac{\partial S_2}{\partial U_2}\right)_V dU_2 = 0" block />
        <Math math="\implies \left(\frac{\partial S_1}{\partial U_1}\right)_V = \left(\frac{\partial S_2}{\partial U_2}\right)_V" block />
        <p>
          The physical definition of equilibrium is that temperatures are equal (<Math math="T_1 = T_2" />). Therefore, the function governing equilibrium is <Math math="(\partial S/\partial U)_V" />. Using the inverse rule of calculus:
        </p>
        <Math math="T \propto \left(\frac{\partial U}{\partial S}\right)_V" block />
        <p>
          This confirms our mathematical definition of <Math math="T" /> is the exact physical parameter governing heat flow.
        </p>

        <h3>Proving P represents Mechanical Pressure</h3>
        <p>
          Microscopically, if we change the volume of a system slowly without changing the probability distributions (<Math math="dp_i = 0" />, therefore <Math math="dS = 0" />, an isentropic process), the change in energy is entirely due to the shifting quantum eigenvalues:
        </p>
        <Math math="dU = \sum_i p_i dE_i = \left( \sum_i p_i \frac{\partial E_i}{\partial V} \right) dV" block />
        <p>
          From classical mechanics, the ensemble average of the generalized force exerted by the system bounds is the physical pressure. Thus, <Math math="P_{physical} = -\sum_i p_i (\partial E_i/\partial V)" />. Substituting this into the equation yields:
        </p>
        <Math math="\left(\frac{\partial U}{\partial V}\right)_S = -P_{physical}" block />
        <p>
          Which perfectly verifies our definition: <Math math="P = -(\partial U/\partial V)_S" />.
        </p>

        <h2>4. Ultimate Verification: Deriving Gas Kinetics Theory</h2>
        <p>
          If this entire logical chain is solid, we should be able to derive the empirical Ideal Gas Law and the Equipartition Theorem purely by applying our mathematical definitions of <Math math="T" /> and <Math math="P" /> to the exact quantum statistical entropy of a monoatomic gas.
        </p>
        <p>
          The absolute entropy of a monoatomic ideal gas is given by the <strong>Sackur-Tetrode Equation</strong>:
        </p>
        <Math math="S(U, V, N) = N k_B \ln \left[ \frac{V}{N} \left( \frac{4 \pi m}{3 N h^2} U \right)^{\frac{3}{2}} \right] + \frac{5}{2} N k_B" block />
        
        <p>
          Using the triple product (cyclic) rule of multivariable calculus, we know that <Math math="P = -\left(\frac{\partial U}{\partial V}\right)_S = T \left(\frac{\partial S}{\partial V}\right)_U" />. Let's use sympy to rigorously take the partial derivatives of the exact Sackur-Tetrode equation and unveil the gas laws:
        </p>

        <CodeBlock language="python" code={`import sympy as sp

# Define variables: U (Energy), V (Volume), N (Particles), kB (Boltzmann), const (quantum constants)
U, V, N, kB, const = sp.symbols('U V N k_B const', positive=True)

# Define the Sackur-Tetrode Equation (grouped quantum constants into 'const')
S = N * kB * sp.log( (V / N) * (const * (U / N))**(sp.Rational(3, 2)) ) + sp.Rational(5, 2) * N * kB

# ---------------------------------------------------------
# 1. Verifying Equipartition of Energy (Kinetic Temperature)
# Definition: 1/T = (dS/dU)_V
# ---------------------------------------------------------
dS_dU = sp.diff(S, U)
T = 1 / dS_dU

print("1. Derived Temperature (T):", T)
# Output: 2*U / (3*N*k_B)
# Rearranging the output: U = (3/2) N k_B T 
# EXACT MATCH: This is the exact kinetic energy of a monoatomic ideal gas!

# ---------------------------------------------------------
# 2. Verifying the Ideal Gas Equation of State
# Definition: P = T * (dS/dV)_U  (via cyclic rule from P = -(dU/dV)_S)
# ---------------------------------------------------------
dS_dV = sp.diff(S, V)
P = T * dS_dV

print("2. Derived Pressure (P):", sp.simplify(P))
# Output: 2*U / (3*V)
# We know from Step 1 that U = (3/2) N k_B T. Substituting U into the output:
# P = (2/3V) * (3/2 N k_B T)  =>  P = (N k_B T) / V
# EXACT MATCH: P * V = N * k_B * T (The Ideal Gas Law!)
`} />

        <p>
          <strong>Conclusion:</strong> The logic is impenetrable. By analyzing the fundamental quantum constraints (eigenvalues dependent on <Math math="V" />) and statistical mechanics (probabilities dependent on <Math math="S" />), we rigorously isolated exactly two degrees of freedom for energy change. Constructing the pure 2D mathematical manifold <Math math="U(S,V)" /> allowed us to mathematically define <Math math="T" /> and <Math math="P" /> as its partial derivatives. Applying these abstract mathematical definitions to the Sackur-Tetrode entropy spontaneously birthed the exact empirical laws of Gas Kinetics. Absolutely fatal.
        </p>
      </FadeIn>
    </PostLayout>
  );
}