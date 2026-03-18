import PostLayout from '@/components/PostLayout';
import Math from '@/components/Math';

export default function Post() {
  return (
    <PostLayout
      title="Some Fatal Warnings about Thermodynamics"
      date="2026-03-17 20:00:00 +0800"
      categories={["Physics", "Thermodynamics"]}
      isHighlight={true}
    >
      <p>When we learn Thermodynamics, there are some thing rather confusing and error prone.
        here, I will list some of them, and to eliminate some misunderstandings.
      </p>
      
      <h3>Fatal Warning 1: The relation between Enthalpy and isobar heat </h3>
      <p>Some textbooks address that the change of Enthalpy equals the heat
        while the system undergoes an isobaric process. 
      </p>
      <Math math="dH = \delta Q_{p}" block />
      
      <p>However, the conclusion only holds for reversible isobaric processes and there
        mustn't be any non-PV work. In other words, <strong>If the system pressure and the environment
        pressure is different, this conclusion is false.</strong>
      </p>
      <p>below is the deduction. </p>
      <p>Since <Math math="H = U + P_{sys}V_{sys}"/>, we have: </p>
      <Math math="dH = dU + P_{sys}dV_{sys} + V_{sys}dP_{sys} = dq + dw + P_{sys}dV_{sys} + V_{sys}dP_{sys}" block />
      <Math math="=dq - P_{sur}dV_{sys} + P_{sys}dV_{sys} + V_{sys}dP_{sys}" block />
      <p>Since the process is isobaric, <Math math="dP_{sys} = 0"/>, so: </p>
      <Math math="dH = dq + (P_{sys} - P_{sur})dV_{sys}" block />
      <p>Therefore, only when <Math math="P_{sys} = P_{sur}"/>, namely, the process is reversible, we have <Math math="dH = dq"/>. </p>
      <p>In fact, the reversible process is a special case of the general process, and the relation between Enthalpy and heat is more complicated than that. So, we should be careful when we use this relation, and we should always check the conditions before applying it.</p>

      <h3>Fatal Warning 2: Gibbs and Helmholtz Free Energies.</h3>
      <p>The core idea of Gibbs and Helmholtz free energy is to 
        consider the system and environment as a isolated system, 
        so that the criteria of spontaneous process is the change of 
        the total entropy of the isolated system.
      </p>
      <p>However, during the deduction of deriving free energies, some 
        assumptions was involved, which makes the free energy criteria
        have some limitations, which is often neglected by textbooks and courses. 
      </p>

      <p>Consider the environment is big enough so that its temperature is constant.
        Then, the change of the total entropy of the isolated system is: </p>
      <Math math="dS_{iso} = dS_{sys} + dS_{sur} \geq dS_{sys} - \frac{d Q}{T_{sur}}" block />
      <h4>isochoric process</h4>
      <p>For an isochoric process, we have: <Math math='dQ = dU'/>so that:</p>
      <Math math="dS_{iso} \geq dS_{sys} - \frac{dU}{T_{sur}} = \frac{1}{T_{sur}}(T_{sur}dS_{sys} - dU)" block />
      <p> Since <Math math="T_{sur} > 0"/>, we can deduce <Math math="dS_{iso} \geq 0"/> from <Math math='T_{sur}dS_{sys}-dU \geq 0'/></p>
      <p> If <strong>system temperature and surrounding temperature are identical</strong>, we have:</p>
      <Math math='T_{sur}dS_{sys}-dU \geq 0 \iff T_{sys}dS_{sys}-dU \geq 0' block />
      <p>So, we can define a <strong>state function whose decrease can indicate the increase of total entropy</strong>: </p>
      <Math math='A=U-T_{sys}S_{sys}' block/>
      <Math math='dA=dU-T_{sys}dS_{sys}-S_{sys}dT_{sys}' block/>
      <p>For a isothermo process, <Math math='dA=dU-T_{sys}dS_{sys}'/> and the negative <Math math='dA'/> indicates a positive <Math math='dS_{iso}'/></p>
      <p>As you saw, a lot of assumptions was introduced into the deduction.
        So, the criteria of Helmholtz free energy is only valid for isothermal process, and <strong>the system temperature must be identical to the surrounding temperature.</strong>
      </p>

      <h4>isobaric process</h4>
      <p>For an isobaric process<strong>where system pressure equals surrounding pressure</strong>, we have: <Math math='dQ = dH'/>so that:</p>
      <Math math="dS_{iso} \geq dS_{sys} - \frac{dH}{T_{sur}}" block />
      <Math math="dS_{iso} \geq \frac{1}{T_{sur}}(T_{sur}dS_{sys} - dH)" block />
        <p> If <strong>system temperature and surrounding temperature are identical</strong>, we have:</p>
        <Math math='T_{sur}dS_{sys}-dH \geq 0 \iff T_{sys}dS_{sys}-dH \geq 0' block />
        <p>So, we can define a <strong>state function whose decrease can indicate the increase of total entropy</strong>: </p>
        <Math math='G=H-T_{sys}S_{sys}' block/>
        <Math math='dG=dH-T_{sys}dS_{sys}-S_{sys}dT_{sys}' block/>
        <p>For a isothermo process, <Math math='dG=dH-T_{sys}dS_{sys}'/> and the negative <Math math='dG'/> indicates a positive <Math math='dS_{iso}'/></p>
        <p>As you saw, a lot of assumptions was introduced into the deduction.
          So, the criteria of Gibbs free energy is only valid for isothermal process, and <strong>the system temperature must be identical to the surrounding temperature.</strong>
        </p>

      <p>In conclusion, the criteria of free energies are only valid for isothermal processes, and <strong>the system temperature must be identical to the surrounding temperature.</strong> So, we should be careful when we use these criteria, and we should always check the conditions before applying them.</p>
    <h3>Others</h3>
    <p>Currently, I'm reviewing the concepts of thermodynamics and their applications. So I will update my new findings here.</p>
    </PostLayout>
  );
}
