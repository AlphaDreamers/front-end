export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
