import React from "react";
import { ELEMENTS_REGISTRY, newElementInstance } from "./elements";
import { TEMPLATES } from "./templates";
import PaletteItem from "./PaletteItem";
import PropertiesPanel from "./PropertiesPanel";
import SortableItem from "./SortableItem";
import { useState, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import Toolbar from "./Toolbar";





export default function DragDropSiteBuilder() {
  const [items, setItems] = useState([]); 
  const [selectedId, setSelectedId] = useState(null);
  const [draggingFromPalette, setDraggingFromPalette] = useState(null);
  const [mode, setMode] = useState("desktop");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const selected = useMemo(() => items.find((i) => i.id === selectedId), [items, selectedId]);

  const addNewItem = (type, index) => {
    const inst = newElementInstance(type);
    setItems((prev) => {
      if (typeof index === "number") {
        const next = [...prev];
        next.splice(index, 0, inst);
        return next;
      }
      return [...prev, inst];
    });
    setSelectedId(inst.id);
  };

  const onDragStart = (event) => {
    const { active } = event;

  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

  
    const activeIndex = items.findIndex((i) => i.id === active?.id);
    const overIndex = items.findIndex((i) => i.id === over?.id);

    if (activeIndex !== -1 && overIndex !== -1 && active.id !== over.id) {
      setItems((prev) => arrayMove(prev, activeIndex, overIndex));
      return;
    }
  };

  const onCanvasDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("application/x-new-element");
    if (type && ELEMENTS_REGISTRY[type]) {
      addNewItem(type);
    }
    setDraggingFromPalette(null);
  };

  const onCanvasDragOver = (e) => {
    if (e.dataTransfer.types.includes("application/x-new-element")) {
      e.preventDefault();
      setDraggingFromPalette(true);
    }
  };

  const onCanvasDragLeave = () => setDraggingFromPalette(false);

  const handleUpdateSelected = (updated) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleTemplate = (name) => {
    const tpl = TEMPLATES[name] || [];

    const cloned = tpl.map((t) => ({ id: crypto.randomUUID(), type: t.type, props: { ...t.props } }));
    setItems(cloned);
    setSelectedId(cloned[0]?.id ?? null);
  };

  const handleExport = () => {
    const doc = { version: 1, items };
    const json = JSON.stringify(doc, null, 2);
    navigator.clipboard.writeText(json).catch(() => {});
    alert("JSON copied to clipboard. You can paste it anywhere.");
  };

  const handleImport = () => {
    const json = prompt("Paste JSON here:");
    if (!json) return;
    try {
      const doc = JSON.parse(json);
      if (!Array.isArray(doc.items)) throw new Error("Invalid doc");
  
      const restored = doc.items.map((i) => ({ id: crypto.randomUUID(), type: i.type, props: i.props }));
      setItems(restored);
      setSelectedId(restored[0]?.id ?? null);
    } catch (e) {
      alert("Import failed: " + e.message);
    }
  };

  const isMobile = mode === "mobile";

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900">
      <Toolbar
        mode={mode}
        setMode={setMode}
        onTemplate={handleTemplate}
        onExportJSON={handleExport}
        onImportJSON={handleImport}
        onClear={() => setItems([])}
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 h-[calc(100vh-64px)]">
  
        <aside className="md:col-span-3 space-y-3 overflow-y-auto">
          <div className="sticky top-0 z-10 mb-2 rounded-2xl border bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold"><PlusCircle className="w-4 h-4" /> Elements</div>
          </div>
          {Object.keys(ELEMENTS_REGISTRY).map((type) => (
            <PaletteItem key={type} type={type} />
          ))}
          <div className="h-8" />
        </aside>

     
        <main className="md:col-span-6">
          <div className="mx-auto flex items-start justify-center">
            <div className={`${isMobile ? "w-[390px]" : "w-full"} transition-all`}>
              <div className={`${isMobile ? "mx-auto" : ""} rounded-[32px] border bg-white p-4 shadow-lg min-h-[60vh]`}
                   onDrop={onCanvasDrop}
                   onDragOver={onCanvasDragOver}
                   onDragLeave={onCanvasDragLeave}
              >
                <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                  <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {items.length === 0 && (
                        <div className={`rounded-2xl border-2 border-dashed ${draggingFromPalette ? "border-black bg-slate-50" : "border-slate-300"} p-10 text-center text-slate-500`}>
                          Drag elements from the left and drop here
                        </div>
                      )}
                      {items.map((item) => (
                        <SortableItem key={item.id} id={item.id} selected={selectedId === item.id} onClick={() => setSelectedId(item.id)}>
                          {ELEMENTS_REGISTRY[item.type]?.render(item.props)}
                          <div className="mt-2 flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-50"
                              onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}
                            >Edit</button>
                            <button
                              className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-50"
                              onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            >Delete</button>
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay />
                </DndContext>
              </div>
            </div>
          </div>
        </main>

   
        <aside className="md:col-span-3 overflow-y-auto rounded-2xl border bg-white shadow-sm">
          <PropertiesPanel selected={selected} onChange={handleUpdateSelected} onDelete={handleDelete} />
        </aside>
      </div>


      <div className="pointer-events-none fixed bottom-3 left-1/2 z-20 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pointer-events-auto rounded-full bg-black/90 px-4 py-2 text-xs text-white shadow-xl"
        >
          Tip: Double down on speed — drag from the palette, then fine‑tune on the right.
        </motion.div>
      </div>
    </div>
  );
}
  