import { TYPE_COLORS, TYPE_LABELS } from "@/utils/pokemon.utils";

type TypeBadgeProps = {
  type: string;
};

const TypeBadge = ({ type }: TypeBadgeProps) => {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${TYPE_COLORS[type] ?? "bg-gray-500"}`}
    >
      {TYPE_LABELS[type] ?? type}
    </span>
  );
};

export default TypeBadge;
