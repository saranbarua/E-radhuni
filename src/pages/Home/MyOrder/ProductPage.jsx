import { Link } from "react-router-dom";
import useProducts from "../../../../components/hooks/useProducts";

const money = (n) => {
  const num = Number(n || 0);
  return `৳${num.toLocaleString("en-BD")}`;
};

const ProductSkeleton = () => (
  <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
    <div className="h-48 bg-gray-100 animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
      <div className="h-3 w-2/3 bg-gray-100 animate-pulse rounded" />
      <div className="h-9 w-full bg-gray-100 animate-pulse rounded-xl" />
    </div>
  </div>
);

export default function ProductsPage() {
  const { products, isLoading } = useProducts();

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Be-Radhuni Shop
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">
            Premium Ingredients
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Authentic cooking essentials—handpicked to match our recipe quality.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center">
            <h3 className="text-xl font-bold text-gray-900">
              No products found
            </h3>
            <p className="mt-2 text-gray-600">
              Please check back soon—new items will be added regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const img =
                p.imageUrl ||
                "https://dummyimage.com/600x600/e5e7eb/111827&text=Product";

              return (
                <Link
                  to={`/products/${p.id}`}
                  key={p.id}
                  className="group rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={img}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
                    <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-white/85 backdrop-blur px-3 py-1 text-xs font-semibold text-gray-900">
                      {money(p.price)}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {p.description || "Premium quality product."}
                    </p>

                    <button className="mt-4 w-full rounded-2xl bg-primary text-white py-2 text-sm font-semibold hover:bg-red-800">
                      View Details
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
