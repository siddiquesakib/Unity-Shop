import React from 'react';
import { categories } from './categories';
// import { categories } from './categories';

export default function CategoryList() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Featured Categories
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Explore products from all major categories
          </p>
        </div>

        <div
          className="
          grid 
          grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          lg:grid-cols-5 
          xl:grid-cols-6 
          gap-5
        "
        >
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <div
                key={index}
                className="
                  group
                  bg-white 
                  dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  rounded-2xl
                  p-6
                  flex flex-col items-center justify-center
                  text-center
                  cursor-pointer
                  transition-all duration-300
                  hover:shadow-lg
                  hover:-translate-y-1
                "
              >
                <div
                  className="
                  mb-4
                  p-3
                  rounded-full
                  bg-gray-100
                  dark:bg-gray-700
                  group-hover:scale-110
                  transition-transform duration-300
                "
                >
                  <Icon
                    size={28}
                    className="text-gray-700 dark:text-gray-200"
                  />
                </div>

                <h3 className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-100">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
