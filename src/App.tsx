import { BrowserRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/footer/Footer"
import Navbar from "./components/navbar/Navbar"
import Dashboard from "./pages/dashboard/Dashboard"
import RawMaterials from "./pages/rawMaterials/RawMaterials"
import Products from "./pages/products/Products"
import Recipes from "./pages/recipes/Recipes"

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans font-inter">
        <Navbar />
        <main className="`flex-grow container mx-auto px-4 py-8`">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/raw-materials" element={<RawMaterials />} />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
