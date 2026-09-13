import { Link } from "react-router-dom";
import type { PokemonType } from "@/store/pokemon";
import { getSpriteUrl } from "@/utils/pokemon.utils";
import TeamIconButton from "./TeamIconButton.component";

type PokemonCardProps = {
  pokemon: PokemonType;
  isInTeam: boolean;
};

const PokemonCard = ({ pokemon, isInTeam }: PokemonCardProps) => {
  return (
    <div
      className={`relative rounded-xl border-2 bg-white p-3 shadow-sm transition-all hover:shadow-md ${
        isInTeam ? "border-red-500" : "border-gray-200 hover:border-red-300"
      }`}
    >
      {/* Le bouton est en dehors du lien : un bouton dans un lien,
          ce n'est pas du HTML valide. */}
      <div className="absolute right-1.5 top-1.5">
        <TeamIconButton pokemon={pokemon} isInTeam={isInTeam} />
      </div>

      <Link
        to={`/pokemon/${pokemon.name}`}
        className="flex flex-col items-center text-center"
      >
        <div className="rounded-full bg-gray-100 p-1">
          <img
            src={getSpriteUrl(pokemon.id)}
            alt={pokemon.name}
            loading="lazy"
            className="h-16 w-16"
          />
        </div>

        <span className="mt-2 text-xs font-medium text-gray-400">
          #{String(pokemon.id).padStart(3, "0")}
        </span>
        <span className="text-sm font-semibold text-gray-900 capitalize">
          {pokemon.name}
        </span>
      </Link>
    </div>
  );
};

export default PokemonCard;
