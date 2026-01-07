import Skeleton from "./Skeleton";

export default function OrderDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 font-serif">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Items */}
          <div className="lg:col-span-2 rounded-3xl border bg-white p-6">
            <Skeleton className="h-4 w-24 mb-4" />

            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-2xl border bg-gray-50 p-4 mb-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div>
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>

                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="rounded-3xl border bg-white p-6">
            <Skeleton className="h-3 w-24 mb-3" />
            <Skeleton className="h-5 w-full mb-4" />

            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>

            <div className="mt-6 rounded-2xl bg-gray-50 p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-6 w-32" />
            </div>

            <Skeleton className="h-12 w-full mt-6 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
