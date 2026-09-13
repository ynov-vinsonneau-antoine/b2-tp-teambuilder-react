import httpClient from "@/lib/http";
import { getIdFromUrl } from "@/utils/pokemon.utils";
import type {
  DamageRelationsType,
  GenerationResponseType,
  PokemonDetailType,
  PokemonListResponseType,
  PokemonSpeciesType,
  PokemonType,
  TypeResponseType,
} from "./pokemon.type";

// PokéAPI n'a pas de recherche côté serveur : on charge la liste entière
// une fois, et on filtre au rendu. 1400 couvre les 1302 espèces et leurs formes.
const POKEMON_LIST_LIMIT = 1400;

/** La liste complète, réduite à ce que la grille affiche : un id, un nom. */
export const getPokemonListApi = async (): Promise<PokemonType[]> => {
  const { data } = await httpClient.get<PokemonListResponseType>(
    `/pokemon?limit=${POKEMON_LIST_LIMIT}`
  );

  // L'API ne donne pas l'id dans la liste, seulement l'url : on l'en extrait.
  return data.results.map((item) => ({
    id: getIdFromUrl(item.url),
    name: item.name,
  }));
};

/** La fiche d'un Pokémon (~290 Ko) : à ne demander que sur sa page. */
export const getPokemonDetailApi = async (
  name: string
): Promise<PokemonDetailType> => {
  const { data } = await httpClient.get<PokemonDetailType>(`/pokemon/${name}`);
  return data;
};

/**
 * L'espèce : le nom français, la catégorie et la description.
 *
 * On l'interroge par le nom d'espèce que donne la fiche, jamais par l'id du
 * Pokémon : les formes alternatives (id 10001+) appartiennent à l'espèce de
 * leur forme de base, et `/pokemon-species/10001` n'existe pas.
 */
export const getPokemonSpeciesApi = async (
  speciesName: string
): Promise<PokemonSpeciesType> => {
  const { data } = await httpClient.get<PokemonSpeciesType>(
    `/pokemon-species/${speciesName}`
  );
  return data;
};

/** Les noms des Pokémon d'un type donné. */
export const getPokemonNamesByTypeApi = async (
  type: string
): Promise<string[]> => {
  const { data } = await httpClient.get<TypeResponseType>(`/type/${type}`);
  return data.pokemon.map((entry) => entry.pokemon.name);
};

/**
 * Les noms des Pokémon qui ont TOUS les types demandés.
 *
 * Le premier type donne la liste de départ, chaque type suivant la réduit :
 * c'est ça, le cumul des filtres. Sans type demandé, `null` — c'est-à-dire
 * « aucun filtre actif », et non « aucun résultat ».
 */
export const getPokemonNamesByTypesApi = async (
  types: string[]
): Promise<string[] | null> => {
  if (types.length === 0) return null;

  let names: string[] | null = null;

  for (const type of types) {
    const namesOfType = await getPokemonNamesByTypeApi(type);

    names =
      names === null
        ? namesOfType
        : names.filter((name) => namesOfType.includes(name));
  }

  return names;
};

/** Les relations de dégâts d'un type, quand il subit une attaque. */
export const getTypeDamageRelationsApi = async (
  type: string
): Promise<DamageRelationsType> => {
  const { data } = await httpClient.get<TypeResponseType>(`/type/${type}`);
  return data.damage_relations;
};

/** Les noms des espèces d'une région (une génération = une région). */
export const getPokemonNamesByRegionApi = async (
  generation: number
): Promise<string[]> => {
  const { data } = await httpClient.get<GenerationResponseType>(
    `/generation/${generation}`
  );
  return data.pokemon_species.map((species) => species.name);
};
