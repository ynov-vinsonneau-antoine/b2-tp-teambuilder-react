import { NavLink, Outlet } from "react-router-dom";
import { MAX_TEAM_SIZE, useTeamStore } from "@/store/team";
import { getSpriteUrl } from "@/utils/pokemon.utils";
import PokeballIcon from "@/components/ui/PokeballIcon.component";

const links = [
  { to: "/", label: "Pokédex", end: true },
  { to: "/equipe", label: "Mon équipe", end: false },
];

// [0, 1, 2, 3, 4, 5] : les six emplacements de la barre.
const slots = Array.from({ length: MAX_TEAM_SIZE }, (_, index) => index);

const Layout = () => {
  const team = useTeamStore((state) => state.team);

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="bg-red-600 shadow-md">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-4 px-6 py-4">
          <PokeballIcon className="h-9 w-9" />

          <span className="text-xl font-bold tracking-tight text-white">
            Pokédex
          </span>

          <nav className="ml-4 flex gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-white font-semibold text-red-600"
                      : "text-red-100 hover:bg-red-500"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Une Poké Ball par emplacement libre, le Pokémon dès qu'il est pris. */}
          <div className="ml-auto flex items-center gap-1.5">
            {slots.map((slot) => {
              const member = team[slot];

              if (!member) {
                return (
                  <PokeballIcon key={slot} className="h-8 w-8 opacity-40" />
                );
              }

              return (
                <img
                  key={slot}
                  src={getSpriteUrl(member.id)}
                  alt={member.name}
                  title={member.name}
                  className="h-9 w-9 rounded-full bg-white"
                />
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
        Données : PokéAPI · React &amp; TypeScript · B2 Ynov
      </footer>
    </div>
  );
};

export default Layout;
