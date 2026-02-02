"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
        "--border-radius": "var(--radius)",
        "--success-bg": "#dc2626",
        "--success-border": "#b91c1c",
        "--success-text": "#ffffff",
        "--info-bg": "#dc2626",
        "--info-border": "#b91c1c",
        "--info-text": "#ffffff",
        "--warning-bg": "#ea580c",
        "--warning-border": "#c2410c",
        "--warning-text": "#ffffff",
        "--error-bg": "#991b1b",
        "--error-border": "#7f1d1d",
        "--error-text": "#fecaca",
      }}
      {...props}
    />
  );
};

export { Toaster };
