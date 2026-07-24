"use client";

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function SubjectQr({
  value,
  size = 72,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const cells = 21;
  const seed = hashString(value);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${cells} ${cells}`}
      className={className}
      role="img"
      aria-label={`QR ${value}`}
    >
      <rect width={cells} height={cells} fill="#fff" rx="1" />
      {Array.from({ length: cells * cells }, (_, i) => {
        const x = i % cells;
        const y = Math.floor(i / cells);
        const inFinder =
          (x < 7 && y < 7) ||
          (x >= cells - 7 && y < 7) ||
          (x < 7 && y >= cells - 7);
        const finderOn =
          inFinder &&
          (x === 0 ||
            y === 0 ||
            x === 6 ||
            y === 6 ||
            (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
            (x >= cells - 5 && x <= cells - 3 && y >= 2 && y <= 4) ||
            (x >= 2 && x <= 4 && y >= cells - 5 && y <= cells - 3));
        const pseudo = ((seed >> ((x + y * 3) % 24)) & 1) === 1;
        const on = inFinder ? finderOn : pseudo;
        if (!on) return null;
        return <rect key={i} x={x} y={y} width={1} height={1} fill="#0a0a12" />;
      })}
    </svg>
  );
}

export function SubjectBarcode({ value }: { value: string }) {
  const bars = Array.from({ length: 48 }, (_, i) => {
    const bit = (hashString(value + i) >> (i % 8)) & 1;
    return bit ? 2 : 1;
  });

  return (
    <div className="flex h-8 w-full items-end gap-px overflow-hidden opacity-80">
      {bars.map((w, i) => (
        <div
          key={i}
          className="h-full bg-current"
          style={{ width: w, opacity: i % 3 === 0 ? 1 : 0.55 }}
        />
      ))}
    </div>
  );
}
