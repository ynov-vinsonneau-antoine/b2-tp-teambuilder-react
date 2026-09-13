import { useState } from "react";
import type { PokemonType } from "@/store/pokemon";
import { useTeamStore } from "@/store/team";
import PokeballIcon from "@/components/ui/PokeballIcon.component";
import TrashIcon from "@/components/ui/TrashIcon.component";

type TeamIconButtonProps = {
  pokemon: PokemonType;
  isInTeam: boolean;
};

const TeamIconButton = ({ pokemon, isInTeam }: TeamIconButtonProps) => {
  const addToTeamByName = useTeamStore((state) => state.addToTeamByName);
  const removeFromTeam = useTeamStore((state) => state.removeFromTeam);
  const isTeamFull = useTeamStore((state) => state.isTeamFull());

  const [loading, setLoading] = useState(false);

  // La liste ne donne ni les types ni les statistiques : le store va
  // chercher la fiche au moment du clic. C'est un appel en dehors d'un
  // useEffect, parce qu'il répond à une action de l'utilisateur.
  const handleAdd = async () => {
    setLoading(true);
    await addToTeamByName(pokemon);
    setLoading(false);
  };

  if (isInTeam) {
    return (
      <button
        onClick={() => removeFromTeam(pokemon.id)}
        aria-label={`Retirer ${pokemon.name} de l'équipe`}
        title="Retirer de l'équipe"
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-500"
      >
        <TrashIcon />
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isTeamFull || loading}
      aria-label={`Ajouter ${pokemon.name} à l'équipe`}
      title={isTeamFull ? "Équipe complète" : "Ajouter à l'équipe"}
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
    >
      <PokeballIcon />
    </button>
  );
};

export default TeamIconButton;
