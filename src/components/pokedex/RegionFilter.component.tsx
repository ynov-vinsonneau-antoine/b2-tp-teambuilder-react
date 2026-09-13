import { REGIONS } from "@/utils/pokemon.utils";

type RegionFilterProps = {
  selectedRegion: number | null;
  onSelectRegion: (generation: number | null) => void;
};

const RegionFilter = ({
  selectedRegion,
  onSelectRegion,
}: RegionFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {REGIONS.map((region) => {
        const isSelected = selectedRegion === region.generation;

        return (
          <button
            key={region.generation}
            // Recliquer sur la région active la désélectionne.
            onClick={() =>
              onSelectRegion(isSelected ? null : region.generation)
            }
            className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              isSelected
                ? "bg-red-600 text-white"
                : "border border-gray-300 bg-white text-gray-600 hover:text-gray-900"
            }`}
          >
            {region.label}
          </button>
        );
      })}
    </div>
  );
};

export default RegionFilter;
