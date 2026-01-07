import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useProducts from "../../../../components/hooks/useProducts";

const ProductsPage = () => {
  const { products, isLoading, error } = useProducts({ status: "ACTIVE" }); // Use the custom useProducts hook
  const [visibleCount, setVisibleCount] = useState(8); // Start with 8 products to show
  const navigate = useNavigate();

  // Handle the "Load More" functionality
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8); // Increase the visible count by 8
  };

  if (isLoading)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {Array(8)
          .fill(" ")
          .map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-3xl shadow-md">
              <Skeleton height={180} className="rounded-2xl" />
              <Skeleton height={20} width={120} className="mt-3" />
              <Skeleton height={15} className="mt-2" />
              <Skeleton height={15} width={60} className="mt-2" />
            </div>
          ))}
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // ✅ Flatten all products into one array (all products)
  const allProducts = products || [];

  return (
    <section className="py-10 font-serif">
      <div className="max-w-6xl mx-auto px-4">
        {/* Premium Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-gray-200 bg-gradient-to-r from-white to-gray-50 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-gray-700">
                All Products
              </span>
            </div>

            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              All Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Handpicked products for your needs.
            </p>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Display only 'visibleCount' number of products */}
          {allProducts.slice(0, visibleCount).map((product) => {
            const thumb =
              product.imageUrl ||
              "https://dummyimage.com/600x400/e5e7eb/111827&text=Product";
            return (
              <button
                type="button"
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="text-left group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/70 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-400/40"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={thumb}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-90" />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-extrabold text-gray-900 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                    {product.category?.name || "Category: N/A"}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-[11px] text-gray-500">
                      Price{" "}
                      <span className="font-semibold text-gray-900">
                        ${product.price}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Bottom glow line */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 border border-gray-200 bg-white shadow-sm text-sm font-extrabold text-gray-900 hover:shadow-md hover:-translate-y-0.5 transition"
          >
            Load More Products
            <span className="text-red-500">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
