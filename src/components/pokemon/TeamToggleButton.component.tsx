import { useTeamStore, type TeamMemberType } from "@/store/team";
import Button from "@/components/ui/Button.component";

type TeamToggleButtonProps = {
  pokemon: TeamMemberType;
};

const TeamToggleButton = ({ pokemon }: TeamToggleButtonProps) => {
  const addToTeam = useTeamStore((state) => state.addToTeam);
  const removeFromTeam = useTeamStore((state) => state.removeFromTeam);

  // La fiche connaît déjà les types : aucun appel réseau ici.
  const isInTeam = useTeamStore((state) => state.isInTeam(pokemon.id));
  const isTeamFull = useTeamStore((state) => state.isTeamFull());

  if (isInTeam) {
    return (
      <Button variant="secondary" onClick={() => removeFromTeam(pokemon.id)}>
        Retirer de l'équipe
      </Button>
    );
  }

  return (
    <Button onClick={() => addToTeam(pokemon)} disabled={isTeamFull}>
      {isTeamFull ? "Équipe complète" : "Ajouter à l'équipe"}
    </Button>
  );
};

export default TeamToggleButton;
