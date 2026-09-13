# Pokédex — TP de consommation d'API

Projet du cours **State management et asynchrone** (B2 · React & TypeScript).

Trois pages, un store, et les données de [PokéAPI](https://pokeapi.co) : un Pokédex
cherchable et filtrable, une fiche détaillée, et une équipe de six.

## Démarrer

```bash
npm install
npm run dev
```

Vite, TypeScript, Tailwind CSS, React Router, Zustand et Axios sont déjà installés.

## Les variables d'environnement

Les urls vivent dans le `.env`, versionné puisqu'il ne contient aucune clé :

```
VITE_POKEAPI_URL=https://pokeapi.co/api/v2
VITE_POKEAPI_SPRITES_URL=https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon
```

`.env.example` en donne le modèle, `src/vite-env.d.ts` les types — une faute de
frappe sur un nom de variable se voit à la compilation. Pour surcharger une url en
local sans toucher au dépôt : `.env.local`, déjà ignoré par Git.

Seul `src/lib/http.ts` connaît `VITE_POKEAPI_URL`, en `baseURL` de l'instance Axios :
les fichiers `.api.ts` n'écrivent que des chemins relatifs (`/pokemon/pikachu`).

## Les trois pages

| Route | Page | Ce qu'elle fait |
| --- | --- | --- |
| `/` | `PokedexPage` | La liste complète, une recherche par nom, un filtre par région et par types (deux au maximum) |
| `/pokemon/:name` | `PokemonDetailPage` | La fiche : artwork, nom français, catégorie, description, statistiques, ajout à l'équipe |
| `/equipe` | `TeamPage` | Les six emplacements, les types couverts et les faiblesses de l'équipe |

## Les appels à l'API

Tout est public, sans clé. Les appels passent par **Axios** : `httpClient.get<T>(path)`
rend `{ data }` déjà typé, lève tout seul sur un statut d'erreur — plus de
`if (!response.ok)` — et `axios.isAxiosError` permet de distinguer un serveur
injoignable du reste, cf. `getErrorMessage`.

**Aucun appel réseau dans un composant** : chaque appel est une fonction d'un fichier
`.api.ts`, et le composant n'appelle que cette fonction.

| Appel | Poids | Fonction | Utilisée par |
| --- | --- | --- | --- |
| `/pokemon?limit=1400` | 93 Ko | `getPokemonListApi` | `usePokemonList`, une seule fois au chargement |
| `/type/{nom}` | ~40 Ko | `getPokemonNamesByTypesApi`, `getTypeDamageRelationsApi` | `usePokedexFilters` et `TeamWeaknesses` (damage_relations) |
| `/generation/{id}` | ~24 Ko | `getPokemonNamesByRegionApi` | `usePokedexFilters`, les espèces d'une région |
| `/pokemon/{nom}` | 290 Ko | `getPokemonDetailApi` | `usePokemonDetail`, et `getTeamMemberApi` à l'ajout depuis la grille |
| `/pokemon-species/{nom}` | 50 Ko | `getPokemonSpeciesApi` | `usePokemonDetail`, pour le nom et la description en français |

Les images ne coûtent **aucun appel** : leur url se déduit de l'id du Pokémon,
cf. `src/utils/pokemon.utils.ts`.

## Structure

Un dossier par domaine, trois fichiers par dossier — la convention est la même que
dans un projet de production :

```
src/
├── App.tsx                       les routes
├── lib/http.ts                   l'instance Axios : l'url de l'API, une seule fois
├── store/
│   ├── pokemon/
│   │   ├── pokemon.type.ts       les formes renvoyées par l'API
│   │   ├── pokemon.api.ts        les appels à PokéAPI
│   │   └── index.ts              le point d'entrée du domaine
│   └── team/
│       ├── team.type.ts          TeamMemberType, et le contrat du store
│       ├── team.api.ts           les appels dont l'équipe a besoin
│       ├── team.store.ts         l'état et les actions, en Zustand
│       └── index.ts
├── hooks/
│   ├── usePokemonList.hook.ts    la liste du Pokédex : données, loading, erreur
│   ├── usePokedexFilters.hook.ts recherche, types, région, et le filtrage
│   └── usePokemonDetail.hook.ts  la fiche et l'espèce, deux appels enchaînés
├── utils/pokemon.utils.ts        urls des images, les 18 types, les textes français
├── components/
│   ├── Layout.component.tsx      navigation + <Outlet />
│   ├── ui/                       Button, Loader, ErrorMessage, TypeBadge
│   ├── pokedex/                  SearchInput, TypeFilter, RegionFilter, PokedexFilters,
│   │                             PokemonCard, PokemonGrid
│   ├── pokemon/                  StatBar, PokemonIdentity, PokemonProfile, TeamToggleButton
│   └── team/                     TeamSlot, TeamSlots, TeamRecap, TeamWeaknesses
└── pages/                        PokedexPage, PokemonDetailPage, TeamPage, NotFoundPage
```

Les imports passent par l'alias `@/` (`@/store/team`), déclaré dans
`vite.config.ts` et `tsconfig.app.json` : un import ne dépend plus de l'endroit
d'où on l'écrit.

### Qui fait quoi

C'est le découpage à retenir. Chaque couche ne connaît que la suivante :

- **`.type.ts`** ne décrit que des formes. Aucun code exécuté.
- **`.api.ts`** parle à l'API et renvoie déjà la forme utile à l'app :
  `getPokemonListApi` rend des `{ id, name }`, pas l'enveloppe de PokéAPI.
- **`.store.ts`** porte l'état **partagé entre plusieurs pages** — ici, l'équipe.
  C'est lui qui appelle `.api.ts` quand une action a besoin du réseau
  (`addToTeamByName`).
- **`.hook.ts`** porte l'état **d'une seule page** : l'appel, son `loading`, son
  `error`, les filtres. Du `useState` et du `useEffect`, rangés hors du JSX.
- **Le composant** affiche. Il reçoit des props ou appelle un hook — jamais l'API
  directement.

`team.api.ts` s'appuie sur `pokemon.api.ts` plutôt que de réécrire les appels :
`getTeamMemberApi` demande la fiche puis n'en garde que `{ id, name, types }`.

### Pourquoi des hooks plutôt qu'une grosse page

`PokedexPage` faisait 180 lignes : trois `useEffect`, cinq `useState`, le filtrage et
tout le JSX. Elle en fait 56, et elle se lit d'un coup :

```tsx
const { pokemons, loading, error } = usePokemonList();
const { search, setSearch, /* … */ filterPokemons } = usePokedexFilters();

if (loading) return <Loader message="Chargement du Pokédex…" />;
if (error) return <ErrorMessage message={error} />;

const filteredPokemons = filterPokemons(pokemons);
```

Le test à appliquer : **si c'est du `useState` / `useEffect`, ça part dans un hook ;
si c'est du JSX répété ou autonome, ça part dans un composant.** Ce qui reste dans la
page, c'est le plan de l'écran.

Un hook n'est rien d'autre qu'une fonction dont le nom commence par `use` et qui a le
droit d'appeler les hooks de React. `usePokemonList`, c'est un bout de `PokedexPage`
déplacé dans son propre fichier — et réutilisable ailleurs tel quel.

`PokemonDetailPage` a suivi le même chemin : `usePokemonDetail` pour les deux appels
enchaînés, `getSpeciesTexts` pour le choix des textes français, et deux composants
pour les deux colonnes (`PokemonIdentity`, `PokemonProfile`).

## Les trois pièges du sujet

**PokéAPI n'a pas de recherche côté serveur.** Aucun `?q=`. On charge les 1302 noms
une seule fois, puis on filtre au rendu. C'est ce qui rend la recherche instantanée :
il n'y a aucun réseau entre la frappe et l'affichage.

**L'id n'est pas la position dans la liste.** Les ids vont de 1 à 1025, puis sautent
à 10001–10326 pour les formes alternatives. Il faut le lire dans l'`url` que la liste
fournit — c'est le rôle de `getIdFromUrl`. Même piège pour l'espèce : on l'interroge
par son nom (`detail.species.name`), jamais par l'id du Pokémon.

**Une fiche pèse 290 Ko.** Charger le détail des 60 Pokémon affichés pour connaître
leurs types représenterait 17 Mo. Les types viennent de `/type/`, jamais du détail.

## Ce qui n'est stocké nulle part

Aucune valeur calculable n'est rangée dans un `useState` :

- la liste filtrée de `PokedexPage` se recalcule à chaque affichage — `filterPokemons`
  est une fonction, pas un state ;
- les types couverts et absents de `TeamRecap` aussi ;
- les faiblesses de `TeamWeaknesses` sont recalculées à chaque affichage, à partir
  des relations de dégâts chargées une fois par type présent dans l'équipe.

Un seul `useState` porte la recherche : le texte tapé. Le reste s'en déduit.

Même logique dans le store : `isInTeam` et `isTeamFull` sont des fonctions, pas des
champs. Les composants les lisent par sélecteur — `useTeamStore((state) => state.team)` —
pour ne se rerendre que sur ce qu'ils utilisent vraiment.

## Vérifier

```bash
npm run lint
npm run build
```
