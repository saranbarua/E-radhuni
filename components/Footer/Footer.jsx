export default function Footer() {
  return (
    <footer className="bg-primary text-white py-6">
      <div className="container p-2 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-2">About Us</h2>
          <p className="text-sm">
            E-Radhuni is a modern Bengali cooking website designed to help users
            learn authentic Bangladeshi dishes in a clean, organized, and
            easy-to-follow way.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Quick Links</h2>
          <ul className="space-y-1">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="/subscription" className="hover:underline">
                Get Pro
              </a>
            </li>
            <li>
              <a href="/products" className="hover:underline">
                Products
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Contact Us</h2>
          <ul className="space-y-1">
            <li>
              <span>Email: </span>
              <a href="mailto:info@example.com" className="hover:underline">
                info@eradhuni.com
              </a>
            </li>
            <li>
              <span>Phone: </span>
              <a href="tel:+966 53 857 8777" className="hover:underline">
                +966 53 857 8777
              </a>
            </li>
            <li>
              <span className="font-semibold">Address: </span>Port City
              Internationa University,Chattogram,Bangladesh
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Follow Us</h2>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/profile.php?id=100089809267815"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              <i className="fab fa-facebook"></i> Facebook
            </a>
            <a href="#" className="hover:text-blue-500">
              <i className="fab fa-twitter"></i> Twitter
            </a>
            <a href="#" className="hover:text-pink-500">
              <i className="fab fa-instagram"></i> Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-black">
        © 2025 E-Radhuni. All rights reserved.
      </div>
    </footer>
  );
}
