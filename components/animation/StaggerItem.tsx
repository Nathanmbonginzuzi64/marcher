interface StaggerItemProps {
  index?: number;
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({
  index = 0,
  children,
  className = "",
}: StaggerItemProps) {
  const delay = Math.min(index * 0.04, 0.16);

  return (
    <div
      className={`animate-fade-up ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
