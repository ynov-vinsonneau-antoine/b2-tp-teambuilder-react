import type { DamageRelationsType } from "@/store/pokemon";

// Ce qu'on range dans l'équipe. On y ajoute les types : le récapitulatif
// et les faiblesses en ont besoin, et on ne veut pas les redemander à l'API.
export type TeamMemberType = {
  id: number;
  name: string;
  types: string[];
};

// Les relations de dégâts des types présents dans l'équipe, rangées par type.
export type TeamDamageRelationsType = Record<string, DamageRelationsType>;

// L'état du store et ses actions. Le composant ne connaît que ça.
export type TeamStoreType = {
  team: TeamMemberType[];

  addToTeam: (pokemon: TeamMemberType) => void;
  /** Depuis la grille : la liste ne donne pas les types, l'API les complète. */
  addToTeamByName: (pokemon: { id: number; name: string }) => Promise<boolean>;
  removeFromTeam: (id: number) => void;

  isInTeam: (id: number) => boolean;
  isTeamFull: () => boolean;
};
