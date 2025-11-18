import { Suspense } from "react";
import GamesCatalog from "@/components/GamesCatalog";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between px-4 md:px-8 lg:px-16 xl:px-24'>
      <Suspense fallback={<div>Loading...</div>}>
        <GamesCatalog />
      </Suspense>
    </main>
  );  
}
