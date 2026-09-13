import {
  MAX_SELECTED_TYPES,
  POKEMON_TYPES,
  TYPE_COLORS,
  TYPE_LABELS,
} from "@/utils/pokemon.utils";

type TypeFilterProps = {
  selectedTypes: string[];
  onToggleType: (type: string) => void;
};

const TypeFilter = ({ selectedTypes, onToggleType }: TypeFilterProps) => {
  const isLimitReached = selectedTypes.length >= MAX_SELECTED_TYPES;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type);

          return (
            <button
              key={type}
              onClick={() => onToggleType(type)}
              disabled={!isSelected && isLimitReached}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected
                  ? `${TYPE_COLORS[type]} text-white`
                  : "border border-gray-300 bg-white text-gray-600 hover:text-gray-900"
              }`}
            >
              {TYPE_LABELS[type]}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-gray-400">
        {isLimitReached
          ? "Deux types au maximum. Désélectionnez-en un pour en choisir un autre."
          : `Deux types au maximum, cumulables.`}
      </p>
    </div>
  );
};

export default TypeFilter;
