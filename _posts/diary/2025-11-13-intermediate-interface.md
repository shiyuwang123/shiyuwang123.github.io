---
title: "Intermediate Interface"
date: 2025-11-12 23:20:00 +0800
categories: [Diary]
math: true
---

When we use matplotlib to draw our plot, we just use some very simple functions.
```python
plt.plot(x,y,"r-")
plt.show()
```
this manor seems like easy to use, but matplotlib users don't know what happens inside such functions, let alone graphic interfaces like WebGPU, Vulkan, Metal. 

However, when we use vtk for our plotting, we write more code.
```cpp
vtkNew<vtkContextView> view;
view->GetRenderWindow()->SetWindowName("LinePlot");
view->GetRenderer()->SetBackground(colors->GetColor3d("SlateGray").GetData());
  
vtkNew<vtkChartXY> chart;
view->GetScene()->AddItem(chart);
vtkPlot* line = chart->AddPlot(vtkChart::LINE);
line->SetInputData(table, 0, 1);
line = chart->AddPlot(vtkChart::LINE);
line->SetInputData(table, 0, 2);
view->GetRenderWindow()->Render();
view->GetInteractor()->Initialize();
view->GetInteractor()->Start();
```

this manor seems complicated, but it can let us know what actually happens when we draw a picture. When you do some 3D rendering, vtk will let you create your own rendering pipeline and you will know some shared procedures of every rendering works without necessarily write tedious shading language. Moreover, if you often need specific work, you can warp whe procedures into your own high-level interface without losing the access of intermediate-level interface like this:

```cpp
class 2Dplotter {
public:
    2Dplotter(vtkTable* table):table;
    ~2Dplotter() = default;
    
    void SetLineColor(int R, int G, int B);
    void SetBackColor(int R, int G, int B);
    void SetTittle(std::string tittle);
    void SetLineWidth(double w);
    void show();

private:
    vtkContextView* view;
    vtkChartXY* chart;
    vtkTable* table;
}
```
Such manor can make you easily draw the plot like matplotlib while keep the control of each process only by moving the object from private to public.

Comparatively, vtk provides user the intermediate interface of rendering, which keeps a lot of flexibility for users to tune each stage while matplotlib only provides high-level of plotting, which makes the inner stages hidden and fixed. So the API design of vtk is way better than matplotlib. 

This manor also can be used in other programs. For example, in a quantum chemistry program, we can expose the class of Molecule, SelfConsistField, DFT-D3, PolarizedContinuumModel etc to users and let them assemble the computational pipeline from their discretion and have the access to middle-stage data and integrate the inner stages with other libs to do data process, visualization etc.

Consequently, in our own programs, we can learn vtk to provide intermediate interface to achieve better functionality and user experience.