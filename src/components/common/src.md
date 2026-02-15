unity-shop
├── src
│   ├── app
│   │   ├── (auth)                    # Authentication Routes (Grouped)
│   │   │   ├── login
│   │   │   │   └── page.jsx
│   │   │   ├── register
│   │   │   │   └── page.jsx
│   │   │   └── layout.jsx            # Auth specific layout
│   │   ├── (dashboard)               # Protected Dashboard Routes
│   │   │   ├── admin                 # ROLE: ADMIN (Full Control)
│   │   │   │   ├── users
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── page.jsx
│   │   │   │   └── layout.jsx
│   │   │   ├── manager               # ROLE: MANAGER (Operations & Logistics)
│   │   │   │   ├── orders
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── page.jsx
│   │   │   │   └── layout.jsx
│   │   │   ├── seller                # ROLE: SELLER (Product & Store)
│   │   │   │   ├── products
│   │   │   │   │   ├── add
│   │   │   │   │   │   └── page.jsx
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── orders
│   │   │   │   │   └── page.jsx
│   │   │   │   ├── page.jsx
│   │   │   │   └── layout.jsx
│   │   │   └── user                  # ROLE: USER (Shopping History)
│   │   │       ├── orders
│   │   │       │   └── page.jsx
│   │   │       ├── profile
│   │   │       │   └── page.jsx
│   │   │       └── layout.jsx
│   │   ├── api                       # Backend API Routes (Next.js API)
│   │   │   ├── auth
│   │   │   │   ├── [...nextauth]
│   │   │   │   │   └── route.js      # NextAuth.js handler
│   │   │   ├── admin
│   │   │   │   └── route.js          # Admin specific actions
│   │   │   ├── manager
│   │   │   │   └── route.js          # Manager specific actions
│   │   │   ├── seller
│   │   │   │   └── route.js          # Seller specific actions
│   │   │   ├── products
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.js
│   │   │   │   └── route.js
│   │   │   ├── orders
│   │   │   │   ├── [id]
│   │   │   │   │   └── route.js
│   │   │   │   └── route.js
│   │   │   └── users                 # User management endpoints
│   │   │       └── route.js
│   │   ├── cart
│   │   │   └── page.jsx
│   │   ├── checkout
│   │   │   └── page.jsx
│   │   ├── products
│   │   │   ├── [id]
│   │   │   │   └── page.jsx          # Single Product Details
│   │   │   └── page.jsx              # All Products Listing
│   │   ├── globals.css
│   │   ├── layout.jsx                 # Root Layout
│   │   ├── page.jsx                   # Homepage
│   │   └── not-found.jsx             # 404 Page
│   ├── components
│   │   ├── common                    # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   ├── home                      # Homepage specific components
│   │   │   ├── HeroSection.jsx
│   │   │   ├── FeaturedProducts.jsx
│   │   │   └── CategoryList.jsx
│   │   ├── product                   # Product related components
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductImageGallery.jsx
│   │   │   └── ProductFilters.jsx
│   │   ├── cart                      # Cart components
│   │   │   ├── CartItem.jsx
│   │   │   └── CartTotal.jsx
│   │   ├── checkout                  # Checkout components
│   │   │   ├── ShippingForm.jsx
│   │   │   └── PaymentGateway.jsx
│   │   └── dashboard                 # Dashboard widgets
│   │       ├── Sidebar.jsx
│   │       ├── StatCard.jsx
│   │       ├── seller
│   │       │   └── RevenueChart.jsx
│   │       ├── manager
│   │       │   └── LogisticsTable.jsx
│   │       └── RecentOrders.jsx
│   ├── contexts                      # React Context Global State
│   │   ├── AuthContext.js
│   │   ├── CartContext.js
│   │   └── UIContext.js              # For Sidebar/Modal toggles
│   ├── hooks                         # Custom React Hooks
│   │   ├── useFetch.js
│   │   ├── useAuth.js
│   │   ├── useCart.js
│   │   └── useDebounce.js            # Good for search inputs
│   ├── lib                           # Library configurations
│   │   ├── db.js                     # MongoDB Connection
│   │   └── auth.js                   # Auth Utilities (JWT/Session)
│   ├── models                        # Mongoose Models (Database Schema)
│   │   ├── User.js                   # Stores Admin, Manager, User info
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Seller.js                 # Specific Seller Profile info
│   │   └── Category.js
│   ├── utils                         # Helper functions
│   │   ├── formatDate.js
│   │   ├── formatCurrency.js
│   │   ├── apiResponse.js            # Standardized API responses
│   │   └── priceCalculator.js
│   └── middleware.js                 # Route Protection & Role Redirection
├── .env.local
├── .eslintrc.json
├── package.json
└── jsconfig.json                     # Absolute imports (@/components/...)