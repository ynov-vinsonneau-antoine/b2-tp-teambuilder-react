import type { PokemonDetailType } from "@/store/pokemon";
import { getArtworkUrl } from "@/utils/pokemon.utils";
import TypeBadge from "@/components/ui/TypeBadge.component";
import TeamToggleButton from "./TeamToggleButton.component";

type PokemonIdentityProps = {
  pokemon: PokemonDetailType;
  types: string[];
  frenchName?: string;
};

// La carte de gauche : l'artwork, les noms, les types, le bouton d'équipe.
const PokemonIdentity = ({
  pokemon,
  types,
  frenchName,
}: PokemonIdentityProps) => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-6">
      <img
        src={getArtworkUrl(pokemon.id)}
        alt={pokemon.name}
        className="h-56 w-56"
      />

      <span className="text-sm font-medium text-gray-400">
        #{String(pokemon.id).padStart(3, "0")}
      </span>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 capitalize">
        {frenchName ?? pokemon.name}
      </h1>
      <span className="text-sm text-gray-500 capitalize">{pokemon.name}</span>

      <div className="mt-3 flex gap-2">
        {types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </div>

      <div className="mt-4">
        <TeamToggleButton
          pokemon={{ id: pokemon.id, name: pokemon.name, types }}
        />
      </div>
    </div>
  );
};

export default PokemonIdentity;
