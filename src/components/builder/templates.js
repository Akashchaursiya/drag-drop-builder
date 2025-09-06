import React from "react";

import { newElementInstance } from "./elements";


export const TEMPLATES = {
  "Blank": [],

  "Simple Landing": [
    newElementInstance("hero"),
    newElementInstance("heading"),
    newElementInstance("paragraph"),
    newElementInstance("button"),
  ],

  "Blog Header": [
    {
      ...newElementInstance("heading"),
      props: {
        text: "My Blog",
        size: "4xl",
        align: "center",
        color: "#0f172a",
        marginY: 8,
      },
    },
    {
      ...newElementInstance("divider"),
      props: {
        thickness: 2,
        color: "#e2e8f0",
        marginY: 12,
      },
    },
    {
      ...newElementInstance("paragraph"),
      props: {
        text: "Insights, tutorials, and stories.",
        align: "center",
        size: "lg",
        color: "#475569",
        width: 60,
        marginY: 8,
      },
    },
  ],
};
