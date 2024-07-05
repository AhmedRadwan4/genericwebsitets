import AddVariation from "@/components/admin/Variations/AddVariation";
import ListVariations from "@/components/admin/Variations/ListVariations";

export default async function Dashboard() {
  return (
    <>
      <AddVariation />
      <ListVariations />
    </>
  );
}
