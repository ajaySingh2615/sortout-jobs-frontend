"use client";

import { useState, useEffect } from "react";
import {
  FolderKanban,
  Pencil,
  Trash2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import ProfileSection from "./ProfileSection";
import ProjectModal from "./modals/ProjectModal";
import profileService from "@/services/profile.service";
import { toast } from "sonner";

export default function ProjectSection({
  userId,
  projects: initialProjects,
  onUpdate,
}) {
  const [projects, setProjects] = useState(initialProjects || []);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    setProjects(initialProjects || []);
  }, [initialProjects]);

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await profileService.deleteProject(userId, id);
      toast.success("Project deleted successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingItem) {
        await profileService.updateProject(userId, editingItem.id, data);
        toast.success("Project updated successfully");
      } else {
        await profileService.addProject(userId, data);
        toast.success("Project added successfully");
      }
      setShowModal(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "FINISHED":
        return "bg-green-50 text-green-700";
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <>
      <ProfileSection
        id="projects"
        title="Projects"
        icon={FolderKanban}
        onAdd={handleAdd}
        addLabel="Add Project"
        isEmpty={projects.length === 0}
        emptyMessage="Showcase your projects to demonstrate your skills"
      >
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">
                      {project.title}
                    </h4>
                    {project.status && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status === "IN_PROGRESS"
                          ? "In Progress"
                          : "Finished"}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{project.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {project.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(project.startDate)} -{" "}
                        {project.isOngoing
                          ? "Ongoing"
                          : formatDate(project.endDate)}
                      </span>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Project
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ProfileSection>

      {showModal && (
        <ProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          initialData={editingItem}
        />
      )}
    </>
  );
}
