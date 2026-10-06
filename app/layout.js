export const metadata = {
  title: "ANIX — House of Time",
  description: "Anix watches reimagined with GSAP ScrollTrigger + Lenis storytelling."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
