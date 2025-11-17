import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-[#EEEEEE] ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-[#585660]">GameShop</h1>
          </Link>

          <button
            // onClick={() => { }}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <Image
              src="/cart.png"
              alt="Shopping cart"
              width={24}
              height={24}
              className="object-contain"
            />
          </button>
        </div>
      </div>
    </header>
  );
}

