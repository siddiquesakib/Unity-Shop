// components/home/BrandMarquee.jsx
"use client";

const brands = [
  { name: "VERSACE", font: "font-serif tracking-[0.2em]" },
  { name: "ZARA", font: "font-sans tracking-[0.15em] font-black" },
  { name: "GUCCI", font: "font-serif tracking-[0.18em]" },
  { name: "PRADA", font: "font-serif tracking-[0.25em] font-black" },
  { name: "Calvin Klein", font: "font-sans tracking-wide italic" },
  { name: "H&M", font: "font-sans tracking-[0.15em] font-black" },
  { name: "NIKE", font: "font-sans tracking-[0.2em] font-extrabold" },
  { name: "ADIDAS", font: "font-sans tracking-[0.15em] font-bold" },
];

const BrandMarquee = () => {
  return (
    <div className="bg-black py-5 sm:py-6 overflow-hidden">
      <div className="relative flex">
        {/* Scrolling track – duplicated for seamless loop */}
        <div className="flex items-center gap-12 sm:gap-16 md:gap-20 animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={i}
              className={`text-white/80 hover:text-white text-lg sm:text-xl md:text-2xl transition-colors duration-200 cursor-default select-none ${brand.font}`}
            >
              {brand.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandMarquee;
