import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../components/Loader/Loader";
import useProductDetails from "../../../../components/hooks/useProductDetails";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  addToCart,
  openCart,
} from "../../../redux/features/Authentication/cartSlice";

const money = (n) => {
  const num = Number(n || 0);
  return `৳${num.toLocaleString("en-BD")}`;
};

const StatPill = ({ label, value }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur px-4 py-1.5 shadow-sm">
    <span className="text-[11px] uppercase tracking-wide text-gray-400">
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-900 tabular-nums">
      {value}
    </span>
  </div>
);

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProductDetails(id);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const inCart = product ? cartItems.some((c) => c.id === product.id) : false;

  const handleAddCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        imageUrl: product.imageUrl || img,
      })
    );

    dispatch(openCart()); // ✅ auto open mini drawer
    toast.success("Added to cart");
  };

  if (isLoading) return <Loader />;

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-serif">
        <div className="max-w-md w-full rounded-3xl border bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
          <p className="mt-2 text-gray-600">
            This product might be removed or unavailable.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="mt-5 rounded-2xl bg-gray-900 text-white px-5 py-2 text-sm font-semibold hover:bg-black"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const img =
    product.imageUrl ||
    "https://dummyimage.com/900x900/e5e7eb/111827&text=Product";

  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      {/* Top */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            ← Back
          </button>
          <div className="text-xs uppercase tracking-widest text-gray-400">
            Product Details
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="rounded-3xl overflow-hidden border bg-white shadow-sm">
            <div className="relative">
              <img
                src={img}
                alt={product.name}
                className="w-full h-[360px] md:h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
              <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                <StatPill label="Price" value={money(product.price)} />
                <StatPill label="Status" value={product.status || "ACTIVE"} />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-3xl border bg-white shadow-sm p-6">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-3 text-gray-600 leading-relaxed">
              {product.description || "No description available."}
            </p>

            <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Why people buy this
              </p>
              <ul className="mt-3 text-sm text-gray-700 space-y-2 list-disc pl-5">
                <li>Consistent quality for daily cooking</li>
                <li>Perfect match for Be-Radhuni recipes</li>
                <li>Fresh stock, trusted sourcing</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+8801700000000"
                className="flex-1 rounded-2xl bg-gray-900 text-white py-3 text-sm font-semibold hover:bg-black transition text-center"
              >
                Order by Call
              </a>
              <button
                onClick={handleAddCart}
                className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                Add to Cart
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Note: Price may vary based on availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
