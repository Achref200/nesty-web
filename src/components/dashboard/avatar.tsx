import { cn } from "@/lib/utils";

/**
 * Round profile avatar. Shows the image when an avatar URL is set, otherwise the
 * first initial. Uses a plain <img> because avatar URLs can point at any host
 * (next/image would need every domain allow-listed).
 */
export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  const initial = (name?.trim() || "A").charAt(0).toUpperCase();
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-pill bg-primary font-bold uppercase text-primary-fg",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
}
