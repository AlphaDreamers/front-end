export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto pt-[calc(2rem+64px)] pb-8 px-4 min-h-screen">
      {children}
    </div>
  );
}
