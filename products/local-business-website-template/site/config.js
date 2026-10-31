// ============================================================
//  LOCAL BUSINESS WEBSITE TEMPLATE: the only file you need to edit.
//  Replace every {{PLACEHOLDER}}. Anything still wrapped in {{ }}
//  is listed in the yellow setup bar at the top of the page.
// ============================================================
window.BIZ = {
  name: "{{BUSINESS_NAME}}",        // e.g. "Southside Fade Co."
  type: "{{BUSINESS_TYPE}}",        // e.g. "Barbershop", "Plumbing", "Bakery"
  tagline: "{{TAGLINE}}",           // one short sentence
  colors: { primary: "#c8a24a", dark: "#121212" },
  heroImage: "",                    // optional: "hero.jpg" (put the file in this folder) or a full image URL

  phone: "{{PHONE}}",               // e.g. "(555) 010-2030"
  email: "{{EMAIL}}",               // where contact form messages should go
  address: "{{ADDRESS}}",           // street, city, state: also used for the map and directions
  bookingUrl: "",                   // optional: Square, Booksy, Calendly... empty = "Call to book" button

  // Contact form. Option A (recommended): create a free form at formspree.io and paste
  // the form ID (the part after /f/). Option B: leave as-is and the form opens the
  // visitor's email app addressed to the email above.
  formspreeId: "{{FORMSPREE_ID}}",

  hours: [
    ["Mon to Fri", "9:00 AM to 6:00 PM"],
    ["Saturday", "10:00 AM to 4:00 PM"],
    ["Sunday", "Closed"],
  ],
  services: [
    { name: "{{SERVICE_1}}", price: "{{PRICE_1}}", desc: "Short description of this service." },
    { name: "{{SERVICE_2}}", price: "{{PRICE_2}}", desc: "Short description of this service." },
    { name: "{{SERVICE_3}}", price: "{{PRICE_3}}", desc: "Short description of this service." },
  ],
  // Use only real reviews from real customers, with their permission.
  reviews: [
    { text: "{{REVIEW_1}}", by: "{{REVIEWER_1}}" },
    { text: "{{REVIEW_2}}", by: "{{REVIEWER_2}}" },
  ],
  socials: [
    { label: "Instagram", url: "{{INSTAGRAM_URL}}" },
    { label: "Facebook", url: "{{FACEBOOK_URL}}" },
    { label: "Google reviews", url: "{{GOOGLE_REVIEWS_URL}}" },
  ],
  footerCredit: "", // optional, e.g. "Site by Your Studio"
};
