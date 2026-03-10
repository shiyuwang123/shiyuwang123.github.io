import PostLayout from '@/components/PostLayout';
import CodeBlock from '@/components/CodeBlock';

export default function Post() {
  return (
    <PostLayout
      title="Intermediate Interface"
      date="2025-11-12 23:20:00 +0800"
      categories={['Diary']}
    >
      <p>When we use matplotlib to draw our plot, we just use some very simple functions.</p>
      <CodeBlock language="python" code={`plt.plot(x,y,"r-")\nplt.show()`} />
      <p>this manner seems like easy to use, but matplotlib users don't know what happens inside such functions, let alone graphic interfaces like WebGPU, Vulkan, Metal.</p>
      <p>However, when we use vtk for our plotting, we write more code.</p>
      <CodeBlock language="cpp" code={`vtkNew<vtkContextView> view;\nview->GetRenderWindow()->SetWindowName("LinePlot");\nview->GetRenderer()->SetBackground(colors->GetColor3d("SlateGray").GetData());\n  \nvtkNew<vtkChartXY> chart;\nview->GetScene()->AddItem(chart);\nvtkPlot* line = chart->AddPlot(vtkChart::LINE);\nline->SetInputData(table, 0, 1);\nline = chart->AddPlot(vtkChart::LINE);\nline->SetInputData(table, 0, 2);\nview->GetRenderWindow()->Render();\nview->GetInteractor()->Initialize();\nview->GetInteractor()->Start();`} />
      <p>this manner seems complicated, but it can let us know what actually happens when we draw a picture. When you do some 3D rendering, vtk will let you create your own rendering pipeline and you will know some shared procedures of every rendering works without necessarily write tedious shading language. Moreover, if you often need specific work, you can warp whe procedures into your own high-level interface without losing the access of intermediate-level interface like this:</p>
      <CodeBlock language="cpp" code={`class 2Dplotter {\npublic:\n    2Dplotter(vtkTable* table):table;\n    ~2Dplotter() = default;\n    \n    void SetLineColor(int R, int G, int B);\n    void SetBackColor(int R, int G, int B);\n    void SetTittle(std::string tittle);\n    void SetLineWidth(double w);\n    void show();\n\nprivate:\n    vtkContextView* view;\n    vtkChartXY* chart;\n    vtkTable* table;\n}`} />
      <p>Such manner can make you easily draw the plot like matplotlib while keep the control of each process only by moving the object from private to public.</p>
      <p>Comparatively, vtk provides user the intermediate interface of rendering, which keeps a lot of flexibility for users to tune each stage while matplotlib only provides high-level of plotting, which makes the inner stages hidden and fixed. So the API design of vtk is way better than matplotlib.</p>
      <p>This manner also can be used in other programs. For example, in a quantum chemistry program, we can expose the class of Molecule, SelfConsistField, DFT-D3, PolarizedContinuumModel etc to users and let them assemble the computational pipeline from their discretion and have the access to middle-stage data and integrate the inner stages with other libs to do data process, visualization etc.</p>
      <p>Consequently, in our own programs, we can learn from vtk to provide intermediate interface to achieve better functionality and user experience.</p>
    </PostLayout>
  );
}
