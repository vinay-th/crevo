import React from 'react';
import { useState } from 'react';
import { ActiveTool, Editor } from '../types';
import { Hint } from '@/components/crevo/Hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const Toolbar = ({ editor, activeTool, onChangeActiveTool }: ToolbarProps) => {
  const fillColor = editor?.fillColor;

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto p-2 gap-x-2">
      <div className="flex items-center h-full justify-center">
        <Hint label="Color" side="bottom" sideOffset={5}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangeActiveTool('fill')}
            className={cn(activeTool === 'fill' && 'bg-gray-100')}
          >
            <div
              className="rounded-sm size-4 border"
              style={{
                backgroundColor: fillColor,
              }}
            />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default Toolbar;
