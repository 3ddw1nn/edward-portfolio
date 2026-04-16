export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Each portfolio page manages its own header — this layout is a transparent passthrough.
  return <>{children}</>;
}
