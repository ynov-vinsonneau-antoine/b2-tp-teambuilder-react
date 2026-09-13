import { useTeamStore } from "@/store/team";
import { POKEMON_TYPES, TYPE_LABELS } from "@/utils/pokemon.utils";
import TypeBadge from "@/components/ui/TypeBadge.component";

const TeamRecap = () => {
  const team = useTeamStore((state) => state.team);

  if (team.length === 0) return null;

  // Aucune de ces deux listes n'est un state : elles se recalculent
  // à chaque affichage, et elles sont donc toujours justes.
  const coveredTypes = POKEMON_TYPES.filter((type) =>
    team.some((member) => member.types.includes(type))
  );
  const missingTypes = POKEMON_TYPES.filter(
    (type) => !coveredTypes.includes(type)
  );

  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">
        Récapitulatif
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500">
            Types couverts ({coveredTypes.length} / {POKEMON_TYPES.length})
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {coveredTypes.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500">Types absents</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {missingTypes.map((type) => (
              <span
                key={type}
                className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500"
              >
                {TYPE_LABELS[type]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRecap;
