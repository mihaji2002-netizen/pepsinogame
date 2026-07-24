import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: 72,
  md: 110,
  lg: 140,
};

export default function Logo({ size = "md", showTagline = false, className = "" }: LogoProps) {
  const px = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-white/20">
        <Image
          src="/exam/pepsino-logo.png"
          alt="Pepsino LAB"
          width={px}
          height={px}
          className="object-cover"
          priority
        />
      </div>
      {showTagline && (
        <p className="text-xs text-emerald-700/80 mt-3 tracking-wide font-medium">
          GET ACTIVE TO GROW
        </p>
      )}
    </div>
  );
}
