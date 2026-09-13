import SearchInput from "./SearchInput.component";
import RegionFilter from "./RegionFilter.component";
import TypeFilter from "./TypeFilter.component";

type PokedexFiltersProps = {
  search: string;
  onSearchChange: (search: string) => void;
  selectedRegion: number | null;
  onSelectRegion: (generation: number | null) => void;
  selectedTypes: string[];
  onToggleType: (type: string) => void;
};

// Les trois filtres et leurs intitulés. Ce composant n'a aucun état : il
// reçoit les valeurs du hook `usePokedexFilters` et rend les callbacks.
const PokedexFilters = ({
  search,
  onSearchChange,
  selectedRegion,
  onSelectRegion,
  selectedTypes,
  onToggleType,
}: PokedexFiltersProps) => {
  return (
    <div className="mb-5 flex flex-col gap-4">
      <SearchInput search={search} onSearchChange={onSearchChange} />

      <div>
        <p className="mb-2 text-xs font-semibold text-gray-500">Région</p>
        <RegionFilter
          selectedRegion={selectedRegion}
          onSelectRegion={onSelectRegion}
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-gray-500">Types</p>
        <TypeFilter selectedTypes={selectedTypes} onToggleType={onToggleType} />
      </div>
    </div>
  );
};

export default PokedexFilters;
