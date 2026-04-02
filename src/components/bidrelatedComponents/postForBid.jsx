import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiCheck, FiChevronRight, FiClock, FiX, FiZap } from "react-icons/fi";

const PostaBId = ({ product }) => {
  const { formatPrice } = useCurrency();
  const [bidAmount, setBidAmount] = React.useState("");
  const [bidError, setBidError] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState("");
  const [isBidsuccess, setIsBidSuccess] = useState(false);
  const { user } = useAuth();
  const postBid = (item, currentUser) => {
    if (!user) {
      setBidError("You must be logged in to place a bid");
      return;
    }
    axios
      .patch(`${process.env.NEXT_PUBLIC_API_URL}/bids/${item._id}`, {
        newBid: bidAmount,
        bidderEmail: currentUser.email,
        bidderName: currentUser.name,
        bidderImage: currentUser.image,
      })
      .then((response) => {
        console.log(response.data);
        setIsBidSuccess(true);
        setTimeout(() => setIsBidSuccess(false), 3000);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };
  // effets are here 
  // useEffect(() => {
  //   axios
  //     .patch(`${process.env.NEXT_PUBLIC_API_URL}/bids/${product.id}`, { amount: bidAmount })
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching products:", error);
  //     });
  // }, []);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(product.endAt).getTime();

      const gap = end - now;
      if (gap <= 0) {
        setTimeLeft("AUCTION ENDED");
        return;
      }

      const d = Math.floor(gap / (1000 * 60 * 60 * 24));
      const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((gap % (1000 * 60)) / 1000);

      setTimeLeft(`${d > 0 ? d + "d " : ""}${h}h ${m}m ${s}s`);
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();

    return () => clearInterval(timer);
  }, [product.endAt]);

  return (
    <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 space-y-4 shadow-sm">
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
          <FiClock className="text-amber-600 animate-pulse" size={16} />
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-tighter">
            Auction Ends In:
          </span>
        </div>
        <div className="font-mono font-black text-amber-700 text-sm">
          {timeLeft || "Calculating..."}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-1.5 text-amber-700 font-black text-xs uppercase tracking-widest">
          <FiZap className="fill-amber-500 text-amber-500 animate-pulse" /> Live
          Auction
        </span>
        <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
          Lot Size: 1 Pcs
        </span>
      </div>
      <div className="space-y-2">
        {timeLeft !== "AUCTION ENDED" ? (
          /* ───── নিলাম চলাকালীন ইনপুট ফিল্ড ───── */
          <>
            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">
              Place Your Bid (Min: {formatPrice(product.currentHighestBId + 1)})
            </label>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 pointer-events-none">
                  {formatPrice(0).replace(/[0-9.,\s]/g, "")}
                </span>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBidAmount(val);

                    // টাইপ করার সময় সাথে সাথে এরর চেক
                    if (
                      val &&
                      parseInt(val) >=
                        parseInt(product.price || product.currentHighestBId)
                    ) {
                      setBidError("");
                    }
                  }}
                  placeholder="Enter amount"
                  className={`w-full h-12 pl-10 pr-4 rounded-xl border-2 outline-none font-bold text-lg transition-all ${
                    bidError
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-amber-500"
                  }`}
                />
              </div>
              <button
                onClick={() => {
                  // ইনপুট এবং প্রাইস দুটোকেই পূর্ণসংখ্যায় কনভার্ট করা হলো
                  const userBidValue = parseInt(bidAmount);
                  const minimumRequired = parseFloat(
                    formatPrice(product.price).replace(/[^0-9 .]/g, ""),
                  );
                  if (!bidAmount || isNaN(userBidValue)) {
                    setBidError("Please enter a valid amount");
                  } else if (userBidValue < minimumRequired) {
                    setBidError(
                      `Minimum bid is ${formatPrice(0).replace(/[0-9.,\s]/g, "")}${minimumRequired}`,
                    );
                  } else {
                    setBidError("");
                    // alert(
                    //   `Success! Bid of ${formatPrice(0).replace(/[0-9.,\s]/g, "")}${userBidValue} placed.`,
                    // );
                    postBid(product, user);
                    setBidAmount("");
                  }
                }}
                className="px-6 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl transition-all active:scale-95 shadow-lg flex items-center gap-2"
              >
                BID <FiChevronRight />
              </button>
            </div>
            {bidError && (
              <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 ml-1">
                <FiX
                  size={14}
                  className="bg-red-500 text-white rounded-full p-0.5"
                />
                {bidError}
              </p>
            )}
            {isBidsuccess && (
              <p className="text-emerald-600 text-[11px] font-bold flex items-center gap-1 ml-1">
                <FiCheck
                  size={14}
                  className="bg-emerald-500 text-white rounded-full p-0.5"
                />
                Bid placed successfully!
              </p>
            )}
            {/* {product.highestBidderEmail ? (
              <div className="mt-3 flex items-center gap-3 text-[11px] font-bold text-gray-700">
                <img
                  src={product.currentHighestBIdderImage}
                  alt={product.currentHighestBIdderName}
                  className="w-6 h-6 rounded-full object-cover border-2 border-gray-300"
                />
                <span>Current Highest Bidder: {product.highestBidderName}</span>
              </div>
            ):<>
            </>} */}
            <div className="p-4 border rounded-lg">
              {product.highestBidderEmail ? (
                user?.email === product.highestBidderEmail ? (
                
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                    <CheckCircle size={20} />
                    <span className="font-semibold">
                      You are the highest bidder! at {formatPrice(product.currentHighestBId)}
                    </span>
                  </div>
                ) : (
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          product.highestBidderImage || "/default-avatar.png"
                        }
                        alt="Bidder"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-xs text-gray-500">Current Leader</p>
                        <p className="text-sm font-medium">
                          {product.highestBidderName || "Anonymous"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                      Placed Bid: {formatPrice(product.currentHighestBId)}
                      </p>
                    </div>
                  </div>
                )
              ) : (
                
                <div className="border-2 border-dashed border-gray-300 p-6 text-center rounded-md">
                  <p className="text-gray-500 italic text-sm">No bids yet.</p>
                  <p className="text-blue-500 font-semibold mt-1">
                    Be the first to bid and grab it!
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ───── নিলাম শেষ হওয়ার পর UI ───── */
          <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                <FiCheck size={24} strokeWidth={3} />
              </div>
            </div>
            <h3 className="text-emerald-800 font-black text-lg uppercase tracking-tight">
              Auction Completed
            </h3>
            <p className="text-emerald-600 text-xs font-bold bg-white/50 py-1 px-3 rounded-full inline-block border border-emerald-100">
              Sold for: {formatPrice(product.currentHighestBId)}
            </p>

            {/* উইনারের নাম দেখানোর জন্য (যদি ব্যাকএন্ডে winnerName থাকে) */}
            <div className="pt-2 text-[11px] text-emerald-700 font-bold">
              Winner: {product.highestBidderName || "Anonymous Bidder"} 🎉
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostaBId;
