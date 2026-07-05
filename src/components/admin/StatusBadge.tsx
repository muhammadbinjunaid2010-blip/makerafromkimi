interface StatusBadgeProps {
  status: string;
  /** Optional variant map for custom status sets */
  variants?: Record<string, { label: string; className: string }>;
}

const defaultVariants: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
  changes_requested: { label: "Changes", className: "bg-purple-100 text-purple-700" },
  reviewed: { label: "Reviewed", className: "bg-blue-100 text-blue-700" },
  dismissed: { label: "Dismissed", className: "bg-slate-100 text-slate-600" },
  actioned: { label: "Actioned", className: "bg-red-100 text-red-700" },
  active: { label: "Active", className: "bg-green-100 text-green-700" },
  inactive: { label: "Inactive", className: "bg-slate-100 text-slate-600" },
  processed: { label: "Processed", className: "bg-blue-100 text-blue-700" },
};

export function StatusBadge({ status, variants }: StatusBadgeProps) {
  const map = variants || defaultVariants;
  const v = map[status] || { label: status, className: "bg-slate-100 text-slate-600" };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${v.className}`}>
      {v.label}
    </span>
  );
}
