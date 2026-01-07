import images from "../../assets/image";

const Main = () => {
  return (
    <div className="w-full bg-black h-screen">
      {/* Background Image */}
      <img
        src={images.hero}
        alt="Chef Cooking"
        className="w-full h-full object-contain" // Makes the image cover the full screen
      />
    </div>
  );
};

export default Main;
