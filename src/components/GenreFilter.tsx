'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GenreFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedGenre = searchParams.get('genre') || '';

  useEffect(() => {
    fetch('/api/games')
      .then((response) => response.json())
      .then((data) => {
        setAvailableGenres(data.availableFilters || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
        setLoading(false);
      });
  }, []);

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const genre = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    if (genre) {
      params.set('genre', genre);
      params.set('page', '1');
    } else {
      params.delete('genre');
      params.set('page', '1');
    }

    router.push(`/?${params.toString()}`);
  };

  if (loading) {
    return (
      <div>
        <select disabled className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500">
          <option>Loading genres...</option>
        </select>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-2'>
      <p className='border-r-[1px] pr-5 text-base font-bold'>
        Genre
      </p>

      <select
        value={selectedGenre}
        onChange={handleGenreChange}
        className="px-4 py-2 border border-white rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        <option value="">All Genres</option>
        {availableGenres.map((genre) => (
          <option key={genre} value={genre} className=''>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
}

