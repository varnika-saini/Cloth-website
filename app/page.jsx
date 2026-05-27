import { Hero } from "@/components/Hero";
import { TrendingCategories } from "@/components/TrendingCategories";
import { FeaturedProducts } from "@/components/FeaturedProducts";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrendingCategories />
      <FeaturedProducts />
    </>
  );
}
