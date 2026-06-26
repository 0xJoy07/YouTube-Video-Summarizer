export function Button({ className = "", children, variant = "primary", ...props }) {
  const variants = {
    primary:
      "bg-foreground text-background hover:bg-hero-sub focus-visible:ring-foreground/50",
    heroSecondary:
      "liquid-glass text-foreground hover:bg-white/[0.06] focus-visible:ring-indigo-300/50",
    ghost:
      "text-foreground/75 hover:text-foreground hover:bg-white/[0.04] focus-visible:ring-foreground/30",
  };

  return (
    <button
      type={props.type || "button"}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-200 focus:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
