'use client';
import { Game } from "@/utils/endpoint";
import { useEffect, useState } from "react";
import Card from "./Card";

export default function GamesCatalog() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  useEffect(() => {
    fetch("http://localhost:3000/api/games")
      .then((response) => response.json())
      .then((data) => { 
        setGames(data.games);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setSelectedGenre(data.selectedGenre);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {games.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} game={game} />
          ))} 
        </div>
      )}
    </div>
  );
}