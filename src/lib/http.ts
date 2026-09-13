import axios from "axios";

// Le client HTTP du projet. Un seul endroit connaît l'url de l'API : les
// fichiers `.api.ts` n'écrivent que des chemins relatifs (« /pokemon/pikachu »).
export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_POKEAPI_URL,
});

/**
 * Le message à afficher quand un appel échoue.
 *
 * Sans `response`, la requête n'est jamais arrivée : réseau coupé, serveur
 * éteint. Ce n'est pas la faute de l'utilisateur, et ce n'est pas la même
 * phrase qu'un Pokémon introuvable.
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error) && !error.response) {
    return "Le serveur est injoignable. Vérifiez votre connexion.";
  }

  return fallback;
};

export default httpClient;
