'use client';

import OfferCard from '@/components/OfferCard';
import { useOffers } from '@/queries/useOfferQueries';
import type { OfferFilter } from '@/types/offer';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OffersScreen() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<OfferFilter>({
    sortBy: 'newest',
    page: 1,
    limit: 12,
  });

  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({
    min: '',
    max: '',
  });

  // Use React Query to fetch offers
  const { data, isLoading, isError } = useOffers(filters);
  const offers = data?.data || [];

  // Categories for filtering
  const categories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Fashion' },
    { id: '3', name: 'Home & Garden' },
    { id: '4', name: 'Sports & Outdoors' },
    { id: '5', name: 'Beauty & Personal Care' },
  ];

  // Apply filters from URL on initial load
  useEffect(() => {
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');

    const initialFilters: OfferFilter = {
      ...filters,
    };

    if (categoryId) initialFilters.categoryId = categoryId;
    if (search) initialFilters.search = search;
    if (sort) initialFilters.sortBy = sort as OfferFilter['sortBy'];

    setFilters(initialFilters);
  }, [searchParams]);

  // Handle filter changes
  const handleCategoryChange = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? undefined : categoryId,
      page: 1,
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = e.target.value as OfferFilter['sortBy'];
    setFilters((prev) => ({ ...prev, sortBy, page: 1 }));
  };

  const handlePriceRangeChange = () => {
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : undefined;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : undefined;

    setFilters((prev) => ({
      ...prev,
      minPrice,
      maxPrice,
      page: 1,
    }));
  };

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      inStock: e.target.checked,
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'newest',
      page: 1,
      limit: 12,
    });
    setPriceRange({ min: '', max: '' });
  };

  // Get current page with fallback to 1
  const currentPage = filters.page || 1;

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-white">All Offers</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-opensea-darkBorder p-6 rounded-lg shadow-sm border border-opensea-darkBorder">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={filters.categoryId === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="h-4 w-4 text-opensea-blue rounded bg-opensea-darkBorder border-opensea-darkBorder"
                    />
                    <label htmlFor={`category-${category.id}`} className="ml-2 text-white">
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Price Range</h2>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full p-2 border border-opensea-darkBorder bg-opensea-darkBorder rounded text-white placeholder:text-opensea-lightGray"
                />
                <span className="text-white">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full p-2 border border-opensea-darkBorder bg-opensea-darkBorder rounded text-white placeholder:text-opensea-lightGray"
                />
              </div>
              <button
                onClick={handlePriceRangeChange}
                className="mt-2 w-full bg-opensea-darkBlue hover:bg-opensea-darkBlue/90 text-white py-2 rounded transition-colors"
              >
                Apply
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4 text-white">Availability</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="in-stock"
                  checked={!!filters.inStock}
                  onChange={handleInStockChange}
                  className="h-4 w-4 text-opensea-blue rounded bg-opensea-darkBorder border-opensea-darkBorder"
                />
                <label htmlFor="in-stock" className="ml-2 text-white">
                  In Stock Only
                </label>
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="w-full bg-opensea-darkBlue hover:bg-opensea-darkBlue/90 text-white py-2 rounded transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="flex-grow">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-opensea-lightGray">
              {isLoading ? 'Loading...' : `Showing ${offers.length} offers`}
            </p>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-opensea-lightGray">
                Sort by:
              </label>
              <select
                id="sort"
                value={filters.sortBy}
                onChange={handleSortChange}
                className="border border-opensea-darkBorder bg-opensea-darkBorder rounded p-2 text-white"
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-opensea-darkBorder rounded-lg aspect-square animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="bg-opensea-darkBorder text-red-400 p-4 rounded-lg border border-red-500/20">
              Error loading offers. Please try again later.
            </div>
          )}

          {/* Offers Grid */}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && offers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-opensea-lightGray text-lg">No offers found.</p>
              <p className="text-opensea-lightGray">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
