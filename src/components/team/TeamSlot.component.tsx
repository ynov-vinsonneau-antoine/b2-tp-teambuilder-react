import type { TeamMemberType } from "@/store/team";
import { getSpriteUrl } from "@/utils/pokemon.utils";
import TypeBadge from "@/components/ui/TypeBadge.component";

type TeamSlotProps = {
  member?: TeamMemberType;
  onRemove: () => void;
};

const TeamSlot = ({ member, onRemove }: TeamSlotProps) => {
  if (!member) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white text-2xl text-gray-300">
        +
      </div>
    );
  }

  return (
    <div className="relative flex h-40 flex-col items-center justify-center gap-1 rounded-xl border-2 border-red-500 bg-white p-2 text-center shadow-sm">
      <button
        onClick={onRemove}
        aria-label={`Retirer ${member.name} de l'équipe`}
        className="absolute right-1.5 top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white transition-colors hover:bg-red-500"
      >
        ×
      </button>

      <div className="rounded-full bg-gray-100 p-1">
        <img
          src={getSpriteUrl(member.id)}
          alt={member.name}
          className="h-14 w-14"
        />
      </div>

      <span className="text-sm font-semibold text-gray-900 capitalize">
        {member.name}
      </span>

      <div className="flex flex-wrap justify-center gap-1">
        {member.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>
    </div>
  );
};

export default TeamSlot;
