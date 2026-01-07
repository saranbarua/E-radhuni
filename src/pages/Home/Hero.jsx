import images from "../../assets/image";

export default function Hero() {
  return (
    <section className="w-full">
      <div className="relative w-full h-[60vh] md:h-[75vh] lg:h-[90vh] overflow-hidden">
        <img
          src={images.banner}
          alt="Hero Banner"
          className="w-full h-full object-contain object-center"
        />

        {/* Optional dark overlay for beauty */}
        {/* <div className="absolute inset-0 bg-black/30" /> */}
      </div>
    </section>
  );
}
