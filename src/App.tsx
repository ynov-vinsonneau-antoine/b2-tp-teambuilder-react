import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout.component";
import PokedexPage from "@/pages/PokedexPage";
import PokemonDetailPage from "@/pages/PokemonDetailPage";
import TeamPage from "@/pages/TeamPage";
import NotFoundPage from "@/pages/NotFoundPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PokedexPage />} />
          <Route path="pokemon/:name" element={<PokemonDetailPage />} />
          <Route path="equipe" element={<TeamPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
