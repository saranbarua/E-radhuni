import CommunityHighlights from "./CommunityHighlights";
import Hero from "./Hero";
import Pricing from "./Pricing";
import RegularRanna from "../Reciepe/RegularRanna";
import WelcomeSection from "./WelcomeSection";
import useContents from "../../../components/hooks/useContents";
import Loader from "../../../components/Loader/Loader";
import ProductsPage from "./MyOrder/ProductPage";
import Main from "./Main";

export default function Home() {
  const { contents, isLoading, error } = useContents({ status: "ACTIVE" });

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ✅ Group contents by category.id
  const groupedByCategory = (contents || []).reduce((acc, item) => {
    const catId = item?.category?.id || "uncategorized";
    const catName = item?.category?.name || "Uncategorized";

    if (!acc[catId]) {
      acc[catId] = { id: catId, name: catName, items: [] };
    }
    acc[catId].items.push(item);
    return acc;
  }, {});

  // ✅ Convert object -> array
  const categories = Object.values(groupedByCategory);

  return (
    <div>
      <Main />
      <div className="container mx-auto p-6">
        <WelcomeSection />

        {/* ✅ Dynamic Sections */}
        {categories.map((cat) => (
          <RegularRanna key={cat.id} heading={cat.name} items={cat.items} />
        ))}

        <ProductsPage />
        <CommunityHighlights />
        <Pricing />
      </div>
      <Hero />
    </div>
  );
}
