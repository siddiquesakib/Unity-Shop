unity-shop/
├── .env.local                                    # Environment variables (API URL, NextAuth secrets, etc.)
├── .gitignore
├── eslint.config.mjs                             # ESLint flat config
├── jsconfig.json                                 # Absolute imports (@/* → ./src/*)
├── next.config.mjs                               # Next.js config (framer-motion transpile, remote images)
├── package.json                                  # Next 16, React 19, NextAuth, Socket.io, Recharts, jsPDF
├── postcss.config.mjs                            # PostCSS + Tailwind v4
├── README.md
│
├── public/
│   ├── unityshop.png                             # Brand logo
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── images/
│       └── hero-image.jpg                        # Hero carousel fallback
│
└── src/
    │
    ├── app/                                      # Next.js App Router
    │   ├── globals.css                           # Tailwind v4 + CSS variables (light/dark), custom animations
    │   ├── layout.jsx                            # Root layout — wraps providers: NextAuth → Auth → Socket → Notification → Cart → Language, includes Navbar + Footer + Toaster
    │   ├── NextAuthProvider.jsx                  # SessionProvider wrapper (duplicate of providers/)
    │   ├── page.jsx                              # Homepage — composes: HeroCarousel, FeaturesStrip, CategoryGrid, FlashDeals, FeaturedProducts, PromoBanners, NewArrivals, ShopByBrand, Testimonials, TradeAssuranceBanner, BrandMarquee
    │   ├── favicon.ico
    │   │
    │   ├── (auth)/                               # Auth Route Group (no layout prefix in URL)
    │   │   ├── layout.jsx                        # Simple wrapper div
    │   │   ├── login/
    │   │   │   └── page.jsx                      # Email/password + Google login, split-panel design
    │   │   ├── register/
    │   │   │   └── page.jsx                      # Registration with email verification flow
    │   │   ├── forgot-password/
    │   │   │   └── page.jsx                      # Send reset link via API
    │   │   ├── reset-password/
    │   │   │   └── page.jsx                      # Password reset with strength indicator, token from URL
    │   │   └── verify-email/
    │   │       └── page.jsx                      # Auto-verify via NextAuth credentials with loginToken
    │   │
    │   ├── (payment)/                            # Payment Route Group
    │   │   ├── payment-cancel/
    │   │   │   └── page.jsx                      # Stripe cancellation page with retry/home buttons
    │   │   └── payment-success/
    │   │       └── page.jsx                      # Verifies Stripe session, clears cart, shows order details
    │   │
    │   ├── about/
    │   │   └── page.jsx                          # Hero, stats, values, story, team section (framer-motion 3D tilt cards)
    │   │
    │   ├── api/
    │   │   └── auth/
    │   │       └── [...nextauth]/
    │   │           └── route.js                  # NextAuth config — Google + Credentials providers, JWT callbacks, role/sellerRequest/backendToken in session
    │   │
    │   ├── cart/
    │   │   └── page.jsx                          # Full cart — seller-grouped items, select all/per-seller/per-item checkboxes, qty controls, promo code, order summary
    │   │
    │   ├── checkout/
    │   │   └── page.jsx                          # Checkout review — step indicator, seller-grouped breakdown, promo code, PaymentButton, trust badges
    │   │
    │   ├── contact/
    │   │   └── page.jsx                          # Contact form + info strip + FAQ sidebar + urgent help CTA
    │   │
    │   ├── dashboard/                            # Protected Dashboard (role-based routing)
    │   │   ├── layout.jsx                        # Auth guard + role enforcement + Sidebar + Topbar layout
    │   │   ├── page.jsx                          # Auto-redirect to role-specific dashboard
    │   │   │
    │   │   ├── admin/                            # ROLE: ADMIN (Full Control)
    │   │   │   ├── page.jsx                      # Admin hub — AdminStats, PlatformChart, VerificationQueue, recent orders
    │   │   │   ├── sellers/
    │   │   │   │   └── page.jsx                  # Seller requests management — pending/approved/rejected tabs, approve/reject actions
    │   │   │   └── users/
    │   │   │       └── page.jsx                  # All users management — renders AllUsers component
    │   │   │
    │   │   ├── manager/                          # ROLE: MANAGER (Operations & Logistics)
    │   │   │   ├── page.jsx                      # Manager hub — ManagerOverview, fulfillment bars, platform summary, recent orders
    │   │   │   ├── fulfillment/
    │   │   │   │   └── page.jsx                  # Order fulfillment — search, status filter, orders table, status update, detail modal
    │   │   │   ├── marketing/
    │   │   │   │   └── page.jsx                  # Coming soon — coupon management, flash sales, featured products
    │   │   │   ├── sellers/
    │   │   │   │   └── page.jsx                  # Seller requests (same as admin/sellers)
    │   │   │   └── stats/
    │   │   │       └── page.jsx                  # Platform statistics — 6 stat cards, revenue/orders charts, order status breakdown
    │   │   │
    │   │   ├── seller/                           # ROLE: SELLER (Product & Store)
    │   │   │   ├── page.jsx                      # Seller hub — SellerStats, SalesChart, SellerOrders, ProductsTable
    │   │   │   ├── add-product/
    │   │   │   │   └── page.jsx                  # Add product form — basic info, image URL, pricing/inventory, tags, seller info
    │   │   │   ├── orders/
    │   │   │   │   └── page.jsx                  # Seller orders — search, status filter, status update, invoice download, detail modal
    │   │   │   └── products/
    │   │   │       └── page.jsx                  # Seller products listing — renders ProductsTable
    │   │   │
    │   │   └── user/                             # ROLE: USER (Shopping & Profile)
    │   │       ├── page.jsx                      # User hub — greeting, UserStats, RecentOrders, UserProfile, WishlistPreview
    │   │       ├── orders/
    │   │       │   └── page.jsx                  # Order history — search, status filters, invoice download, detail modal
    │   │       ├── profile/
    │   │       │   └── page.jsx                  # Profile — edit mode, avatar, personal info, address/bio, account info
    │   │       └── wishlist/
    │   │           └── page.jsx                  # Wishlist grid — search, product cards, remove functionality
    │   │
    │   ├── products/
    │   │   ├── page.jsx                          # All products listing — Suspense + ProductsClient
    │   │   └── [id]/
    │   │       └── page.jsx                      # Single product detail — server component, fetches by ID, renders ProductDetailClient
    │   │
    │   └── search/
    │       └── page.jsx                          # Search page — SearchFilters sidebar, SearchResults, mobile filter drawer, Suspense
    │
    ├── components/
    │   │
    │   ├── checkout/                             # Checkout flow components
    │   │   ├── OrderReview.jsx                   # Order review step — shipping/payment summary, items list, terms, place order
    │   │   ├── PaymentForm.jsx                   # Payment method selector — credit card / PayPal / bank transfer
    │   │   ├── PaymentGateway.jsx                # (Empty — reserved for gateway integration)
    │   │   └── ShippingForm.jsx                  # Shipping info form — name, phone, address, city, state, zip, country
    │   │
    │   ├── common/                               # Shared/reusable UI components
    │   │   ├── Button.jsx                        # Generic button (placeholder)
    │   │   ├── Footer.jsx                        # Site footer — newsletter, link columns, socials, bottom bar
    │   │   ├── Navbar.jsx                        # Main navbar — search bar with category, cart badge, user menu, language switcher, notifications, mobile drawer
    │   │   ├── NotificationListener.jsx          # Real-time notification listener (Socket.io)
    │   │   ├── src.md                            # This file — project structure documentation
    │   │   └── payment-button/
    │   │       └── PaymentButton.jsx             # Stripe checkout button — creates session via API, redirects to Stripe
    │   │
    │   ├── dashboard/                            # Dashboard shared + role-specific widgets
    │   │   ├── Sidebar.jsx                       # Collapsible sidebar — role-based menu items, seller request button
    │   │   ├── Topbar.jsx                        # Dashboard top bar — search, notifications, user avatar menu
    │   │   │
    │   │   ├── admin/                            # Admin dashboard widgets
    │   │   │   ├── AdminStats.jsx                # Admin stat cards (users, products, orders, revenue)
    │   │   │   ├── AllUsers.jsx                  # Users management table with role actions
    │   │   │   ├── PlatformChart.jsx             # Platform analytics chart (Recharts)
    │   │   │   └── VerificationQueue.jsx         # Pending seller verification queue
    │   │   │
    │   │   ├── manager/                          # Manager dashboard widgets
    │   │   │   └── ManagerOverview.jsx           # Manager overview stats & charts
    │   │   │
    │   │   ├── seller/                           # Seller dashboard widgets
    │   │   │   ├── ProductsTable.jsx             # Seller's products table with edit/delete
    │   │   │   ├── SalesChart.jsx                # Sales performance chart (Recharts)
    │   │   │   ├── SellerOrders.jsx              # Seller's recent orders widget
    │   │   │   └── SellerStats.jsx               # Seller stat cards (products, orders, revenue, rating)
    │   │   │
    │   │   └── user/                             # User dashboard widgets
    │   │       ├── RecentOrders.jsx              # Recent orders summary widget
    │   │       ├── UserProfile.jsx               # Profile summary card
    │   │       ├── UserStats.jsx                 # User stat cards (orders, wishlist, reviews)
    │   │       └── WishlistPreview.jsx           # Wishlist preview grid
    │   │
    │   ├── home/                                 # Homepage section components
    │   │   ├── BrandMarquee.jsx                  # Infinite scrolling brand logos
    │   │   ├── categories.js                     # Category data array with icons/colors
    │   │   ├── CategoryGrid.jsx                  # Category browsing grid
    │   │   ├── FeaturedProducts.jsx              # Featured products carousel/grid
    │   │   ├── FeaturesStrip.jsx                 # Features/benefits strip (shipping, support, etc.)
    │   │   ├── FlashDeals.jsx                    # Flash deals with countdown timer
    │   │   ├── HeroCarousel.jsx                  # Hero banner carousel with animations
    │   │   ├── NewArrivals.jsx                   # New arrivals product section
    │   │   ├── PromoBanners.jsx                  # Promotional banner cards
    │   │   ├── ShopByBrand.jsx                   # Shop by brand section
    │   │   ├── Testimonials.jsx                  # Customer testimonials/reviews
    │   │   └── TradeAssuranceBanner.jsx          # Trade assurance/trust banner
    │   │
    │   ├── product/                              # Product-related components
    │   │   ├── ProductCard.jsx                   # Product card — image, price, rating, add to cart, wishlist
    │   │   ├── ProductDetailClient.jsx           # Product detail page client — gallery, specs, reviews, add to cart
    │   │   ├── ProductFilters.jsx                # Product listing filters — category, price range, rating, sort
    │   │   ├── ProductsClient.jsx                # Products page client — fetches products, pagination, filters
    │   │   └── SupplierCard.jsx                  # Supplier/seller info card
    │   │
    │   ├── promoCode/                            # Promo code system
    │   │   ├── PromoCodeInput.jsx                # Promo code input & validation component
    │   │   └── promoCodes.js                     # Promo code definitions & validation logic
    │   │
    │   ├── providers/                            # React providers
    │   │   └── NextAuthProvider.jsx              # NextAuth SessionProvider wrapper
    │   │
    │   ├── search/                               # Search components
    │   │   ├── SearchFilters.jsx                 # Search filters sidebar (category, price, rating)
    │   │   └── SearchResults.jsx                 # Search results grid with product cards
    │   │
    │   └── ui/                                   # shadcn/ui primitives
    │       ├── badge.jsx                         # Badge component (class-variance-authority)
    │       ├── button.jsx                        # Button component (CVA + Radix Slot)
    │       └── card.jsx                          # Card, CardHeader, CardTitle, CardContent, CardFooter
    │
    ├── contexts/                                 # React Context — Global State Management
    │   ├── AuthContext.jsx                       # Auth state — login, register, googleLogin, logout, requestSeller, role-based routing (NextAuth session)
    │   ├── CartContext.jsx                       # Cart state — seller-grouped items, add/remove/update, checkout prep, promo, localStorage persistence
    │   ├── LanguageContext.jsx                   # i18n — 4 languages (en, bn, hi, ar), translation function t(), localStorage persistence
    │   ├── NotificationContext.jsx               # Notifications — fetch/create/mark-read/delete, Socket.io real-time updates, optimistic UI
    │   └── SocketContext.jsx                     # Socket.io client — connects on session, joins email/user rooms
    │
    ├── hooks/                                    # Custom React Hooks
    │   ├── useAuth.js                            # Re-exports useAuth from AuthContext
    │   ├── useCart.js                             # Re-exports useCart from CartContext
    │   └── useClickOutside.js                    # Click-outside detection for dropdowns/modals
    │
    ├── lib/                                      # Library utilities
    │   └── utils.js                              # cn() — clsx + tailwind-merge helper
    │
    └── utils/                                    # Helper functions
        ├── generateInvoice.js                    # PDF invoice generator using jsPDF (header, customer/seller info, items table, totals, status badge)
        └── translations.js                       # Translation strings for 4 languages (en, bn, hi, ar) + languages array