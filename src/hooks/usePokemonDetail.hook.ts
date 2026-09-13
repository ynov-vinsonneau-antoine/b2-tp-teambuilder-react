import { useEffect, useState } from "react";
import {
  getPokemonDetailApi,
  getPokemonSpeciesApi,
  type PokemonDetailType,
  type PokemonSpeciesType,
} from "@/store/pokemon";
import { getErrorMessage } from "@/lib/http";

/**
 * La fiche d'un Pokémon et l'espèce dont il relève.
 *
 * Deux appels enchaînés : le second a besoin du premier, puisque le nom
 * d'espèce est dans la fiche. `name` est dans le tableau de dépendances,
 * donc changer de Pokémon relance les deux.
 */
const usePokemonDetail = (name: string | undefined) => {
  const [pokemon, setPokemon] = useState<PokemonDetailType | null>(null);
  const [species, setSpecies] = useState<PokemonSpeciesType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemon = async () => {
      if (!name) return;

      setLoading(true);
      setError(null);

      try {
        const detail = await getPokemonDetailApi(name);
        const speciesDetail = await getPokemonSpeciesApi(detail.species.name);

        setPokemon(detail);
        setSpecies(speciesDetail);
      } catch (caught) {
        setError(getErrorMessage(caught, "Ce Pokémon est introuvable."));
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, [name]);

  return { pokemon, species, loading, error };
};

export default usePokemonDetail;
