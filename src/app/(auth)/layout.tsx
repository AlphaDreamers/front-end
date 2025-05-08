export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center h-full justify-center">{children}</div>
  );
}
