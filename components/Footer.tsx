import Link from 'next/link';

const footerData = {
  rights: 'Axiom Wang. All rights reserved.',
  linksTitle: 'Friendly Links',
  orgs: 'Scholar Organizations',
  tools: 'Software & Tools',
  links: {
    orgs: [
      { name: 'Association for the Philosophy of Mathematical Practice', url: 'https://www.philmathpractice.org/' },
      { name: 'International Mathematical Union', url: 'https://www.mathunion.org/' },
      { name: 'American Mathematical Society', url: 'https://www.ams.org/' },
      { name: 'European Mathematical Society', url: 'https://euromathsoc.org/' },
      { name: 'Center for the Fundamental Laws of Nature', url: 'https://hetg.physics.harvard.edu' },
      { name: 'American Physical Society', url: 'https://www.aps.org/' },
      { name: 'European Physical Society', url: 'https://www.eps.org/' },
      { name: 'IAQMS', url: 'http://www.iaqms.org/' },
      { name: 'WATOC', url: 'https://watoc.net/' },
      { name: 'IUPAC', url: 'https://iupac.org/' },
      { name: 'American Chemical Society', url: 'https://www.acs.org/' },
      { name: 'Chinese Chemical Society', url: 'https://www.chemsoc.org.cn/' },
      { name: 'Chemical Society of Japan', url: 'https://www.csj.jp/' },
      { name: 'Royal Society of Chemistry', url: 'https://www.rsc.org/' }
    ],
    tools: [
      {
        category: 'Computational Chemistry',
        items: [
          { name: 'BDF', url: 'http://182.92.74.236:8080/' },
          { name: 'Qbics', url: 'https://qbics.info/' },
          { name: 'Psi4', url: 'https://psicode.org/' },
          { name: 'CP2K', url: 'https://www.cp2k.org/' },
          { name: 'GROMACS', url: 'https://www.gromacs.org/' },
          { name: 'LAMMPS', url: 'https://www.lammps.org/' },
          { name: 'RDKit', url: 'https://www.rdkit.org/' }
        ]
      },
      {
        category: 'Frameworks & Libraries',
        items: [
          { name: 'libomp', url: 'https://www.openmp.org/' },
          { name: 'libtorch', url: 'https://pytorch.org/' },
          { name: 'HDF5', url: 'https://www.hdfgroup.org/solutions/hdf5/' },
          { name: 'Boost', url: 'https://www.boost.org/' },
          { name: 'OpenBLAS', url: 'https://www.openblas.net/' },
          { name: 'Qt', url: 'https://www.qt.io/' },
          { name: 'VTK', url: 'https://vtk.org/' },
          { name: 'FFmpeg', url: 'https://ffmpeg.org/' },
          { name: 'Next.js', url: 'https://nextjs.org/' },
          { name: 'Protobuf', url: 'https://protobuf.dev/' }
        ]
      },
      {
        category: 'Build & Version Control',
        items: [
          { name: 'CMake', url: 'https://cmake.org/' },
          { name: 'Ninja', url: 'https://ninja-build.org/' },
          { name: 'Bazel', url: 'https://bazel.build/' },
          { name: 'Git', url: 'https://git-scm.com/' },
          { name: 'GitHub', url: 'https://github.com/' },
          { name: 'GitLab', url: 'https://about.gitlab.com/' }
        ]
      },
      {
        category: 'Programming Languages & Systems',
        items: [
          { name: 'C++', url: 'https://isocpp.org/' },
          { name: 'Python', url: 'https://www.python.org/' },
          { name: 'TypeScript', url: 'https://www.typescriptlang.org/' },
          { name: 'Linux', url: 'https://www.kernel.org/' },
          { name: 'LLVM', url: 'https://llvm.org/' },
          { name: 'RISC-V', url: 'https://riscv.org/' }
        ]
      },
      {
        category: 'Development Tools',
        items: [
          { name: 'VS Code', url: 'https://code.visualstudio.com/' },
          { name: 'Neovim', url: 'https://neovim.io/' },
          { name: 'Pixi', url: 'https://pixi.sh/' },
          { name: 'Bun', url: 'https://bun.sh/' },
          { name: 'LaTeX', url: 'https://www.latex-project.org/' },
          { name: 'Sphinx', url: 'https://www.sphinx-doc.org/' }
        ]
      },
      {
        category: 'Resources & Organizations',
        items: [
          { name: 'Kitware', url: 'https://www.kitware.com/' },
          { name: 'Z-Library', url: 'https://z-lib.su/' },
          { name: 'Wikipedia', url: 'https://www.wikipedia.org/' },
          { name: 'W3C', url: 'https://www.w3.org/' },
          { name: 'Khronos Group', url: 'https://www.khronos.org/' }
        ]
      },
      {
        category: 'AI Models & Platforms',
        items: [
          { name: 'OpenAI', url: 'https://openai.com/' },
          { name: 'Gemini', url: 'https://aistudio.google.com/' },
          { name: 'DeepSeek', url: 'https://www.deepseek.com/' },
          { name: 'Qwen', url: 'https://qwenlm.github.io/' }
        ]
      }
    ]
  }
};

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/50 py-12 mt-12 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-8 text-center">{footerData.linksTitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">{footerData.orgs}</h3>
              <ul className="space-y-2">
                {footerData.links.orgs.map((org) => (
                  <li key={org.name}>
                    <a href={org.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {org.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {footerData.links.tools.map((toolCategory) => (
              <div key={toolCategory.category} className="space-y-4">
                <h3 className="font-medium text-foreground">{toolCategory.category}</h3>
                <ul className="space-y-2">
                  {toolCategory.items.map((item) => (
                    <li key={item.name}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {footerData.rights}</p>
          <p className="mt-2">Built with Next.js, TypeScript, and TailwindCSS.</p>
        </div>
      </div>
    </footer>
  );
}

