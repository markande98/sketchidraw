export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-fit min-h-screen overflow-hidden dark:bg-surface-lowest">
      {children}
    </div>
  );
}
