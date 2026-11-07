# PowerRent – Generator Rental Service Website

PowerRent is a complete, modern, premium-quality, professional, and fully responsive generator rental service website and customer portal. Engineered for residential, commercial, industrial, construction sites, outdoor events, and emergency power backup requirements.

---

## 🚀 Key Features

- **27 Complete Pages**: Public business pages, dynamic equipment catalog, live rental booking engine, customer authentication portal, and protected customer dashboard.
- **Dynamic Capacity Fleet**: 12 detailed generator models spanning 5–20 kVA, 25–50 kVA, 60–100 kVA, 125–250 kVA, 300–500 kVA, and Above 500 kVA.
- **Real-Time Booking Engine**:
  - Live duration calculator with past-date prevention.
  - Automatic weekly (10%) and monthly (20%) volume discounts.
  - Transparent breakdown of equipment base hire, security deposit, crane delivery fee, and optional add-ons.
  - Unique booking reference generator (e.g. `PR-2026-XXXXX`).
  - Automatic invoice generation synced with booking details.
- **Frontend Authentication & State Persistence**:
  - Browser-local account registration and authentication using salted PBKDF2 password hashes in `localStorage`.
  - Successful registration saves the account and redirects to the Customer Portal Login page. Successful login validates the saved credentials, displays a confirmation, and redirects to the home page.
- **Customer Dashboard**:
  - Overview with live KPI stats cards, telemetry connectivity status, and quick shortcuts.
  - "My Bookings" with live search and status filters (Active, Confirmed, Completed).
  - "Active Rentals" showing on-site runtime hours, telemetry fuel level, and extension requests.
  - "Rental History" with re-booking shortcuts.
  - "Invoices" and printable/downloadable "Invoice Details" matching booking records.
  - "My Profile" with editable user details.
- **Theme & Direction Controls**:
  - Dark Mode and Light Mode toggle with persistent state.
  - LTR and RTL text direction toggle with custom styling overrides.
- **Strict Brand Design**:
  - Primary Dark Navy: `#101C2C` (used identically on navbar and footer).
  - Secondary Charcoal: `#252B33`.
  - Accent Industrial Orange: `#F59E0B`.
  - Background Light Grey: `#F4F6F8`.
  - Pure Vanilla JavaScript, Bootstrap 5, Bootstrap Icons.

---

## 📂 Project Structure

