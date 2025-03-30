import { useState } from "react";
import { motion } from 'motion/react';
import { fadeIn, cardVariants } from "@/variants";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";

const ItemsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Dummy data for items
  const items = [
    {
      id: 1,
      type: 'found',
      item_name: 'iPhone 13 Pro',
      found_location: 'Central Park, New York',
      found_date: '2024-03-15',
      description: 'Found near the fountain. Black iPhone 13 Pro in a blue case. Please contact with proof of purchase.',
      image: null
    },
    {
      id: 2,
      type: 'lost',
      item_name: 'MacBook Pro',
      lost_location: 'Starbucks, Downtown',
      lost_date: '2024-03-14',
      description: 'Left my MacBook Pro at Starbucks. Space gray, 14-inch model. Last seen on the corner table.',
      image: null
    },
    {
      id: 3,
      type: 'found',
      item_name: 'Wallet',
      found_location: 'Subway Station',
      found_date: '2024-03-13',
      description: 'Brown leather wallet found at the ticket counter. Contains ID and credit cards.',
      image: null
    },
    {
      id: 4,
      type: 'lost',
      item_name: 'AirPods Pro',
      lost_location: 'Gym',
      lost_date: '2024-03-12',
      description: 'Lost my AirPods Pro at the gym. White case with a small scratch on the corner.',
      image: null
    },
    {
      id: 5,
      type: 'found',
      item_name: 'Keys',
      found_location: 'Shopping Mall',
      found_date: '2024-03-11',
      description: 'Set of keys found in the food court. Includes car key and house keys.',
      image: null
    },
    {
      id: 6,
      type: 'lost',
      item_name: 'Camera',
      lost_location: 'Beach',
      lost_date: '2024-03-10',
      description: 'Sony A7III camera lost at the beach. Black body with a 24-70mm lens.',
      image: null
    },
    {
      id: 7,
      type: 'found',
      item_name: 'Backpack',
      found_location: 'Library',
      found_date: '2024-03-09',
      description: 'Blue Jansport backpack found in the study area. Contains textbooks and notebooks.',
      image: null
    },
    {
      id: 8,
      type: 'lost',
      item_name: 'Watch',
      lost_location: 'Restaurant',
      lost_date: '2024-03-08',
      description: 'Silver Rolex watch lost at the restaurant. Last seen in the restroom.',
      image: null
    },
    {
      id: 9,
      type: 'found',
      item_name: 'Glasses',
      found_location: 'Park',
      found_date: '2024-03-07',
      description: 'Black rimmed glasses found on a park bench. Prescription lenses.',
      image: null
    },
    {
      id: 10,
      type: 'lost',
      item_name: 'Bicycle',
      lost_location: 'Train Station',
      lost_date: '2024-03-06',
      description: 'Mountain bike stolen from the train station. Red frame with black handlebars.',
      image: null
    },
    {
      id: 11,
      type: 'found',
      item_name: 'Umbrella',
      found_location: 'Bus Stop',
      found_date: '2024-03-05',
      description: 'Black automatic umbrella found at the bus stop. Brand: Totes.',
      image: null
    },
    {
      id: 12,
      type: 'lost',
      item_name: 'Laptop',
      lost_location: 'Coffee Shop',
      lost_date: '2024-03-04',
      description: 'Dell XPS 13 laptop lost at the coffee shop. Silver color with a sticker on the lid.',
      image: null
    }
  ];

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginationItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="items" className="w-full bg-[#f8f9fa]">
      <div className="pb-12 pt-8 lg:pb-20 lg:pt-16 w-full">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="mb-8">
            <motion.h2
              variants={fadeIn("left", 0)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="text-gray-800 font-bold font-montserrat xl:leading-[75px] xl:text-6xl md:leading-[60px] md:text-5xl text-3xl capitalize"
            >
              Items
            </motion.h2>
          </div>

          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginationItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariants(0.1, index)}
                initial="hidden"
                whileInView={"show"}
                viewport={{ once: false, amount: 0.2 }}
                className="relative p-5 bg-white shadow-shadow-1 rounded-xl transition-all duration-300 group border border-gray-200 hover:border-accent-primary/50"
              >
                {/* background gradient */}
                <div className="absolute rounded-xl inset-0 bg-card-hov opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                <div className="relative flex flex-col gap-4 text-gray-800">
                  {/* Image or Placeholder */}
                  <div className="w-full h-48 rounded-lg overflow-hidden bg-white">
                    {item.image ? (
                      <img 
                        src={`http://localhost:8000${item.image}`} 
                        alt={item.item_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-accent-primary">📸</span>
                      </div>
                    )}
                  </div>

                  {/* Item Type Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.type === 'found' 
                        ? 'bg-green-500/20 text-green-600' 
                        : 'bg-red-500/20 text-red-600'
                    }`}>
                      {item.type === 'found' ? 'Found' : 'Lost'}
                    </span>
                  </div>

                  {/* Item Details */}
                  <div className="pt-2">
                    <h3 className="font-semibold text-xl leading-7 font-montserrat text-accent-primary">
                      {item.item_name}
                    </h3>
                    <p className="text-sm text-gray-700 mt-1">
                      {item.type === 'found' ? item.found_location : item.lost_location}
                    </p>
                    <p className="text-sm text-gray-700">
                      {new Date(item.type === 'found' ? item.found_date : item.lost_date).toLocaleDateString()}
                    </p>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0 }}
              className="mt-10 flex justify-center"
            >
              <Pagination>
                <PaginationContent className="flex gap-2">
                  {/* Previous Page */}
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-4 py-2 rounded-md text-subtitle disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      &lt; Previous
                    </Button>
                  </PaginationItem>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md border text-sm font-medium transition-all ${
                          currentPage === i + 1
                            ? "bg-subtitle text-black border-accent-primary shadow-lg scale-105"
                            : "bg-bg-color-2 text-subtitle border-accent-primary hover:bg-subtitle hover:text-black"
                        }`}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {/* Next Page */}
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-4 py-2 rounded-md text-subtitle disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next &gt;
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ItemsList; 