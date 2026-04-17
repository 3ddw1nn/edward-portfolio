export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050506] text-white antialiased [--admin-radius:1rem] [--admin-radius-lg:1.25rem]">
      {children}
    </div>
  );
}
