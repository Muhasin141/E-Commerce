import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

const HomePage = () => {
  // **TODO:** Replace this hardcoded mock with a variable from your context
  // e.g., const { state: { categories } } = useAppContext();
  const DYNAMIC_CATEGORIES = [
    {
      name: "Men Clothing",
      icon: "bi-person",
      route: "/products?category=men-clothing",
      backgroundImage:
        "url('https://i.pinimg.com/originals/ef/98/ba/ef98ba12df0a8d878852ad177c8a86f8.jpg')",
    },
    {
      name: "Women Clothing",
      icon: "bi-person-badge",
      route: "/products?category=women-clothing",
      backgroundImage:
        "url('https://serviceapp.sgp1.cdn.digitaloceanspaces.com/public/images/642e4ffd24219dcc9e70ecf6eac67543d7cdabcc9273b.png')",
    },
    {
      name: "Others", // Example for 'others' category
      icon: "bi-watch",
      route: "/products?category=other",
      backgroundImage:
        "url('https://tse1.mm.bing.net/th/id/OIP.rDIm-tYSoZVXgeunxAzxzgHaEK?pid=Api&P=0&h=180')",
    },
    {
      name: "Kids Clothing", // Example for 'others' category
      icon: "bi-watch",
      route: "/products?category=kids-clothing",
      backgroundImage:
        "url('https://chamsoctreemnw.com/wp-content/uploads/2023/04/size-150-cho-be-bao-nhieu-kg.jpg')",
    },
    {
      name: "Sports", // Example for 'others' category
      icon: "bi-watch",
      route: "/products?category=sports",
      backgroundImage:
        "url('https://content.jdmagicbox.com/comp/bangalore/y7/080pxx80.xx80.221018175931.y5y7/catalogue/khelya-sports-annapoorneswari-nagar-bangalore-sports-goods-dealers-itzztzzu76.jpg')",
    },
    {
      name: "Home", // Example for 'others' category
      icon: "bi-watch",
      route: "/products?category=home",
      backgroundImage:
        "url('https://media.architecturaldigest.com/photos/5f46b2dde73e57ccfed67771/master/pass/shop_website_1-024_FINAL_w.jpg')",
    },
  ];

  const navigate = useNavigate();

  const handleCategoryClick = (route) => {
    // Redirects to the product listing page with a category filter in the URL (query parameter)
    navigate(route);
  };

  return (
    // Use container-fluid for a full-width experience on large screens if desired,
    // but sticking to 'container' for centered content is generally best for e-commerce
    <div className="container text-center mt-5">
      <h1 className="mb-3 display-4 fw-bold">Discover Your Next Favorite</h1>
      <p className="lead text-muted mb-5">
        Shop across our curated selection of featured categories.
      </p>

      {/* --- Featured Categories Section (Feature 1) --- */}
      <h2 className="mb-4 text-start">Featured Categories</h2>

      {/* g-4 ensures good spacing on all devices */}
      <div className="row g-4 justify-content-center mb-5">
        {DYNAMIC_CATEGORIES.map((category) => (
          <div
            key={category.name}
            // ⭐ Refinement: Use col-12 for full width on all phones,
            // then col-md-6 (half) for tablets, and col-lg-3 (quarter) for large desktops.
            className="col-12 col-md-6 col-lg-3"
          >
            <div
              className="card text-decoration-none shadow-sm h-100 p-4 d-flex flex-column align-items-center justify-content-center transition-shadow"
              style={{
                minHeight: "200px",
                cursor: "pointer",
                color: "white",
                position: "relative",
                overflow: "hidden",
                // Added a small transition for hover effect
                transition: "transform 0.3s ease-in-out",
              }}
              onClick={() => handleCategoryClick(category.route)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {/* --- 1. Background Image Layer (z-index 0) --- */}
              <div
                className="position-absolute w-100 h-100"
                style={{
                  top: 0,
                  left: 0,
                  backgroundImage: category.backgroundImage,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  zIndex: 0,
                  // Add transition to image scaling for hover effect
                  transition: "transform 0.5s ease-in-out",
                }}
              ></div>

              {/* --- 2. Dark Overlay Layer (z-index 1) --- */}
              <div
                className="position-absolute w-100 h-100 bg-dark"
                style={{
                  top: 0,
                  left: 0,
                  opacity: 0.55, // Semi-transparent black layer for contrast
                  zIndex: 1,
                }}
              ></div>

              {/* --- 3. Content (Text and Icon) Layer (z-index 2) --- */}
              <i
                className={`bi ${category.icon} fs-1 mb-2`}
                style={{ position: "relative", zIndex: 2 }}
              ></i>
              <h5
                className="card-title mt-2"
                style={{ position: "relative", zIndex: 2 }}
              >
                {category.name}
              </h5>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-5" />

      {/* --- Placeholder for Featured Products/Banners --- */}
      <h2 className="mb-4 text-start">Today's Deals</h2>

      {/* g-4 ensures spacing between rows and columns */}
      <div className="row g-4 mb-5">
        {/* Large Promotional Banner (Image placeholder) */}
        {/* col-md-12 ensures it takes full width on all devices (default col-12) */}
        <div className="col-md-12">
          <div
            className="p-5 bg-info text-white rounded shadow-lg"
            style={{ minHeight: "200px" }}
          >
            <h3 className="display-6">50% Off Winter Collection!</h3>
            <p>Don't miss out on limited-time offers.</p>
            <Link to="/products" className="btn btn-warning btn-lg mt-2">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Small Feature Banners */}
        {/* col-md-6 ensures they stack on phones (col-12) and go side-by-side on tablets/desktops */}
        <div className="col-12 col-md-6">
          <div className="p-4 bg-light rounded text-start border h-100">
            <h4 className="text-dark">Free Shipping on All Orders</h4>
            <p className="text-muted mb-0">No minimum purchase required.</p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="p-4 bg-light rounded text-start border h-100">
            <h4 className="text-dark">New Arrivals Weekly</h4>
            <p className="text-muted mb-0">Check out the latest trends.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
