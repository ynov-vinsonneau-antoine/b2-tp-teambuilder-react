import { create } from "zustand";
import { getTeamMemberApi } from "./team.api";
import type { TeamStoreType } from "./team.type";

export const MAX_TEAM_SIZE = 6;

const useTeamStore = create<TeamStoreType>((set, get) => ({
  team: [],

  addToTeam: (pokemon) =>
    set((state) => {
      // L'équipe est pleine, ou le Pokémon y est déjà : on ne change rien.
      if (state.team.length >= MAX_TEAM_SIZE) return state;
      if (state.team.some((member) => member.id === pokemon.id)) return state;

      return { team: [...state.team, pokemon] };
    }),

  // L'appel réseau vit ici, pas dans le composant : celui-ci n'a plus qu'à
  // savoir si l'ajout a réussi.
  addToTeamByName: async (pokemon) => {
    if (get().isTeamFull() || get().isInTeam(pokemon.id)) return false;

    try {
      const member = await getTeamMemberApi(pokemon.name);
      get().addToTeam(member);
      return true;
    } catch {
      // Un seul Pokémon n'a pas pu être ajouté : inutile de casser la page.
      console.error(`Impossible d'ajouter ${pokemon.name} à l'équipe.`);
      return false;
    }
  },

  removeFromTeam: (id) =>
    set((state) => ({
      team: state.team.filter((member) => member.id !== id),
    })),

  isInTeam: (id) => get().team.some((member) => member.id === id),

  isTeamFull: () => get().team.length >= MAX_TEAM_SIZE,
}));

export default useTeamStore;
