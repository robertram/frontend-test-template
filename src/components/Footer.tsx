import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#404040] p-[64px] flex justify-center">
      <Image
        src="/ApplyDigitalLogo.svg"
        alt="Shopping cart"
        width={200}
        height={200}
        className="object-contain"
      />
    </footer>
  );
}

