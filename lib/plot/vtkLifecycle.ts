import vtkGenericRenderWindow from '@kitware/vtk.js/Rendering/Misc/GenericRenderWindow';
import type vtkRenderWindow from '@kitware/vtk.js/Rendering/Core/RenderWindow';
import type vtkRenderWindowInteractor from '@kitware/vtk.js/Rendering/Core/RenderWindowInteractor';
import type vtkRenderer from '@kitware/vtk.js/Rendering/Core/Renderer';

export interface VtkScene {
  genericRenderWindow: ReturnType<typeof vtkGenericRenderWindow.newInstance>;
  renderer: vtkRenderer;
  renderWindow: vtkRenderWindow;
  interactor: vtkRenderWindowInteractor;
}

export function createVtkScene(
  container: HTMLElement,
  background: [number, number, number],
): VtkScene {
  const genericRenderWindow = vtkGenericRenderWindow.newInstance({
    background,
    listenWindowResize: false,
  });

  genericRenderWindow.setContainer(container);
  genericRenderWindow.resize();

  return {
    genericRenderWindow,
    renderer: genericRenderWindow.getRenderer(),
    renderWindow: genericRenderWindow.getRenderWindow(),
    interactor: genericRenderWindow.getInteractor(),
  };
}

export function disposeVtkScene(scene: VtkScene | null): void {
  if (!scene) {
    return;
  }
  scene.genericRenderWindow.delete();
}
