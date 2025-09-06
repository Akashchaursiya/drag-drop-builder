import { PlusCircle } from "lucide-react";
import { ELEMENTS_REGISTRY } from "./elements";
import React from "react";



 function PaletteItem({ type }) {
  const meta = ELEMENTS_REGISTRY[type];
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/x-new-element", type);
      }}
      className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm hover:shadow cursor-grab active:cursor-grabbing"
    >
      <div>{meta.icon}</div>
      <div className="flex-1">
        <div className="text-sm font-medium">{meta.label}</div>
        <div className="text-xs text-slate-500">Drag onto canvas</div>
      </div>
      <PlusCircle className="w-4 h-4" />
    </div>
  );
}

export default PaletteItem;