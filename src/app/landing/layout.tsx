import Providers from "@/components/Providers";
import Toaster from "@/components/ui/Toaster";

// This layout removes the default container wrapper so the landing page
// can render full-width sections. The root layout's Navbar still shows.
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
