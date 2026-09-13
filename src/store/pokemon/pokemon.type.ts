/** Les formes renvoyées par PokéAPI, et celles qu'on manipule dans l'app. */

// Une entrée de liste : un nom et une url, rien d'autre. L'API s'en sert
// partout (liste, types, générations).
export type NamedApiResourceType = {
  name: string;
  url: string;
};

// Ce qu'on garde en mémoire pour afficher la grille.
export type PokemonType = {
  id: number;
  name: string;
};

// Ce que renvoie /pokemon/{nom}. On ne déclare que les champs qu'on affiche.
export type PokemonDetailType = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: {
    type: { name: string };
  }[];
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  species: NamedApiResourceType;
};

// Ce que renvoie /pokemon-species/{id} : les textes, dans toutes les langues.
export type PokemonSpeciesType = {
  names: {
    name: string;
    language: { name: string };
  }[];
  genera: {
    genus: string;
    language: { name: string };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
};

// Ce que /type/{nom} dit du type quand il SUBIT une attaque.
export type DamageRelationsType = {
  double_damage_from: { name: string }[];
  half_damage_from: { name: string }[];
  no_damage_from: { name: string }[];
};

/* --- Les enveloppes de réponse, utiles au seul fichier `.api.ts` --- */

export type PokemonListResponseType = {
  results: NamedApiResourceType[];
};

export type TypeResponseType = {
  pokemon: { pokemon: NamedApiResourceType }[];
  damage_relations: DamageRelationsType;
};

export type GenerationResponseType = {
  pokemon_species: NamedApiResourceType[];
};
