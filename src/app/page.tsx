import GamesCatalog from "@/components/GamesCatalog";

export default function Home() {

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24 font-bold text-4xl text-blue-600'>
      <GamesCatalog />
    </main>
  );  
}
