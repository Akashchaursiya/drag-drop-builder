
import { Layout } from "lucide-react"; 
import { FaHeading, FaParagraph, FaRegSquare } from "react-icons/fa";
import React, { useCallback, useMemo, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  PlusCircle,

  Smartphone,
  MonitorSmartphone,
  Save,
  Download,
  Upload,
  Trash2,
  Settings,
  Copy,
  FileJson,
} from "lucide-react";



const ELEMENTS_REGISTRY = {
  heading: {
    label: "Heading",
    icon: <h1 className="font-bold text-xl">H</h1>,
    defaults: { text: "Your catchy headline", align: "left", size: "3xl", color: "#111827", marginY: 16 },
    render: (props) => {
      const sizeMap = { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl", "2xl": "text-2xl", "3xl": "text-3xl", "4xl": "text-4xl" };
      return (
        <h2
          className={`${sizeMap[props.size] || "text-3xl"} font-bold`}
          style={{ color: props.color, textAlign: props.align, marginTop: props.marginY, marginBottom: props.marginY }}
        >
          {props.text}
        </h2>
      );
    },
    form: [
      { name: "text", label: "Text", type: "text" },
      { name: "size", label: "Size", type: "select", options: ["xs","sm","base","lg","xl","2xl","3xl","4xl"] },
      { name: "align", label: "Align", type: "select", options: ["left","center","right"] },
      { name: "color", label: "Color", type: "color" },
      { name: "marginY", label: "Margin Y (px)", type: "number" },
    ],
  },
  paragraph: {
    label: "Paragraph",
    icon: <p className="text-sm">P</p>,
    defaults: { text: "Tell your story here. Crisp, clear, and human.", align: "left", size: "base", color: "#374151", width: 100, marginY: 8 },
    render: (props) => {
      const sizeMap = { xs: "text-xs", sm: "text-sm", base: "text-base", lg: "text-lg" };
      return (
        <p
          className={`${sizeMap[props.size] || "text-base"}`}
          style={{ color: props.color, textAlign: props.align, marginTop: props.marginY, marginBottom: props.marginY, maxWidth: `${props.width}%` }}
        >
          {props.text}
        </p>
      );
    },
    form: [
      { name: "text", label: "Text", type: "textarea" },
      { name: "size", label: "Size", type: "select", options: ["xs","sm","base","lg"] },
      { name: "align", label: "Align", type: "select", options: ["left","center","right"] },
      { name: "color", label: "Color", type: "color" },
      { name: "width", label: "Max Width (%)", type: "number" },
      { name: "marginY", label: "Margin Y (px)", type: "number" },
    ],
  },
  button: {
    label: "Button",
    icon: <button className="px-2 py-0.5 text-xs rounded border">Btn</button>,
    defaults: { text: "Click me", url: "#", align: "left", bg: "#111827", color: "#ffffff", radius: 12, paddingX: 16, paddingY: 10 },
    render: (props) => (
      <div className={`w-full flex ${props.align === "center" ? "justify-center" : props.align === "right" ? "justify-end" : "justify-start"}`}>
        <a
          href={props.url}
          className="inline-block font-medium"
          style={{
            backgroundColor: props.bg,
            color: props.color,
            borderRadius: props.radius,
            paddingLeft: props.paddingX,
            paddingRight: props.paddingX,
            paddingTop: props.paddingY,
            paddingBottom: props.paddingY,
          }}
          onClick={(e) => e.preventDefault()}
        >
          {props.text}
        </a>
      </div>
    ),
    form: [
      { name: "text", label: "Label", type: "text" },
      { name: "url", label: "Link", type: "text" },
      { name: "align", label: "Align", type: "select", options: ["left","center","right"] },
      { name: "bg", label: "Background", type: "color" },
      { name: "color", label: "Text Color", type: "color" },
      { name: "radius", label: "Radius (px)", type: "number" },
      { name: "paddingX", label: "Padding X (px)", type: "number" },
      { name: "paddingY", label: "Padding Y (px)", type: "number" },
    ],
  },
  image: {
    label: "Image",
    icon: <div className="w-6 h-4 bg-gradient-to-br from-slate-300 to-slate-400 rounded" />,
    defaults: { src: "https://picsum.photos/800/400", alt: "Placeholder", width: 100, radius: 12, shadow: true, marginY: 12 },
    render: (props) => (
      <img
        src={props.src}
        alt={props.alt}
        className={`${props.shadow ? "shadow" : ""}`}
        style={{ width: `${props.width}%`, borderRadius: props.radius, marginTop: props.marginY, marginBottom: props.marginY }}
      />
    ),
    form: [
      { name: "src", label: "Image URL", type: "text" },
      { name: "alt", label: "Alt Text", type: "text" },
      { name: "width", label: "Width (%)", type: "number" },
      { name: "radius", label: "Radius (px)", type: "number" },
      { name: "shadow", label: "Shadow", type: "checkbox" },
      { name: "marginY", label: "Margin Y (px)", type: "number" },
    ],
  },
  divider: {
    label: "Divider",
    icon: <div className="w-6 h-0.5 bg-slate-400 rounded" />,
    defaults: { thickness: 2, color: "#E5E7EB", marginY: 16 },
    render: (props) => (
      <hr style={{ height: props.thickness, backgroundColor: props.color, border: 0, marginTop: props.marginY, marginBottom: props.marginY }} />
    ),
    form: [
      { name: "thickness", label: "Thickness (px)", type: "number" },
      { name: "color", label: "Color", type: "color" },
      { name: "marginY", label: "Margin Y (px)", type: "number" },
    ],
  },
  spacer: {
    label: "Spacer",
    icon: <div className="w-6 h-2 bg-slate-200 rounded" />,
    defaults: { height: 24 },
    render: (props) => <div style={{ height: props.height }} />,
    form: [
      { name: "height", label: "Height (px)", type: "number" },
    ],
  },
  hero: {
    label: "Hero Section",
    icon: <Layout className="w-5 h-5" />,
    defaults: { bg: "#F9FAFB", paddingY: 40, title: "Welcome to Websites.co.in", subtitle: "Launch your site in minutes.", buttonText: "Get Started" },
    render: (props) => (
      <section
        className="rounded-2xl"
        style={{ backgroundColor: props.bg, paddingTop: props.paddingY, paddingBottom: props.paddingY }}
      >
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-2">{props.title}</h2>
          <p className="text-slate-600 mb-4">{props.subtitle}</p>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="inline-block px-5 py-3 rounded-xl font-medium bg-black text-white"
          >
            {props.buttonText}
          </a>
        </div>
      </section>
    ),
    form: [
      { name: "bg", label: "Background", type: "color" },
      { name: "paddingY", label: "Padding Y (px)", type: "number" },
      { name: "title", label: "Title", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "buttonText", label: "Button Text", type: "text" },
    ],
  },
};
export { ELEMENTS_REGISTRY };


export function newElementInstance(type) {
  return {
    id: crypto.randomUUID(),
    type,
    props: { ...(ELEMENTS_REGISTRY[type]?.defaults || {}) },
  };
}
