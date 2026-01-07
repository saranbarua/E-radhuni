import React from "react";

export default function Contact() {
  // ✅ Replace these with your real links/data
  const phone = "+8801746180243"; // WhatsApp needs country code without +
  const whatsappNumber = "+880 1874-460944";
  const messengerLink = "https://m.me/yourpageusername";
  const email = "support@eradhuni.com";

  // Google Maps embed: replace with your own place embed link
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902998!2d90.399452!3d23.750883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b000000000%3A0x0000000000000000!2sBanani%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v0000000000000";

  const socials = [
    { name: "Facebook", href: "https://facebook.com/yourpage" },
    { name: "Instagram", href: "https://instagram.com/yourprofile" },
    { name: "LinkedIn", href: "https://linkedin.com/company/yourcompany" },
    { name: "YouTube", href: "https://youtube.com/@yourchannel" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Support • Partnerships • Business
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Reach out anytime. We keep it simple: fast replies, clear answers,
            and helpful support.
          </p>
        </div>

        {/* Top Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <InfoCard title="Email" value={email} sub="Reply within 24 hours" />
          <InfoCard title="Phone" value={phone} sub="Sun–Thu, 10 AM–6 PM" />
          <InfoCard
            title="Office"
            value="Dhaka, Bangladesh"
            sub="Corporate Office"
          />
        </div>

        {/* WhatsApp / Messenger Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition shadow-sm"
          >
            <WhatsAppIcon />
            WhatsApp Message
          </a>

          <a
            href={messengerLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm"
          >
            <MessengerIcon />
            Messenger Chat
          </a>
        </div>

        {/* Map + Socials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Find us on Google Maps
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Office location & directions.
              </p>
            </div>

            <div className="w-full h-[320px]">
              <iframe
                title="Google Map"
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Social Row */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 p-7">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Connect with us
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Follow for updates, announcements, and product news.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-5 py-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <SocialDot />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {s.name}
                    </span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500 text-sm">
                    Open
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Tip: If you want a “dark mode toggle”, enable Tailwind dark mode
                and add a toggle in your layout. This page already supports it.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-14">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            For urgent queries, WhatsApp is the fastest.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

const InfoCard = ({ title, value, sub }) => (
  <div className="p-7 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{title}</p>
    <p className="text-xl font-medium text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{sub}</p>
  </div>
);

const SocialDot = () => (
  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gray-900 dark:bg-white opacity-70" />
);

/* ---------------- Icons (No library) ---------------- */

const WhatsAppIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M20.5 11.8c0 4.8-3.9 8.7-8.7 8.7-1.5 0-3-.4-4.3-1.1L3 21l1.6-4.3c-.8-1.3-1.2-2.9-1.2-4.6C3.4 7.3 7.3 3.4 12.1 3.4c4.7 0 8.4 3.7 8.4 8.4Z"
      className="stroke-white"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 10c.2-.6.5-1 .9-1.2.3-.1.7 0 1 .5l.7 1c.2.3.2.7 0 1-.2.3-.4.6-.3.9.2.6 1.3 1.8 2 2 .3.1.6-.1.9-.3.3-.2.7-.2 1 0l1 .7c.5.3.6.7.5 1-.2.4-.6.7-1.2.9-1 .3-2.9 0-4.8-1.9-1.8-1.8-2.2-3.6-1.9-4.6Z"
      className="fill-white"
      opacity="0.9"
    />
  </svg>
);

const MessengerIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 3.5c-4.8 0-8.7 3.6-8.7 8.1 0 2.6 1.3 5 3.5 6.5V21l3.1-1.7c.7.2 1.4.3 2.1.3 4.8 0 8.7-3.6 8.7-8.1S16.8 3.5 12 3.5Z"
      className="stroke-current"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.8 13.7 10.9 10l2.3 2.2 3-2.2-3.1 3.7-2.3-2.2-3 2.2Z"
      className="fill-current"
      opacity="0.9"
    />
  </svg>
);
