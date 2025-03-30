import { useState } from "react";
import { motion } from 'motion/react';
import { fadeIn } from "@/variants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import api from "@/utils/api";

const FoundItemForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    item_name: "",
    description: "",
    found_location: "",
    found_date: "",
    image: null
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('item_name', formData.item_name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('found_location', formData.found_location.trim());
      formDataToSend.append('found_date', formData.found_date);
      
      if (formData.image) {
        formDataToSend.append('uploaded_images', formData.image);
      }

      console.log('Sending form data:', {
        item_name: formData.item_name,
        description: formData.description,
        found_location: formData.found_location,
        found_date: formData.found_date,
        hasImage: !!formData.image
      });

      const response = await api.post('/found-form/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Response:', response.data);

      toast({
        title: "Success!",
        description: "Item has been reported successfully.",
        className: "bg-tertiary border-none shadow-shadow-1",
      });

      setFormData({
        item_name: "",
        description: "",
        found_location: "",
        found_date: "",
        image: null
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Log the error response for debugging
      if (error.response?.data) {
        console.log('Error response data:', error.response.data);
      }

      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          "Failed to submit the form. Please try again.";

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        className: "bg-tertiary border-none shadow-shadow-1",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="found-item" className="w-full bg-bg-color-2">
      <div className="pb-12 pt-8 lg:pb-20 lg:pt-16 w-full">
        <div className="w-11/12 lg:w-4/5 mx-auto">
          <div className="mb-12">
            <motion.h2
              variants={fadeIn("left", 0)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="text-lightn font-bold font-montserrat xl:leading-[75px] xl:text-6xl md:leading-[60px] md:text-5xl text-3xl capitalize"
            >
              Report Found Item
            </motion.h2>
          </div>

          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.2 }}
            className="w-full max-w-3xl mx-auto bg-bg-color-1 shadow-shadow-1 p-8 rounded-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col gap-6 w-full">
                <div className="space-y-2 w-full">
                  <label htmlFor="item_name" className="text-lightn font-medium text-lg">Item Name</label>
                  <Input
                    id="item_name"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter the name of the found item"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 w-full">
                  <label htmlFor="found_location" className="text-lightn font-medium text-lg">Found Location</label>
                  <Input
                    id="found_location"
                    name="found_location"
                    value={formData.found_location}
                    onChange={handleInputChange}
                    required
                    placeholder="Where was the item found?"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 w-full">
                  <label htmlFor="found_date" className="text-lightn font-medium text-lg">Found Date</label>
                  <Input
                    id="found_date"
                    name="found_date"
                    type="date"
                    value={formData.found_date}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2 w-full">
                  <label htmlFor="image" className="text-lightn font-medium text-lg">Item Image</label>
                  <div className="relative w-full">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                      className="w-full h-14 text-base text-lightn bg-bg-color-1 shadow-in-shadow tracking-widest font-light placeholder:text-gray-500 font-montserrat rounded-md border-2 border-bg-color-1 focus:border-accent-primary focus:shadow-shadow-1 outline-none transition-all duration-400 ease-linear flex items-center justify-center"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-lightn font-medium text-lg">Description</label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the item in detail"
                  className="min-h-[200px] text-base"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white h-14 text-lg"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FoundItemForm;