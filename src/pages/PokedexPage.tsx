import usePokemonList from "@/hooks/usePokemonList.hook";
import usePokedexFilters from "@/hooks/usePokedexFilters.hook";
import Loader from "@/components/ui/Loader.component";
import ErrorMessage from "@/components/ui/ErrorMessage.component";
import PokedexFilters from "@/components/pokedex/PokedexFilters.component";
import PokemonGrid from "@/components/pokedex/PokemonGrid.component";

const PokedexPage = () => {
  // Deux hooks, deux responsabilités : les données d'un côté, les filtres
  // de l'autre. La page ne fait plus que les brancher ensemble.
  const { pokemons, loading, error } = usePokemonList();
  const {
    search,
    setSearch,
    selectedTypes,
    toggleType,
    selectedRegion,
    setSelectedRegion,
    filterPokemons,
  } = usePokedexFilters();

  if (loading) return <Loader message="Chargement du Pokédex…" />;
  if (error) return <ErrorMessage message={error} />;

  const filteredPokemons = filterPokemons(pokemons);

  return (
    <section>
      <header className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Pokédex
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Cherchez, filtrez par région et par types, puis ouvrez une fiche.
        </p>
      </header>

      <PokedexFilters
        search={search}
        onSearchChange={setSearch}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        selectedTypes={selectedTypes}
        onToggleType={toggleType}
      />

      <p className="mb-3 text-xs text-gray-500">
        {filteredPokemons.length} Pokémon
      </p>

      <PokemonGrid pokemons={filteredPokemons} />
    </section>
  );
};

export default PokedexPage;
