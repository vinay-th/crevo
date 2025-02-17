'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor } from '@/app/features/editor/hooks/use-editor';
import { fabric } from 'fabric';
import debounce from 'lodash/debounce';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import Footer from './Footer';
import { ActiveTool, selectionDependentTools } from '../types';
import ShapeSidebar from './ShapeSidebar';
import FillColorSidebar from './FillColorSidebar';
import TemplateSidebar from './TemplateSidebar';
import StrokeColorSidebar from './StrokeColorSidebar';
import StrokeWidthSidebar from './StrokeWidthSidebar';
import OpacitySidebar from './OpacitySidebar';
import TextSidebar from './TextSidebar';
import { FontSidebar } from './FontSidebar';
import { ImageSidebar } from './ImageSidebar';
import FilterSidebar from './FilterSidebar';
import AiSidebar from './AiSidebar';
import AiBgRemoveSidebar from './AiBgRemoveSidebar';
import DrawSidebar from './DrawSidebar';
import SettingsSidebar from './SettingsSidebar';
import { ResponseType } from '../../projects/api/use-get-project';
import { useUpdateProjects } from '../../projects/api/use-update-projects';

interface EditorProps {
  initialData: ResponseType['data'];
}

const Editor = ({ initialData }: EditorProps) => {
  const { mutate } = useUpdateProjects(initialData.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce((values: { json: string; height: number; width: number }) => {
      mutate(values);
    }, 1500),
    [mutate]
  );

  const [activeTool, setActiveTool] = useState<ActiveTool>('select');
  const [isClient, setIsClient] = useState(false);

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool('select');
    }
  }, [activeTool]);

  const { inti, editor } = useEditor({
    defaultState: initialData.json,
    defaultWidth: initialData.width,
    defaultHeight: initialData.height,
    clearSelectionCallback: onClearSelection,
    saveCallback: debouncedSave,
  });

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === 'draw') {
        editor?.enableDrawingMode();
      }

      if (activeTool === 'draw') {
        editor?.disableDrawingMode();
      }
      if (tool === activeTool) return setActiveTool('select');

      setActiveTool(tool);
    },
    [activeTool, editor]
  );

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = new fabric.Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    inti({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [inti, isClient]);

  if (!isClient) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[64px] border-b bg-white" />
        <div className="absolute h-[calc(100vh-68px)] w-full top-[64px] flex">
          <div className="bg-white w-[100px] h-full border-r" />
          <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
            <div className="h-[56px] border-b bg-white" />
            <div className="h-[calc(100%-124px)] flex-1 bg-muted" />
            <div className="h-[56px] border-t bg-white" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Navbar
        id={initialData.id}
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100vh-68px)] w-full top-[64px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <OpacitySidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <TextSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FontSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FilterSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <AiBgRemoveSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <AiSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <DrawSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <SettingsSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <TemplateSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas?.getActiveObjects())}
          />
          <div
            className="h-[calc(100%-124px)] flex-1 bg-muted"
            ref={containerRef}
          >
            <canvas className="my-canvas" ref={canvasRef} />
          </div>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  );
};

export default Editor;
