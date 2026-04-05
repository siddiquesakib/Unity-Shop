'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import AIProductPreview from '@/components/ai/AIProductPreview';
import {
  Plus,
  X,
  Info,
  DollarSign,
  Package,
  Tag as TagIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Calendar,
  Truck,
} from 'lucide-react';
import Image from 'next/image';

const MAX_IMAGES = 5;

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '1',
    image: '',
    images: [],
    endAt: '',
    weight: '',
    originCountry: '',
    originCity: '',
    length: '',
    width: '',
    height: '',
    shippingType: 'paid',
    hsCode: '',
    insideCityCost: '',
    outsideCityCost: '',
    deliveryDaysInside: '',
    deliveryDaysOutside: '',
    internationalStandardCost: '',
    internationalStandardDays: '',
    internationalExpressCost: '',
    internationalExpressDays: '',
  });

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false); // AI description state

  // Auction stock fix
  useEffect(() => {
    if (formData.category === 'auction') {
      setFormData(prev => ({ ...prev, stock: '1' }));
    }
  }, [formData.category]);

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'originalPrice') {
      if (value !== '' && Number(value) < 0) return;
    }

    if (name === 'stock') {
      if (formData.category === 'auction') return;
      if (value !== '' && Number(value) < 1) {
        setFormData(prev => ({ ...prev, [name]: '1' }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTag = e => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = tagToRemove => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageFileUpload = async e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const existing = formData.images?.length || 0;
    if (existing >= MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} photos.`);
      e.target.value = '';
      return;
    }

    const slotsLeft = MAX_IMAGES - existing;
    const selectedFiles = files.slice(0, slotsLeft);

    for (const file of selectedFiles) {
      if (!file.type.startsWith('image/')) {
        setError('Please select valid image files only.');
        e.target.value = '';
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Each image must be under 10MB.');
        e.target.value = '';
        return;
      }
    }

    setIsUploadingImage(true);
    setError('');

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        throw new Error('Session expired. Please login again.');
      }

      const uploadedUrls = [];

      for (const file of selectedFiles) {
        const fd = new FormData();
        fd.append('image', file);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fd,
        });

        const data = await res.json();

        if (!res.ok || !data?.imageUrl) {
          throw new Error(
            data?.message || data?.error || 'Image upload failed',
          );
        }

        uploadedUrls.push(data.imageUrl);
      }

      setFormData(prev => {
        const nextImages = [...(prev.images || []), ...uploadedUrls].slice(
          0,
          MAX_IMAGES,
        );
        return {
          ...prev,
          images: nextImages,
          image: nextImages[0] || '',
        };
      });

      if (files.length > slotsLeft) {
        setError(
          `Only first ${slotsLeft} image(s) were uploaded. Max ${MAX_IMAGES} allowed.`,
        );
      }
    } catch (err) {
      setError(err.message || 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeUploadedImage = indexToRemove => {
    setFormData(prev => {
      const nextImages = (prev.images || []).filter(
        (_, idx) => idx !== indexToRemove,
      );
      return {
        ...prev,
        images: nextImages,
        image: nextImages[0] || '',
      };
    });
  };

  const handleSubmit = async () => {
    setError('');

    const isAuction = formData.category === 'auction';
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.image ||
      !formData.originCountry ||
      !formData.originCity ||
      !formData.insideCityCost ||
      !formData.outsideCityCost ||
      !formData.deliveryDaysInside ||
      !formData.deliveryDaysOutside ||
      !formData.internationalStandardCost ||
      !formData.internationalStandardDays ||
      !formData.internationalExpressCost ||
      !formData.internationalExpressDays ||
      (isAuction && !formData.endAt)
    ) {
      setError(
        isAuction
          ? 'Product name, category, price, image, origin, shipping config, and auction end date are required.'
          : 'Product name, category, price, image, origin, and shipping config are required.',
      );
      return;
    }

    setIsLoading(true);

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (!token) {
        throw new Error('Session expired. Please login again.');
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice
          ? Number(formData.originalPrice)
          : null,
        stock: isAuction ? 1 : formData.stock ? Number(formData.stock) : 1,
        image: formData.image,
        images: formData.images,
        tags,
        badge: isAuction ? 'Auction' : null,
        rating: 0,
        reviews: 0,
        sellerName: user?.name || 'Unknown Seller',
        sellerEmail: user?.email || '',
        endAt: isAuction ? formData.endAt : null,
        weight: formData.weight ? parseFloat(formData.weight) : 0,
        dimensions: {
          length: formData.length ? parseFloat(formData.length) : 0,
          width: formData.width ? parseFloat(formData.width) : 0,
          height: formData.height ? parseFloat(formData.height) : 0,
        },
        origin: {
          country: formData.originCountry.trim(),
          city: formData.originCity.trim(),
        },
        shippingConfig: {
          local: {
            insideCityCost: Number(formData.insideCityCost),
            outsideCityCost: Number(formData.outsideCityCost),
            deliveryDaysInside: Number(formData.deliveryDaysInside),
            deliveryDaysOutside: Number(formData.deliveryDaysOutside),
          },
          international: {
            standard: {
              cost: Number(formData.internationalStandardCost),
              deliveryDays: Number(formData.internationalStandardDays),
            },
            express: {
              cost: Number(formData.internationalExpressCost),
              deliveryDays: Number(formData.internationalExpressDays),
            },
          },
        },
        shippingType: formData.shippingType,
        hsCode: formData.hsCode,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add product');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/seller');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // AI Description Generation
  const generateDescription = async () => {
    if (!formData.name) {
      setError('Please enter a product name first');
      return;
    }

    setIsGeneratingDesc(true);
    setError('');

    try {
      const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/ai/generate-description`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            brand: formData.brand,
            price: formData.price,
            imageUrl: formData.image,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        // Handle rate limit specifically
        if (res.status === 429) {
          setError(
            'AI service is busy (rate limit). Please try again in a few minutes.',
          );
          // Optionally set a fallback description
          setFormData(prev => ({
            ...prev,
            description: `${prev.name} – a high-quality product from our collection. Perfect for your needs.`,
          }));
        } else {
          throw new Error(data.error || 'Generation failed');
        }
        return;
      }

      // Remove any trailing hashtags, "Tags:", or "Keywords:" block that AI might generate
      let cleanDescription = data.description
        .replace(/<p>\s*<strong>(?:Tags|Keywords):?<\/strong>.*<\/p>/gi, '')
        .replace(
          /(?:<br\s*\/?>)?\s*<strong>(?:Tags|Keywords):?<\/strong>.*$/gi,
          '',
        )
        .replace(/<p>\s*(?:Tags|Keywords):?.*<\/p>/gi, '')
        .replace(/#[\w-]+/g, '')
        .trim();

      // Clean up empty paragraphs
      cleanDescription = cleanDescription.replace(/<p>\s*<\/p>/g, '').trim();

      setFormData(prev => ({ ...prev, description: cleanDescription }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={40} className="text-emerald-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Product Published!
        </h2>
        <p className="text-gray-500">Your product is now live on UnityShop.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Add New Product
          </h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to list a new product.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 shadow-lg font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Publishing...
              </>
            ) : (
              <>
                <Plus size={18} /> Publish Product
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-500" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <Info size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Product Name"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-gray-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="home & living">Home & Living</option>
                    <option value="beauty">Beauty</option>
                    <option value="watches">Watches</option>
                    <option value="toys & baby">Toys & Baby</option>
                    <option value="mobiles">Mobiles</option>
                    <option value="gaming">Gaming</option>
                    <option value="sports">Sports</option>
                    <option value="books">Books</option>
                    <option value="grocery">Grocery</option>
                    <option value="health">Health</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="office">Office</option>
                    <option value="audio">Audio</option>
                    <option value="stationery">Stationery</option>
                    <option value="tools">Tools</option>
                    <option value="toys">Toys</option>
                    <option value="auction">Auction</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Brand Name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Product Description
                  </label>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={isGeneratingDesc || !formData.name}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingDesc ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={8}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product features, materials, and benefits... or click 'Generate with AI' to auto-write a description."
                  className="w-full min-h-[160px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-y"
                />
              </div>
            </div>
          </section>

          <section className="p-8 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-500">
                <ImageIcon size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Product Image</h2>
            </div>
            <div className="space-y-4">
              <label className="block">
                <div className="w-full border-2 border-dashed border-gray-300 hover:border-gray-500 rounded-xl px-4 py-8 text-center cursor-pointer transition-colors bg-gray-50/60">
                  <p className="text-sm font-semibold text-gray-700">
                    {isUploadingImage
                      ? 'Uploading image...'
                      : 'Click to upload product photos'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WEBP (max 10MB each, up to 5 photos)
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2">
                    Uploaded: {formData.images.length}/{MAX_IMAGES}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFileUpload}
                  disabled={
                    isUploadingImage || formData.images.length >= MAX_IMAGES
                  }
                  className="hidden"
                />
              </label>

              {isUploadingImage && (
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Uploading to
                  media server...
                </p>
              )}

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {formData.images.map((img, idx) => (
                    <div
                      key={`${img}-${idx}`}
                      className="relative w-full aspect-square"
                    >
                      <Image
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        fill
                        className="object-cover rounded-xl border"
                      />
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black text-white font-semibold">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(idx)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
                        title="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <AIProductPreview
                onImageGenerated={url => {
                  setFormData(prev => {
                    const existing = prev.images || [];
                    if (existing.length >= MAX_IMAGES) return prev;
                    const nextImages = [...existing, url];
                    return {
                      ...prev,
                      images: nextImages,
                      image: nextImages[0] || '',
                    };
                  });
                }}
              />
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <section className="p-6 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500">
                <DollarSign size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Pricing & Inventory
              </h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {formData.category === 'auction'
                    ? 'Starting Bid ($)'
                    : 'Price ($)'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                  <DollarSign
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <AnimatePresence>
                {formData.category === 'auction' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-semibold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={14} /> Auction End Date *
                      </label>
                      <input
                        type="datetime-local"
                        name="endAt"
                        value={formData.endAt}
                        onChange={handleChange}
                        className="w-full bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Stock Quantity
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="stock"
                    min="1"
                    value={formData.stock}
                    onChange={handleChange}
                    readOnly={formData.category === 'auction'}
                    className={`w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200 ${formData.category === 'auction' ? 'opacity-60 cursor-not-allowed bg-gray-100 text-gray-500' : ''}`}
                  />
                  <Package
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
                {formData.category === 'auction' && (
                  <p className="text-[10px] text-amber-600 font-medium">
                    * Auction stock is fixed to 1.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                <Truck size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Shipping Info</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Weight (Kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="weight"
                  step="0.1"
                  min="0"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 0.5"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="length"
                    placeholder="L"
                    value={formData.length}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                  <input
                    type="number"
                    name="width"
                    placeholder="W"
                    value={formData.width}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                  <input
                    type="number"
                    name="height"
                    placeholder="H"
                    value={formData.height}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Shipping Type
                </label>
                <select
                  name="shippingType"
                  value={formData.shippingType}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="paid">Paid Shipping</option>
                  <option value="free">Free Shipping</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  HS Code (Optional)
                </label>
                <input
                  type="text"
                  name="hsCode"
                  value={formData.hsCode}
                  onChange={handleChange}
                  placeholder="Customs HS Code"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Origin Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="originCountry"
                  value={formData.originCountry}
                  onChange={handleChange}
                  placeholder="e.g. Bangladesh"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Origin City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="originCity"
                  value={formData.originCity}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Local Shipping (Inside City / Outside City)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="insideCityCost"
                    min="0"
                    value={formData.insideCityCost}
                    onChange={handleChange}
                    placeholder="Inside City Cost"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                  <input
                    type="number"
                    name="outsideCityCost"
                    min="0"
                    value={formData.outsideCityCost}
                    onChange={handleChange}
                    placeholder="Outside City Cost"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="deliveryDaysInside"
                    min="1"
                    value={formData.deliveryDaysInside}
                    onChange={handleChange}
                    placeholder="Delivery Days (Inside)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                  <input
                    type="number"
                    name="deliveryDaysOutside"
                    min="1"
                    value={formData.deliveryDaysOutside}
                    onChange={handleChange}
                    placeholder="Delivery Days (Outside)"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  International Shipping (Standard / Express)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="internationalStandardCost"
                    min="0"
                    value={formData.internationalStandardCost}
                    onChange={handleChange}
                    placeholder="Standard Cost"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                  <input
                    type="number"
                    name="internationalStandardDays"
                    min="1"
                    value={formData.internationalStandardDays}
                    onChange={handleChange}
                    placeholder="Standard Days"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="internationalExpressCost"
                    min="0"
                    value={formData.internationalExpressCost}
                    onChange={handleChange}
                    placeholder="Express Cost"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                  <input
                    type="number"
                    name="internationalExpressDays"
                    min="1"
                    value={formData.internationalExpressDays}
                    onChange={handleChange}
                    placeholder="Express Days"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="p-6 rounded-2xl bg-white border border-gray-200 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-500">
                <TagIcon size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Tags</h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 text-xs border border-gray-200"
                  >
                    {tag}{' '}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={addTag}
                placeholder="Add tag..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
