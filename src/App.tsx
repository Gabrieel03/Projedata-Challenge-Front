import { BrowserRouter, Route, Routes } from "react-router-dom"
import Footer from "./components/footer/Footer"
import Navbar from "./components/navbar/Navbar"
import Dashboard from "./pages/dashboard/Dashboard"

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans font-inter">
        <Navbar />
        <main className="`flex-grow container mx-auto px-4 py-8`">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<h1 className="text-3xl font-bold text-center mt-10">Tela de Produtos 📦</h1>} />
            <Route path="/raw-materials" element={<h1 className="text-3xl font-bold text-center mt-10">Tela de Insumos 🧱</h1>} />
            <Route path="/recipes" element={<h1 className="text-3xl font-bold text-center mt-10">Tela de Receitas 📋</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
