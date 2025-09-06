  import React from "react";

  import { FileJson, Layout, MonitorSmartphone, Smartphone, Trash2, Upload } from "lucide-react";
  import { TEMPLATES } from "../builder/templates";

  function Toolbar({ mode, setMode, onTemplate, onExportJSON, onImportJSON, onClear }) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-white p-3">
        <div className="flex items-center gap-2">
          <MonitorSmartphone className="w-5 h-5" />
          <span className="font-semibold">Builder Prototype</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            onChange={(e) => onTemplate(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm"
            defaultValue="Blank"
          >
            {Object.keys(TEMPLATES).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <button onClick={onExportJSON} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
            <FileJson className="w-4 h-4" />
            Export JSON
          </button>
          <button onClick={onImportJSON} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
            <Upload className="w-4 h-4" />
            Import JSON
          </button>
          <button onClick={onClear} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50">
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <div className="mx-2 w-px self-stretch bg-slate-200" />
          <button
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${mode === "desktop" ? "bg-black text-white" : "hover:bg-slate-50"}`}
            onClick={() => setMode("desktop")}
          >
            <Layout className="w-4 h-4" /> Desktop
          </button>
          <button
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${mode === "mobile" ? "bg-black text-white" : "hover:bg-slate-50"}`}
            onClick={() => setMode("mobile")}
          >
            <Smartphone className="w-4 h-4" /> Mobile
          </button>
        </div>
      </div>
    );
  }
  export default Toolbar;