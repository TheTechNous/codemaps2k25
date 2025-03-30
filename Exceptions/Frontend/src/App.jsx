import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { SidebarLayout } from "@/components/SidebarLayout";
import Hero from "@/components/Hero";
import FoundItemForm from "@/components/FoundItemForm";
import LostItemForm from "@/components/LostItemForm";
import ItemsList from "@/components/ItemsList";
import RequestsList from "@/components/RequestsList";
import QrCode from "@/components/QrCode";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/safereturn" element={
          <>
            <Header name="SafeReturn" />
            <Hero />
            <Footer name="SafeReturn" />
          </>
        } />

        {/* Protected routes */}
        <Route path="/safereturn" element={<SidebarLayout />}>
          <Route
            path="items"
            element={
              <ProtectedRoute>
                <ItemsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="found-item"
            element={
              <ProtectedRoute>
                <FoundItemForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="lost-item"
            element={
              <ProtectedRoute>
                <LostItemForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="requests"
            element={
              <ProtectedRoute>
                <RequestsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="qr-code"
            element={
              <ProtectedRoute>
                <QrCode />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
