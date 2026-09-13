import { getPokemonDetailApi, getTypeDamageRelationsApi } from "@/store/pokemon";
import type { TeamDamageRelationsType, TeamMemberType } from "./team.type";

/**
 * Le Pokémon tel que l'équipe le stocke.
 *
 * La grille ne connaît que l'id et le nom : on va chercher la fiche pour
 * en tirer les types, et on jette tout le reste.
 */
export const getTeamMemberApi = async (
  name: string
): Promise<TeamMemberType> => {
  const pokemon = await getPokemonDetailApi(name);

  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((entry) => entry.type.name),
  };
};

/** Les relations de dégâts de chaque type demandé, en un seul objet. */
export const getTeamDamageRelationsApi = async (
  types: string[]
): Promise<TeamDamageRelationsType> => {
  const relations: TeamDamageRelationsType = {};

  for (const type of types) {
    relations[type] = await getTypeDamageRelationsApi(type);
  }

  return relations;
};
