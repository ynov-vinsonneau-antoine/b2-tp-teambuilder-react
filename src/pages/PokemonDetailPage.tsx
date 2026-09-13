import { Link, useParams } from "react-router-dom";
import usePokemonDetail from "@/hooks/usePokemonDetail.hook";
import { getSpeciesTexts } from "@/utils/pokemon.utils";
import Loader from "@/components/ui/Loader.component";
import ErrorMessage from "@/components/ui/ErrorMessage.component";
import PokemonIdentity from "@/components/pokemon/PokemonIdentity.component";
import PokemonProfile from "@/components/pokemon/PokemonProfile.component";

const PokemonDetailPage = () => {
  // Le nom vient de l'url : /pokemon/pikachu
  const { name } = useParams();

  const { pokemon, species, loading, error } = usePokemonDetail(name);
  const { frenchName, genus, description } = getSpeciesTexts(species);

  if (loading) return <Loader message="Chargement de la fiche…" />;
  if (error) return <ErrorMessage message={error} />;
  if (!pokemon) return null;

  // On aplatit la forme de l'API pour ne manipuler que des chaînes.
  const types = pokemon.types.map((entry) => entry.type.name);

  return (
    <section>
      <Link
        to="/"
        className="mb-6 inline-block text-sm text-gray-500 transition-colors hover:text-gray-900"
      >
        ← Retour au Pokédex
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        <PokemonIdentity
          pokemon={pokemon}
          types={types}
          frenchName={frenchName}
        />
        <PokemonProfile
          pokemon={pokemon}
          genus={genus}
          description={description}
        />
      </div>
    </section>
  );
};

export default PokemonDetailPage;
