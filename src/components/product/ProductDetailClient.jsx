// components/product/ProductDetailClient.jsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiShoppingCart,
  FiHeart,
  FiMinus,
  FiPlus,
  FiStar,
  FiPackage,
} from 'react-icons/fi';
import { useCart } from '@/contexts/CartContext';

const ProductDetailClient = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { addToCart } = useCart();
  const router = useRouter();

  const placeholderImage =
    'https://via.placeholder.com/800x800?text=Product+Image';

  const getSafeImageUrl = () => {
    if (imageError) return placeholderImage;
    if (typeof product.image === 'string' && product.image.trim() !== '') {
      try {
        if (product.image.startsWith('/')) return product.image;
        new URL(product.image);
        return product.image;
      } catch {
        return placeholderImage;
      }
    }
    return placeholderImage;
  };

  const handleQuantityChange = delta => {
    const newQty = quantity + delta;
    const maxStock = product.stock || 999;
    if (newQty >= 1 && newQty <= maxStock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);

    // Brief "Added!" feedback, then navigate to cart
    setAddedFeedback(true);
    setTimeout(() => {
      router.push('/cart');
    }, 600);
  };

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : null;

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left column – Image */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden">
              <Image
                src={getSafeImageUrl()}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                onError={() => setImageError(true)}
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-full shadow-lg">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg">
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right column – Info */}
        <div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-24 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-sm text-gray-500">
                  Brand:{' '}
                  <span className="font-medium text-gray-700">
                    {product.brand}
                  </span>
                </p>
              )}
              {product.category && (
                <span className="inline-block mt-2 text-xs px-3 py-1 bg-stone-100 text-stone-600 rounded-full capitalize">
                  {product.category}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <FiStar
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating || 0} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-orange-600">
                  ${Number(product.price).toFixed(2)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <span className="text-lg text-gray-400 line-through">
                      ${Number(product.originalPrice).toFixed(2)}
                    </span>
                  )}
              </div>
              {discount && (
                <p className="text-sm text-emerald-600 font-medium mt-1">
                  You save ${(product.originalPrice - product.price).toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock */}
            {product.stock !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <FiPackage className="text-gray-400" />
                <span
                  className={
                    product.stock > 0
                      ? 'text-emerald-600 font-medium'
                      : 'text-red-500 font-medium'
                  }
                >
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : 'Out of stock'}
                </span>
              </div>
            )}

            {/* Quantity selector */}
            <div>
              <span className="text-sm text-gray-600 block mb-2">
                Quantity:
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  <FiMinus size={16} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={e =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(product.stock || 999, Number(e.target.value)),
                      ),
                    )
                  }
                  className="w-20 text-center border border-gray-200 rounded-lg px-2 py-1"
                  min={1}
                  max={product.stock || 999}
                />
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock || 999)}
                  className="p-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Total:</span>
              <span className="text-2xl font-bold text-orange-600">
                ${(product.price * quantity).toFixed(2)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addedFeedback}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FiShoppingCart />
                <span>
                  {addedFeedback ? 'Added! Redirecting...' : 'Add to Cart'}
                </span>
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="w-full py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-orange-300 transition-all flex items-center justify-center space-x-2"
              >
                <FiHeart
                  className={
                    isWishlisted ? 'fill-orange-500 text-orange-500' : ''
                  }
                />
                <span>
                  {isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                </span>
              </button>
            </div>

            {/* Seller Info */}
            {product.sellerName && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                    {product.sellerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {product.sellerName}
                    </p>
                    <p className="text-xs text-gray-500">Seller on UnityShop</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description section */}
      {product.description && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Description
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailClient;
