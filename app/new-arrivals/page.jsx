import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata = { title: "New Arrivals" };

export default function NewArrivals() {
  const list = products.filter((p) => p.isNew);
  return (
    <>
      <PageHeader
        eyebrow="Fresh drops"
        title="New Arrivals"
        subtitle="The latest from our studio. Hand-picked silhouettes, soft palettes and limited stock."
      />
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
