import { useEffect, useState } from "react";
import {
  getTeamDamageRelationsApi,
  useTeamStore,
  type TeamDamageRelationsType,
} from "@/store/team";
import {
  POKEMON_TYPES,
  TYPE_COLORS,
  TYPE_LABELS,
} from "@/utils/pokemon.utils";

const TeamWeaknesses = () => {
  const team = useTeamStore((state) => state.team);

  const [relations, setRelations] = useState<TeamDamageRelationsType>({});
  const [loading, setLoading] = useState(false);

  // L'effet se rejoue à chaque changement d'équipe : on va chercher
  // les relations de dégâts des types qu'elle contient.
  useEffect(() => {
    const loadRelations = async () => {
      // Les types présents dans l'équipe, sans doublon.
      const teamTypes = POKEMON_TYPES.filter((type) =>
        team.some((member) => member.types.includes(type))
      );

      if (teamTypes.length === 0) {
        setRelations({});
        return;
      }

      setLoading(true);

      try {
        setRelations(await getTeamDamageRelationsApi(teamTypes));
      } catch {
        setRelations({});
      } finally {
        setLoading(false);
      }
    };

    loadRelations();
  }, [team]);

  if (team.length === 0) return null;

  if (loading) {
    return (
      <p className="mt-4 text-xs text-gray-400">Calcul des faiblesses…</p>
    );
  }

  // Ce que subit un Pokémon face à un type d'attaque. Ses deux types se
  // multiplient : x2 d'un côté et x0,5 de l'autre, et il ne craint rien.
  const getMultiplier = (attackingType: string, defendingTypes: string[]) => {
    let multiplier = 1;

    for (const defendingType of defendingTypes) {
      const relation = relations[defendingType];
      if (!relation) continue;

      if (relation.no_damage_from.some((t) => t.name === attackingType)) {
        multiplier = 0;
      } else if (
        relation.double_damage_from.some((t) => t.name === attackingType)
      ) {
        multiplier = multiplier * 2;
      } else if (
        relation.half_damage_from.some((t) => t.name === attackingType)
      ) {
        multiplier = multiplier / 2;
      }
    }

    return multiplier;
  };

  // Combien de Pokémon chaque type d'attaque met en difficulté.
  // Rien de tout ça n'est stocké : c'est recalculé à chaque affichage.
  const weaknesses = POKEMON_TYPES.map((attackingType) => ({
    type: attackingType,
    count: team.filter(
      (member) => getMultiplier(attackingType, member.types) > 1
    ).length,
  }))
    .filter((weakness) => weakness.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-sm font-semibold text-gray-700">
        Faiblesses de l'équipe
      </h2>
      <p className="mb-3 text-xs text-gray-400">
        Combien de vos Pokémon chaque type d'attaque met en difficulté.
      </p>

      {weaknesses.length === 0 ? (
        <p className="text-xs text-gray-500">
          Aucun type ne prend l'avantage sur votre équipe.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {weaknesses.map((weakness) => (
            <span
              key={weakness.type}
              className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                TYPE_COLORS[weakness.type] ?? "bg-gray-500"
              }`}
            >
              {TYPE_LABELS[weakness.type]}
              <span className="rounded-full bg-black/25 px-1.5">
                {weakness.count}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamWeaknesses;
