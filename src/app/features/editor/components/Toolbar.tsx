import React from 'react';
import { useState } from 'react';
import { ActiveTool, Editor } from '../types';
import { Hint } from '@/components/crevo/Hint';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BsBorderWidth } from 'react-icons/bs';
import { ArrowDown, ArrowUp, ChevronDown, CopyIcon } from 'lucide-react';
import { GoTrash } from 'react-icons/go';
import { RxTransparencyGrid } from 'react-icons/rx';
import { isTextType, isImageType } from '../utils';
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
} from 'react-icons/fa';
import { TbBackground, TbColorFilter } from 'react-icons/tb';
import { FontSizeInput } from './FontSizeInput';
interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

const Toolbar = ({ editor, activeTool, onChangeActiveTool }: ToolbarProps) => {
  const initialFillColor = editor?.getActiveFillColor();
  const initialStrokeColor = editor?.getActiveStrokeColor();
  const initialFontFamily = editor?.getActiveFontFamily();
  const initialFontStyle = editor?.getActiveFontStyle();
  const initialFontLineThrough = editor?.getActiveFontLineThrough();
  const initialFontUnderline = editor?.getActiveFontUnderline();
  const initialTextAlign = editor?.getActiveTextAlign();

  const initialFontSize = editor?.getActiveFontSize() || 60;
  const initialFontWeight = editor?.getActiveFontWeight() || 400;

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontLineThrough: initialFontLineThrough,
    fontUnderline: initialFontUnderline,
    textAlign: initialTextAlign,
    fontSize: initialFontSize,
  });

  const selectedObject = editor?.selectedObjects[0];
  const selectedObjectType = selectedObject?.type;

  const isText = isTextType(selectedObjectType);
  const isImage = isImageType(selectedObjectType);

  const onChangeTextAlign = (value: string) => {
    if (!selectedObject) return;
    editor?.changeTextAlign(value);
    setProperties((current) => ({ ...current, textAlign: value }));
  };
  const onChangeFontSize = (value: number) => {
    if (!selectedObject) {
      return;
    }

    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  };

  const toggleBold = () => {
    if (!selectedObject) return;

    const newVal = properties.fontWeight > 500 ? 500 : 700;

    editor?.changeFontWeight(newVal);
    setProperties((current) => ({ ...current, fontWeight: newVal }));
  };
  const toggleItalic = () => {
    if (!selectedObject) return;

    const isItalic = properties.fontStyle === 'italic';
    const newVal = isItalic ? 'normal' : 'italic';

    editor?.changeFontStyle(newVal);
    setProperties((current) => ({ ...current, fontStyle: newVal }));
  };
  const toggleLinethrough = () => {
    if (!selectedObject) return;
    const newVal = properties.fontLineThrough ? false : true;

    editor?.changeFontLineThrough(newVal);
    setProperties((current) => ({ ...current, fontLineThrough: newVal }));
  };
  const toggleUnderline = () => {
    if (!selectedObject) return;
    const newVal = properties.fontUnderline ? false : true;

    editor?.changeFontUnderline(newVal);
    setProperties((current) => ({ ...current, fontUnderline: newVal }));
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto p-2 gap-x-2" />
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto p-2 gap-x-2">
      {!isImage && (
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
                  backgroundColor: `${properties.fillColor}`,
                }}
              />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Font" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onChangeActiveTool('font')}
              className={cn(
                'w-auto px-2 text-sm',
                activeTool === 'font' && 'bg-gray-100'
              )}
            >
              <div className="max-w-[100px] truncate">
                {properties.fontFamily}
              </div>
              <ChevronDown className="size-4 ml-2 shrink-0" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Bold" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(properties.fontWeight > 500 && 'bg-gray-100')}
              onClick={toggleBold}
            >
              <FaBold className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Italic" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(properties.fontStyle === 'italic' && 'bg-gray-100')}
              onClick={toggleItalic}
            >
              <FaItalic className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Strike" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                properties.fontLineThrough === true && 'bg-gray-100'
              )}
              onClick={toggleLinethrough}
            >
              <FaStrikethrough className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Underline" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(properties.fontUnderline === true && 'bg-gray-100')}
              onClick={toggleUnderline}
            >
              <FaUnderline className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align Left" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(properties.textAlign === 'left' && 'bg-gray-100')}
              onClick={() => {
                onChangeTextAlign('left');
              }}
            >
              <FaAlignLeft className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align Center" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(properties.textAlign === 'center' && 'bg-gray-100')}
              onClick={() => {
                onChangeTextAlign('center');
              }}
            >
              <FaAlignCenter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align Right" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(properties.textAlign === 'right' && 'bg-gray-100')}
              onClick={() => {
                onChangeTextAlign('right');
              }}
            >
              <FaAlignRight className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Align Justify" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                properties.textAlign === 'justify' && 'bg-gray-100'
              )}
              onClick={() => {
                onChangeTextAlign('justify');
              }}
            >
              <FaAlignJustify className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isText && (
        <div className="flex items-center h-full justify-center">
          <FontSizeInput
            value={properties.fontSize}
            onChange={onChangeFontSize}
          />
        </div>
      )}

      {!isText && (
        <>
          <div className="flex items-center h-full justify-center">
            <Hint label="Stroke color" side="bottom" sideOffset={5}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChangeActiveTool('stroke-color')}
                className={cn(activeTool === 'stroke-color' && 'bg-gray-100')}
              >
                <div
                  className="rounded-sm size-4 border-2 bg-white"
                  style={{
                    borderColor: `${properties.strokeColor}`,
                  }}
                />
              </Button>
            </Hint>
          </div>
          <div className="flex items-center h-full justify-center">
            <Hint label="Stroke width" side="bottom" sideOffset={5}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onChangeActiveTool('stroke-width')}
                className={cn(activeTool === 'stroke-width' && 'bg-gray-100')}
              >
                <BsBorderWidth className="size-4" />
              </Button>
            </Hint>
          </div>
        </>
      )}
      {isImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Add Filter" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(activeTool === 'filter' && 'bg-gray-100')}
              onClick={() => {
                onChangeActiveTool('filter');
              }}
            >
              <TbColorFilter className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      {isImage && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Remove Background" side="bottom" sideOffset={5}>
            <Button
              variant="ghost"
              size="icon"
              className={cn(activeTool === 'remove-bg' && 'bg-gray-100')}
              onClick={() => {
                onChangeActiveTool('remove-bg');
              }}
            >
              <TbBackground className="size-4" />
            </Button>
          </Hint>
        </div>
      )}
      <div className="flex items-center h-full justify-center">
        <Hint label="Bring to front" side="bottom" sideOffset={5}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.bringForward()}
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Send to back" side="bottom" sideOffset={5}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor?.sendBackward()}
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChangeActiveTool('opacity')}
            className={cn(activeTool === 'opacity' && 'bg-gray-100')}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button variant="ghost" size="icon" onClick={() => editor?.delete()}>
            <GoTrash className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              editor?.onCopy();
              editor?.onPaste();
            }}
          >
            <CopyIcon className="size-4" />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default Toolbar;
