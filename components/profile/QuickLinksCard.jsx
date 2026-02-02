"use client";

import {
  FileText,
  Type,
  Star,
  Briefcase,
  GraduationCap,
  Code2,
  FolderKanban,
  AlignLeft,
  User,
} from "lucide-react";

const quickLinks = [
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    id: "headline",
    label: "Headline",
    icon: Type,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    id: "key-skills",
    label: "Key Skills",
    icon: Star,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    id: "employment",
    label: "Employment",
    icon: Briefcase,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    id: "it-skills",
    label: "IT Skills",
    icon: Code2,
    color: "text-cyan-500",
    bg: "bg-cyan-50",
  },
  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    id: "summary",
    label: "Summary",
    icon: AlignLeft,
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    id: "personal-details",
    label: "Personal Details",
    icon: User,
    color: "text-gray-500",
    bg: "bg-gray-100",
  },
];

export default function QuickLinksCard({ onNavigate }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
      <div className="grid grid-cols-3 gap-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div
                className={`p-3 rounded-xl ${link.bg} group-hover:scale-110 transition-transform`}
              >
                <Icon className={`w-5 h-5 ${link.color}`} />
              </div>
              <span className="text-xs text-gray-600 text-center font-medium">
                {link.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
