"use client";
// src/components/ai/AIProductPreview.jsx

import { useAuth } from "@/hooks/useAuth";
// src/components/ai/AIProductPreview.jsx

import { useState, useRef } from "react";
import Image from "next/image";
import {
  FiUpload,
  FiX,
  FiZap,
  FiDownload,
  FiRefreshCw,
  FiCheck,
  FiAlertCircle,
  FiImage,
  FiEye,
} from "react-icons/fi";

/**
 * AI Product Preview - Enhance product images for small businesses
 *
 * USAGE:
 * import AIProductPreview from "@/components/ai/AIProductPreview";
 *
 * <AIProductPreview
 *   onImageGenerated={(enhancedImageUrl) => {
 *     // Do something with the enhanced image
 *     setProductImages([...productImages, enhancedImageUrl]);
 *   }}
 * />
 *
 * FEATURES:
 * - Upload product image
 * - AI enhances image (removes background, adds shadows, improves lighting)
 * - Multiple style presets (Clean, Professional, Luxury, Minimal)
 * - Before/After comparison
 * - Download enhanced image
 * - Returns enhanced image URL to parent
 * - Standalone component without conflicts
 */

const AIProductPreview = ({ onImageGenerated, existingImages = [] }) => {
  const { token } = useAuth();
  const [originalImage, setOriginalImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("professional");
  const [showComparison, setShowComparison] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fileInputRef = useRef(null);

  // Style presets
  const styles = [
    {
      id: "professional",
      name: "Professional",
      description: "White background, soft shadows",
      icon: "💼",
    },
    {
      id: "clean",
      name: "Clean",
      description: "Pure white, no shadows",
      icon: "✨",
    },
    {
      id: "luxury",
      name: "Luxury",
      description: "Gradient background, dramatic lighting",
      icon: "👑",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Light gray background, subtle shadows",
      icon: "🎯",
    },
  ];

  // Handle file upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Read and display image
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target.result);
      setOriginalFile(file);
      setEnhancedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Enhance image with AI
  const handleEnhance = async () => {
    if (!originalFile) return;

    setLoading(true);
    setError(null);

    try {
      // Call AI API
      const formData = new FormData();
      formData.append("image", originalFile);
      formData.append("style", selectedStyle);

      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/ai/enhance-product-image", {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setEnhancedImage(data.enhancedImageUrl);
        setShowComparison(true);
      } else {
        throw new Error(data.error || "Enhancement failed");
      }
    } catch (err) {
      console.error("Enhancement error:", err);
      setError(err.message || "Failed to enhance image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use enhanced image
  const handleUseImage = () => {
    if (enhancedImage && onImageGenerated) {
      onImageGenerated(enhancedImage);
      setIsOpen(false);
      // Reset state
      setOriginalImage(null);
      setOriginalFile(null);
      setEnhancedImage(null);
      setShowComparison(false);
    }
  };

  // Download enhanced image
  const handleDownload = () => {
    if (!enhancedImage) return;

    const link = document.createElement("a");
    link.href = enhancedImage;
    link.download = `enhanced-product-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <FiZap size={18} />
        <span>AI Product Preview</span>
        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
          Beta
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>

              <div className="pr-12">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FiZap size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">AI Product Preview</h2>
                    <p className="text-sm text-indigo-100">
                      Enhance your product images with AI - Make them look
                      professional!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FiUpload size={20} className="text-indigo-600" />
                    Upload Your Product Image
                  </h3>

                  {!originalImage ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-200"
                    >
                      <div className="w-16 h-16 bg-indigo-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <FiImage size={32} className="text-indigo-600" />
                      </div>
                      <p className="text-gray-900 font-semibold mb-1">
                        Click to upload product image
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        PNG, JPG up to 5MB
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
                        <FiUpload size={16} />
                        Choose File
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                        <Image
                          src={originalImage}
                          alt="Original"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <button
                        onClick={() => {
                          setOriginalImage(null);
                          setOriginalFile(null);
                          setEnhancedImage(null);
                          setShowComparison(false);
                        }}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <FiX size={18} />
                      </button>
                      <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        Original Image
                      </div>
                    </div>
                  )}

                  {/* Style Selection */}
                  {originalImage && !enhancedImage && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FiEye size={18} className="text-indigo-600" />
                        Choose Enhancement Style
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {styles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              selectedStyle === style.id
                                ? "border-indigo-600 bg-indigo-50 shadow-md"
                                : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{style.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-semibold text-sm">
                                    {style.name}
                                  </h5>
                                  {selectedStyle === style.id && (
                                    <FiCheck
                                      size={14}
                                      className="text-indigo-600"
                                    />
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {style.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                      <FiAlertCircle
                        size={18}
                        className="text-red-600 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-sm font-semibold text-red-900">
                          Error
                        </p>
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preview Section */}
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FiZap size={20} className="text-purple-600" />
                    AI Enhanced Preview
                  </h3>

                  {!originalImage && !enhancedImage && (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                        <FiEye size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-1 font-medium">
                        Preview will appear here
                      </p>
                      <p className="text-sm text-gray-400">
                        Upload an image to get started
                      </p>
                    </div>
                  )}

                  {originalImage && !enhancedImage && (
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-12 text-center bg-indigo-50/50">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                          <FiZap size={32} className="text-indigo-600" />
                        </div>
                        <p className="text-gray-900 font-semibold mb-1">
                          Ready to enhance!
                        </p>
                        <p className="text-sm text-gray-600 mb-6">
                          Click the button below to apply AI enhancements
                        </p>
                        <button
                          onClick={handleEnhance}
                          disabled={loading}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {loading ? (
                            <>
                              <FiRefreshCw size={18} className="animate-spin" />
                              Enhancing...
                            </>
                          ) : (
                            <>
                              <FiZap size={18} />
                              Enhance with AI
                            </>
                          )}
                        </button>
                      </div>

                      {/* Feature List */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <h4 className="font-semibold text-sm text-blue-900 mb-2">
                          AI Enhancements Include:
                        </h4>
                        <ul className="space-y-1.5 text-sm text-blue-700">
                          <li className="flex items-center gap-2">
                            <FiCheck size={14} className="shrink-0" />
                            Background removal
                          </li>
                          <li className="flex items-center gap-2">
                            <FiCheck size={14} className="shrink-0" />
                            Professional lighting adjustment
                          </li>
                          <li className="flex items-center gap-2">
                            <FiCheck size={14} className="shrink-0" />
                            Color enhancement
                          </li>
                          <li className="flex items-center gap-2">
                            <FiCheck size={14} className="shrink-0" />
                            Shadow & depth effects
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {enhancedImage && (
                    <div className="space-y-4">
                      {/* Enhanced Image */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border-2 border-green-500 shadow-lg">
                        <Image
                          src={enhancedImage}
                          alt="Enhanced"
                          fill
                          className="object-contain"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1.5">
                          <FiCheck size={14} />
                          Enhanced by AI
                        </div>
                      </div>

                      {/* Comparison Toggle */}
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm font-medium text-gray-700">
                          Compare with original
                        </span>
                        <button
                          onClick={() => setShowComparison(!showComparison)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            showComparison ? "bg-indigo-600" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              showComparison ? "translate-x-6" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Comparison View */}
                      {showComparison && (
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                            <Image
                              src={originalImage}
                              alt="Original"
                              fill
                              className="object-contain"
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                              Before
                            </div>
                          </div>
                          <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-green-500">
                            <Image
                              src={enhancedImage}
                              alt="Enhanced"
                              fill
                              className="object-contain"
                            />
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                              After
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={handleUseImage}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <FiCheck size={18} />
                          Use This Image
                        </button>
                        <button
                          onClick={handleDownload}
                          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                          <FiDownload size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setEnhancedImage(null);
                            setShowComparison(false);
                          }}
                          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                        >
                          <FiRefreshCw size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default AIProductPreview;
