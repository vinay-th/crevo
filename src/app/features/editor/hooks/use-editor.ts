import { useCallback, useState, useMemo } from 'react';
import { fabric } from 'fabric';
import {
  BuildEditorProps,
  CIRCLE_OPT,
  Editor,
  SOFT_RECT_OPT,
  RECT_OPT,
  TRIANGLE_OPT,
  DIAMOND_OPT,
} from '../types';

import { useAutoResize } from './use-auto-resize';
import { useCanvasEvents } from './use-canvas-events';

const buildEditor = ({ canvas }: BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return (
      canvas?.getObjects().find((object) => object.name === 'clip') || null
    );
  };

  const center = (object: fabric.Object) => {
    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) return;

    // @ts-expect-error meri marzi bhai
    canvas?._centerObject(object, center);
  };

  const addToCanvas = (object: fabric.Object) => {
    center(object);
    canvas?.add(object);
    canvas?.setActiveObject(object);
  };

  return {
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPT,
      });
      addToCanvas(object);
    },
    addSoftRect: () => {
      const object = new fabric.Rect({
        ...SOFT_RECT_OPT,
        rx: 30,
        ry: 30,
      });
      addToCanvas(object);
    },
    addRect: () => {
      const object = new fabric.Rect({
        ...RECT_OPT,
      });
      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPT,
      });
      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const HEIGHT = 400;
      const WIDTH = 400;
      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPT,
        }
      );
      addToCanvas(object);
    },
    addDiamond: () => {
      const HEIGHT = DIAMOND_OPT.height;
      const WIDTH = DIAMOND_OPT.width;
      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPT,
        }
      );
      addToCanvas(object);
    },
  };
};

export const useEditor = () => {
  const [canvas, setCanvas] = useState<null | fabric.Canvas>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [_selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    container,
    setSelectedObjects,
  });

  const editor = useMemo(() => {
    if (canvas) {
      return buildEditor({ canvas });
    }
  }, [canvas]);

  const inti = useCallback(
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      fabric.Object.prototype.set({
        cornerColor: '#fff',
        cornerStyle: 'circle',
        borderColor: '#3b82f6',
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: '#3b82f6',
      });

      const initialWorkspace = new fabric.Rect({
        width: 900,
        height: 1200,
        name: 'clip',
        hasControls: false,
        selectable: false,
        fill: 'white',
        shadow: new fabric.Shadow({
          color: 'rgba(0, 0, 0, 0.8)',
          blur: 5,
        }),
      });

      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);
    },
    []
  );

  return { inti, editor };
};
