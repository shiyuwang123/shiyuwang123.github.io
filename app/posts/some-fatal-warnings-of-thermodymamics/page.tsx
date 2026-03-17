import PostLayout from '@/components/PostLayout';
import Math from '@/components/Math';

export default function Post() {
  return (
    <PostLayout
      title="Some Fatal Warnings of Thermodynamics"
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
      <p>leave them to tomorrow.</p>
    </PostLayout>
  );
}
