import { useEffect, useState } from "react";
import { getPokemonListApi, type PokemonType } from "@/store/pokemon";
import { getErrorMessage } from "@/lib/http";

/**
 * La liste complète du Pokédex, chargée une fois.
 *
 * Le hook porte les trois états d'un appel réseau — en cours, en erreur,
 * abouti. La page n'a plus qu'à les afficher.
 */
const usePokemonList = () => {
  const [pokemons, setPokemons] = useState<PokemonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tableau de dépendances vide : l'effet ne se rejoue jamais.
  useEffect(() => {
    const loadPokemons = async () => {
      setLoading(true);
      setError(null);

      try {
        setPokemons(await getPokemonListApi());
      } catch (caught) {
        setError(getErrorMessage(caught, "Impossible de charger le Pokédex."));
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
  }, []);

  return { pokemons, loading, error };
};

export default usePokemonList;
