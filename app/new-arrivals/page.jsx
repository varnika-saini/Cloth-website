import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/PageHeader";
import { NewArrivalsGrid } from "@/components/NewArrivalsGrid";

export const metadata = { title: "New Arrivals" };

export default function NewArrivals() {
  return (
    <>
      <PageHeader
        eyebrow="Fresh drops"
        title="New Arrivals"
        subtitle="The latest from our studio. Hand-picked silhouettes, soft palettes and limited stock."
      />
      <Container className="py-12">
        <NewArrivalsGrid />
      </Container>
    </>
  );
}
