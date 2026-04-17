/** Space below fixed site Navbar (min-h 3.75rem / md:16) so admin clears “Edward Lee” row */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050506] pt-24 text-white antialiased [--admin-radius:1rem] [--admin-radius-lg:1.25rem] md:pt-28">
      {children}
    </div>
  );
}
