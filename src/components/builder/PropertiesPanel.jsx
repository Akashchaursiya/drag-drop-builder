import React from "react";

import { Trash2, Settings } from "lucide-react";
import { ELEMENTS_REGISTRY } from "./elements"; 


 function PropertiesPanel({ selected, onChange, onDelete }) {
  if (!selected) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <div className="text-center">
          <Settings className="w-6 h-6 mx-auto mb-2" />
          <p>Select an element to edit its properties</p>
        </div>
      </div>
    );
  }
  const schema = ELEMENTS_REGISTRY[selected.type]?.form || [];

  const handleField = (name, value) => {
    onChange({ ...selected, props: { ...selected.props, [name]: value } });
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Properties</h3>
        <button onClick={() => onDelete(selected.id)} className="inline-flex items-center gap-2 text-red-600 hover:underline">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {schema.map((field) => (
        <div key={field.name} className="space-y-1">
          <label className="block text-sm text-slate-600">{field.label}</label>
          {field.type === "text" && (
            <input
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={selected.props[field.name] ?? ""}
              onChange={(e) => handleField(field.name, e.target.value)}
            />
          )}
          {field.type === "textarea" && (
            <textarea
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              rows={4}
              value={selected.props[field.name] ?? ""}
              onChange={(e) => handleField(field.name, e.target.value)}
            />
          )}
          {field.type === "number" && (
            <input
              type="number"
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={selected.props[field.name] ?? 0}
              onChange={(e) => handleField(field.name, Number(e.target.value))}
            />
          )}
          {field.type === "select" && (
            <select
              className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              value={selected.props[field.name]}
              onChange={(e) => handleField(field.name, e.target.value)}
            >
              {field.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
          {field.type === "color" && (
            <input
              type="color"
              className="h-10 w-full rounded-xl border px-2 py-1"
              value={selected.props[field.name]}
              onChange={(e) => handleField(field.name, e.target.value)}
            />
          )}
          {field.type === "checkbox" && (
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={!!selected.props[field.name]}
              onChange={(e) => handleField(field.name, e.target.checked)}
            />
          )}
        </div>
      ))}

      <div className="pt-2 text-xs text-slate-500">ID: {selected.id}</div>
    </div>
  );
}




export default PropertiesPanel;