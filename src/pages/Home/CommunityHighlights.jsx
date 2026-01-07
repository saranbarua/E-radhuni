import PropTypes from "prop-types";

export default function CommunityHighlights() {
  return (
    <section className="my-12 bg-orange-50 p-4 md:px-10 rounded-3xl shadow-sm">
      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
        {[
          { label: "Active Learners", value: "32,000+" },
          { label: "Published Recipes", value: "480+" },
          { label: "Video Lessons", value: "120+" },
          { label: "Certified Chefs", value: "25+" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white shadow-sm border border-orange-100 p-5 text-center"
          >
            <div className="text-2xl md:text-3xl font-extrabold text-orange-600">
              {item.value}
            </div>
            <div className="text-sm text-gray-700 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

CommunityHighlights.propTypes = {
  apkUrl: PropTypes.string,
};
