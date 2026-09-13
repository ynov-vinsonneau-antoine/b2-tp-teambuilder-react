import { useEffect, useState } from "react";
import {
  getPokemonNamesByRegionApi,
  getPokemonNamesByTypesApi,
  type PokemonType,
} from "@/store/pokemon";
import { MAX_SELECTED_TYPES } from "@/utils/pokemon.utils";

/**
 * Les trois filtres du Pokédex : la recherche, les types, la région.
 *
 * La recherche se fait en mémoire, les deux autres demandent à l'API la liste
 * des noms concernés. Pour ces deux-là, `null` signifie « aucun filtre actif »
 * — à ne pas confondre avec un tableau vide, qui veut dire « aucun résultat ».
 */
const usePokedexFilters = () => {
  const [search, setSearch] = useState("");

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [namesByType, setNamesByType] = useState<string[] | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [namesByRegion, setNamesByRegion] = useState<string[] | null>(null);

  // Ce tableau de dépendances n'est pas vide : l'effet se rejoue à chaque
  // changement de la sélection de types.
  useEffect(() => {
    const loadNamesByType = async () => {
      try {
        setNamesByType(await getPokemonNamesByTypesApi(selectedTypes));
      } catch {
        // Le filtre n'a pas pu être appliqué : on le laisse inactif plutôt
        // que de vider la grille.
        setNamesByType(null);
      }
    };

    loadNamesByType();
  }, [selectedTypes]);

  // Même mécanique, avec un autre endpoint.
  useEffect(() => {
    const loadNamesByRegion = async () => {
      if (selectedRegion === null) {
        setNamesByRegion(null);
        return;
      }

      try {
        setNamesByRegion(await getPokemonNamesByRegionApi(selectedRegion));
      } catch {
        setNamesByRegion(null);
      }
    };

    loadNamesByRegion();
  }, [selectedRegion]);

  const toggleType = (type: string) => {
    setSelectedTypes((currentTypes) => {
      // Déjà sélectionné : on l'enlève.
      if (currentTypes.includes(type)) {
        return currentTypes.filter((currentType) => currentType !== type);
      }

      // Deux types au maximum : au-delà, on ne change rien.
      if (currentTypes.length >= MAX_SELECTED_TYPES) return currentTypes;

      return [...currentTypes, type];
    });
  };

  /**
   * Applique les trois filtres à la liste.
   *
   * Le résultat n'est rangé dans aucun state : il se recalcule à chaque
   * affichage, et il est donc toujours juste.
   */
  const filterPokemons = (pokemons: PokemonType[]) =>
    pokemons
      .filter((pokemon) => pokemon.name.includes(search.toLowerCase()))
      .filter(
        (pokemon) => namesByType === null || namesByType.includes(pokemon.name)
      )
      .filter(
        (pokemon) =>
          namesByRegion === null || namesByRegion.includes(pokemon.name)
      );

  return {
    search,
    setSearch,
    selectedTypes,
    toggleType,
    selectedRegion,
    setSelectedRegion,
    filterPokemons,
  };
};

export default usePokedexFilters;
