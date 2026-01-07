import React from "react";

const ServicesPage = () => {
  return (
    <div className="min-h-screen font-serif bg-gradient-to-r from-gray-900 via-black to-gray-900 flex justify-center items-center">
      <div className="container mx-auto px-6 py-12">
        {/* Introduction Section */}
        <div className="text-center text-white mb-12">
          <h1 className="text-4xl font-semibold">Explore Our Services</h1>
          <p className="mt-4 text-lg max-w-3xl mx-auto">
            Discover the wide range of services we offer to help you achieve
            your goals. From customized solutions to professional assistance, we
            are here to guide you every step of the way.
          </p>
        </div>

        {/* Services Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Service 1 */}
          <div className="service-card">
            <div className="glassmorphism p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold text-primary">Service 1</h3>
              <p className="text-gray-300 mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                euismod sapien felis, sit amet vestibulum ante scelerisque eu.
                Nullam nec dui ante.
              </p>
              <button className="mt-4 text-primary hover:text-primary-light">
                Learn More
              </button>
            </div>
          </div>
          {/* Service 2 */}
          <div className="service-card">
            <div className="glassmorphism p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold text-primary">Service 2</h3>
              <p className="text-gray-300 mt-4">
                Donec hendrerit malesuada metus non iaculis. Integer sed diam
                sit amet ligula iaculis malesuada. Quisque ac felis felis.
                Aenean vestibulum sapien at feugiat.
              </p>
              <button className="mt-4 text-primary hover:text-primary-light">
                Learn More
              </button>
            </div>
          </div>
          {/* Service 3 */}
          <div className="service-card">
            <div className="glassmorphism p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h3 className="text-2xl font-semibold text-primary">Service 3</h3>
              <p className="text-gray-300 mt-4">
                Sed ultrices erat vitae orci ullamcorper, et pharetra odio
                sollicitudin. Sed et augue vitae neque efficitur condimentum.
                Praesent euismod erat a dolor fermentum.
              </p>
              <button className="mt-4 text-primary hover:text-primary-light">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