```
power-rent/
│
├── index.html                     # Home Page 1 – Industrial Main Landing Page
├── home-2.html                    # Home Page 2 – Commercial & Events Alternative
├── README.md                      # Project documentation and user guide
│
├── pages/
│   ├── about.html                 # Company background, mission, vision & achievements
│   ├── team.html                  # Certified electrical engineers and technician leadership
│   ├── generator-details.html     # Dynamic specifications, acoustic ratings & booking link
│   ├── services.html              # 8 specialized generator rental service cards
│   ├── service-details.html       # Dynamic service scope, applications & recommendations
│   ├── pricing.html               # Daily, weekly, monthly rate cards and comparison table
│   ├── booking.html               # Live generator booking calculator & reservation form
│   ├── booking-confirmation.html  # Booking reference ID & order summary
│   ├── contact.html               # 24/7 dispatch hotline, contact form & interactive map
│   ├── faq.html                   # Categorized interactive FAQ accordion
│   ├── blog.html                  # 6 technical industry articles & sizing guides
│   ├── blog-details.html          # Dynamic article viewer & engineering advice
│   ├── 404.html                   # 404 error page with quick search
│   └── coming-soon.html           # Solar hybrid microgrid expansion & countdown
│
├── auth/
│   ├── login.html                 # Customer login with password visibility toggle
│   ├── register.html              # Account registration with password match validation
│   └── forgot-password.html       # Password reset request form
│
├── customer/
│   ├── dashboard.html             # Protected dashboard overview with KPI metric cards
│   ├── my-bookings.html           # Rental bookings list with status filters & search
│   ├── active-rentals.html        # On-site equipment tracking, run hours & telemetry
│   ├── rental-history.html        # Archived completed deployments with re-rent buttons
│   ├── invoices.html              # Billing statements and payment status tracking
│   ├── invoice-details.html       # Printable & downloadable official invoice statements
│   └── profile.html               # Customer profile editor with localStorage persistence
│
├── components/
│   ├── navbar.html                # Reusable global navigation reference
│   ├── footer.html                # Reusable global footer reference
│   ├── dashboard-sidebar.html     # Reusable customer dashboard sidebar reference
│   └── preloader.html             # High-energy turbine preloader reference
│
└── assets/
    ├── css/
    │   ├── bootstrap.min.css      # Bootstrap 5.3.3 framework
    │   ├── bootstrap-icons.css    # Bootstrap Icons 1.11.3
    │   ├── style.css              # Main design stylesheet & industrial color palette
    │   ├── dark-mode.css          # Dark theme overrides across all components
    │   ├── dashboard.css          # Customer portal & print invoice styling
    │   └── responsive.css         # Responsive breakpoints & RTL direction rules
    │
    ├── js/
    │   ├── bootstrap.bundle.min.js# Bootstrap 5 JavaScript components
    │   ├── main.js                # Preloader, form submission & countdown controller
    │   ├── theme.js               # Dark/Light mode manager (localStorage)
    │   ├── direction.js           # LTR/RTL text direction switcher (localStorage)
    │   ├── generator.js           # 12-model generator fleet database & utility methods
    │   ├── filters.js             # Fleet search, category filters & price sorting
    │   ├── booking.js             # Real-time rental price calculator & order persistence
    │   ├── authentication.js      # Session management & dashboard access protection
    │   ├── dashboard.js           # Dashboard KPIs, bookings filter & profile update
    │   ├── invoice.js             # Invoice list and printable detail renderer
    │   └── validation.js          # Reusable form validation helpers
    │
    └── images/
        ├── logo/                  # Vector SVG brand logo and favicon
        ├── hero/                  # High-resolution industrial hero backdrops
        ├── generators/            # 12 crisp generator equipment photos
        ├── services/              # 8 service application photography assets
        ├── about/                 # Heavy equipment and operational photos
        ├── team/                  # Executive and field engineer portraits
        ├── testimonials/          # Client avatar photos
        └── blog/                  # Technical article featured images
```

---

---

## 🛠️ Verification & Testing Guide

Authentication accounts are stored in the current browser and passwords are stored as salted PBKDF2 hashes. This static front-end has no authentication server; browser-local accounts are for local testing only and are not suitable for production identity or access control.

1. **Public Site Navigation**:
   - Open `index.html` in any modern web browser.
   - Verify the sticky navbar, Home dropdown, Services link, Dark/Light mode toggle, and LTR/RTL toggle.
2. **Generator Listings & Booking**:
   - Browse featured generators on the home pages or choose a generator from the booking form.
   - Click "Details" to open `pages/generator-details.html?id=...` with full specifications.
3. **Booking & Invoice Flow**:
   - Click "Book Now" to load `pages/booking.html?id=...`.
   - Adjust dates to see live price updates with automatic duration calculations and weekly/monthly discounts.
   - Submit the booking form to receive an instant reference on `pages/booking-confirmation.html`.
   - Click "View Official Invoice" or "View in My Bookings".
4. **Authentication & Protected Dashboard**:
   - Create an account at `auth/register.html`, then sign in at `auth/login.html` with the account you registered in the same browser.
   - Notice the customer remains on the login page, an authentication alert is presented, and the navbar updates with "Logout" and "Dashboard".
   - Click "Dashboard" to enter `customer/dashboard.html`.
   - Explore "My Bookings", "Active Rentals", "Invoices", and click "Print Invoice" on `customer/invoice-details.html`.

---

© 2026 PowerRent Inc. All rights reserved.
