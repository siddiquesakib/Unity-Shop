// components/product/ProductDetailB2B.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SupplierCard from "./SupplierCard";
import {
  FiShoppingCart,
  FiMessageSquare,
  FiHeart,
  FiCheck,
  FiMinus,
  FiPlus,
} from "react-icons/fi";

const ProductDetailClient = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [quantity, setQuantity] = useState(product.moq);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= product.moq && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const getPriceForQuantity = (qty) => {
    // Find applicable price tier
    const tier = [...product.priceTiers]
      .reverse()
      .find((t) => qty >= t.quantity);
    return tier ? tier.price : product.priceTiers[0].price;
  };

  const currentPrice = getPriceForQuantity(quantity);

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "company", label: "Company Profile" },
    { id: "reviews", label: `Reviews (${product.reviews.length})` },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-orange-600">
              Products
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 font-medium truncate">{product.name}</li>
        </ol>
      </nav>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {/* Main image */}
            <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Thumbnail strip */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx
                      ? "border-orange-500"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle column - Product info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>

            {/* SKU & Brand */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <span>SKU: {product.sku}</span>
              {product.brand && <span>Brand: {product.brand}</span>}
            </div>

            {/* Price tiers */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Price tiers
              </h3>
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                {product.priceTiers.map((tier, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {tier.quantity}+ pieces
                    </span>
                    <span className="font-semibold text-orange-600">
                      ${tier.price.toFixed(2)} / piece
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MOQ */}
            <div className="mb-4">
              <span className="text-sm text-gray-600">
                Minimum Order Quantity:
              </span>
              <span className="ml-2 font-semibold">
                {product.moq} {product.unit}
              </span>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-4 space-y-3">
                {product.variants.map((variant) => (
                  <div key={variant.name}>
                    <span className="text-sm text-gray-600 block mb-1">
                      {variant.name}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() =>
                            setSelectedVariant({
                              ...selectedVariant,
                              [variant.name]: opt,
                            })
                          }
                          className={`px-3 py-1 text-sm border rounded-full transition ${
                            selectedVariant[variant.name] === opt
                              ? "border-orange-500 bg-orange-50 text-orange-700"
                              : "border-gray-200 hover:border-orange-300"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity selector */}
            <div className="mb-6">
              <span className="text-sm text-gray-600 block mb-1">
                Quantity:
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(-product.moq)}
                  disabled={quantity <= product.moq}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"
                >
                  <FiMinus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        product.moq,
                        Math.min(product.stock, Number(e.target.value)),
                      ),
                    )
                  }
                  className="w-20 text-center border border-gray-200 rounded-lg px-2 py-1"
                  min={product.moq}
                  max={product.stock}
                  step={product.moq}
                />
                <button
                  onClick={() => handleQuantityChange(product.moq)}
                  disabled={quantity >= product.stock}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-50"
                >
                  <FiPlus size={16} />
                </button>
                <span className="text-sm text-gray-500 ml-2">
                  (Available: {product.stock})
                </span>
              </div>
            </div>

            {/* Total price */}
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total price:</span>
                <span className="text-2xl font-bold text-orange-600">
                  ${(currentPrice * quantity).toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                (${currentPrice.toFixed(2)} × {quantity} pieces)
              </p>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center space-x-2">
                <FiMessageSquare />
                <span>Request Quote</span>
              </button>
              <button className="w-full py-3 border border-orange-500 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all flex items-center justify-center space-x-2">
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-full py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-orange-300 transition-all flex items-center justify-center space-x-2"
              >
                <FiHeart
                  className={
                    isWishlisted ? "fill-orange-500 text-orange-500" : ""
                  }
                />
                <span>
                  {isWishlisted ? "Saved to Wishlist" : "Save to Wishlist"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Supplier card */}
      <div className="lg:hidden">
        <SupplierCard supplier={product.supplier} />
      </div>

      {/* Tabs section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tab headers */}
        <div className="flex overflow-x-auto border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "text-orange-600 border-b-2 border-orange-600"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "description" && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.specifications.map((spec, idx) => (
                <div key={idx} className="flex border-b border-gray-100 py-2">
                  <span className="w-1/3 text-gray-600">{spec.label}:</span>
                  <span className="w-2/3 font-medium">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "company" && (
            <div className="max-w-3xl">
              <SupplierCard supplier={product.supplier} expanded />
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-orange-600">
                  {product.supplier.rating}
                </div>
                <div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= product.supplier.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Based on {product.supplier.reviewCount} reviews
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 pb-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{review.user}</div>
                      <div className="text-sm text-gray-500">{review.date}</div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <h4 className="font-medium mb-1">{review.title}</h4>
                    <p className="text-gray-600 text-sm">{review.content}</p>
                    {review.verifiedPurchase && (
                      <div className="flex items-center text-green-600 text-xs mt-2">
                        <FiCheck className="mr-1" /> Verified Purchase
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
