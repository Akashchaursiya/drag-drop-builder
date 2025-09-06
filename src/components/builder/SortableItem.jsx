import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


 function SortableItem({ id, children, selected, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative group rounded-xl border ${selected ? "border-black" : "border-transparent"} hover:border-slate-300 bg-white shadow-sm p-4`}
      onClick={onClick}
    >
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="cursor-grab active:cursor-grabbing rounded-md border bg-white px-2 py-1 text-xs shadow">Drag</div>
      </div>
      {isDragging && (
        <div className="absolute inset-0 rounded-xl border-2 border-dashed border-black" />
      )}
      {children}
    </div>
  );
}

export default SortableItem;