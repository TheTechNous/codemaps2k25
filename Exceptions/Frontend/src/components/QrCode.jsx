import { useState } from "react";
import { motion } from 'motion/react';
import { fadeIn } from "@/variants";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const QrCode = () => {
  const { toast } = useToast();
  const [selectedItem, setSelectedItem] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Dummy data for demonstration
  const items = [
    {
      id: 1,
      item_name: "MacBook Pro",
      found_location: "Starbucks, Downtown",
      found_date: "2024-03-14",
      status: "unclaimed",
      category: "Electronics"
    },
    {
      id: 2,
      item_name: "AirPods Pro",
      found_location: "Gym",
      found_date: "2024-03-12",
      status: "unclaimed",
      category: "Electronics"
    },
    {
      id: 3,
      item_name: "Camera",
      found_location: "Beach",
      found_date: "2024-03-10",
      status: "unclaimed",
      category: "Electronics"
    }
  ];

  const handleRequestQR = async (item) => {
    setIsLoading(true);
    try {
      // This would be replaced with your actual API call
      // const response = await fetch('/api/generate-qr', {
      //   method: 'POST',
      //   body: JSON.stringify({ itemId: item.id })
      // });
      // const data = await response.json();
      
      // Simulating API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://yourdomain.com/claim/${item.id}`)}`);
      setSelectedItem(item);
      
      toast({
        title: "QR Code Generated",
        description: "The QR code has been generated successfully.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="qr-code" className="w-full bg-[#f8f9fa]">
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
              QR Code Generator
            </motion.h2>
          </div>

          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
            className="bg-white rounded-xl shadow-shadow-1 p-6 max-h-[calc(100vh-300px)] overflow-auto"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Found Location</TableHead>
                  <TableHead>Found Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-accent-primary">{item.item_name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.found_location}</TableCell>
                    <TableCell>{new Date(item.found_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'unclaimed' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => handleRequestQR(item)}
                            disabled={isLoading}
                            className="bg-accent-primary hover:bg-accent-primary/90 text-white"
                          >
                            {isLoading ? "Generating..." : "Get QR Code"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>QR Code for {selectedItem?.item_name}</DialogTitle>
                          </DialogHeader>
                          {qrCode && (
                            <div className="flex flex-col items-center gap-4">
                              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                              <p className="text-sm text-gray-600 text-center">
                                Scan this QR code to claim your item
                              </p>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QrCode; 