"use client";

import { Pencil, Plus } from "lucide-react";

export default function ProfileSection({
  id,
  title,
  icon: Icon,
  children,
  onAdd,
  onEdit,
  addLabel = "Add",
  isEmpty = false,
  emptyMessage = "No data added yet",
}) {
  return (
    <section
      id={id}
      className="bg-white rounded-2xl shadow-sm overflow-hidden scroll-mt-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-red-50 rounded-lg">
              <Icon className="w-5 h-5 text-red-500" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {addLabel}
            </button>
          )}
          {onEdit && !onAdd && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isEmpty ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{emptyMessage}</p>
            {onAdd && (
              <button
                onClick={onAdd}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {addLabel}
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
