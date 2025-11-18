'use client';
import { Game } from "@/utils/endpoint";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Card from "./Card";
import GenreFilter from "./GenreFilter";
import Button from "./Button";
import { addToCart, removeFromCart } from "@/utils/cart";

export default function GamesCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const previousGenreRef = useRef<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Build query string from URL params
    const genre = searchParams.get('genre');
    const page = searchParams.get('page') || '1';
    const pageNum = parseInt(page);

    // If genre changed, reset games list
    const genreChanged = previousGenreRef.current !== genre;
    if (genreChanged) {
      setGames([]);
      previousGenreRef.current = genre;
    }

    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    params.set('page', page);

    fetch(`/api/games?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        // If loading page 1 or genre changed, replace games. Otherwise append.
        if (pageNum === 1 || genreChanged) {
          setGames(data.games);
        } else {
          setGames(prev => [...prev, ...data.games]);
        }
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSeeMore = () => {
    const genre = searchParams.get('genre');
    const nextPage = currentPage + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', nextPage.toString());

    router.push(`/?${params.toString()}`);
  };

  const handleAddToCart = (game: Game) => {
    console.log('Adding to cart:', game);
    addToCart(game);
  };

  const handleRemoveFromCart = (gameId: string) => {
    console.log('Removing from cart:', gameId);
    removeFromCart(gameId);
  };

  const hasMorePages = currentPage < totalPages;

  return (
    <div className="w-full mt-[50px]">
      <p className="text-2xl font-bold ">Top Sellers</p>
      <div className="flex justify-end mb-6">
        <GenreFilter />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {!loading && !error && games.length === 0 && (
        <div>No games found for the selected genre.</div>
      )}
      {!loading && games.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} game={game} handleAddToCart={handleAddToCart} handleRemoveFromCart={handleRemoveFromCart} />
          ))}
        </div>
      )}
      {hasMorePages && (
        <Button
          onClick={handleSeeMore}
          disabled={loading}
          className="mt-6"
        >
          SEE MORE
        </Button>
      )}
    </div>
  );
}