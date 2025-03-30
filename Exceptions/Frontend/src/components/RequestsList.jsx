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

const RequestsList = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState([
    {
      id: 1,
      item_name: "MacBook Pro",
      lost_location: "Starbucks, Downtown",
      lost_date: "2024-03-14",
      description: "Left my MacBook Pro at Starbucks. Space gray, 14-inch model. Last seen on the corner table.",
      requester_name: "John Doe",
      requester_email: "john@example.com",
      requester_phone: "+1 234-567-8900",
      status: "pending"
    },
    {
      id: 2,
      item_name: "AirPods Pro",
      lost_location: "Gym",
      lost_date: "2024-03-12",
      description: "Lost my AirPods Pro at the gym. White case with a small scratch on the corner.",
      requester_name: "Jane Smith",
      requester_email: "jane@example.com",
      requester_phone: "+1 234-567-8901",
      status: "pending"
    },
    {
      id: 3,
      item_name: "Camera",
      lost_location: "Beach",
      lost_date: "2024-03-10",
      description: "Sony A7III camera lost at the beach. Black body with a 24-70mm lens.",
      requester_name: "Mike Johnson",
      requester_email: "mike@example.com",
      requester_phone: "+1 234-567-8902",
      status: "pending"
    }
  ]);

  const handleAccept = (id) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: 'accepted' } : request
    ));
    toast({
      title: "Request Accepted",
      description: "You have accepted the request. The requester will be notified.",
      className: "bg-green-500 text-white",
    });
  };

  const handleReject = (id) => {
    setRequests(requests.map(request => 
      request.id === id ? { ...request, status: 'rejected' } : request
    ));
    toast({
      title: "Request Rejected",
      description: "You have rejected the request. The requester will be notified.",
      className: "bg-red-500 text-white",
    });
  };

  return (
    <section id="requests" className="w-full bg-[#f8f9fa]">
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
              Lost Item Requests
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
                  <TableHead>Item Details</TableHead>
                  <TableHead>Requester Info</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-accent-primary">{request.item_name}</h3>
                        <p className="text-sm text-gray-600">{request.lost_location}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(request.lost_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-2">{request.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{request.requester_name}</p>
                        <p className="text-sm text-gray-600">{request.requester_email}</p>
                        <p className="text-sm text-gray-600">{request.requester_phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAccept(request.id)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleReject(request.id)}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
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

export default RequestsList; 