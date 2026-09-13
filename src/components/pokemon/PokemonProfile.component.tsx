import type { PokemonDetailType } from "@/store/pokemon";
import StatBar from "./StatBar.component";

type PokemonProfileProps = {
  pokemon: PokemonDetailType;
  genus?: string;
  description?: string;
};

// La colonne de droite : la catégorie, la description, les statistiques
// et le gabarit.
const PokemonProfile = ({
  pokemon,
  genus,
  description,
}: PokemonProfileProps) => {
  return (
    <div>
      {genus && (
        <p className="mb-1 text-sm font-semibold text-red-600">{genus}</p>
      )}

      {description && (
        <p className="mb-6 text-sm leading-relaxed text-gray-700">
          {description}
        </p>
      )}

      <h2 className="mb-3 text-sm font-semibold text-gray-700">Statistiques</h2>

      <div className="flex flex-col gap-2">
        {pokemon.stats.map((entry) => (
          <StatBar
            key={entry.stat.name}
            label={entry.stat.name}
            value={entry.base_stat}
          />
        ))}
      </div>

      <h2 className="mt-6 mb-3 text-sm font-semibold text-gray-700">Gabarit</h2>

      <p className="text-sm text-gray-500">
        {pokemon.height / 10} m · {pokemon.weight / 10} kg
      </p>
    </div>
  );
};

export default PokemonProfile;
