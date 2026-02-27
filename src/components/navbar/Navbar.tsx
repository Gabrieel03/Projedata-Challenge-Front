import { useState } from "react";
import { Link } from "react-router-dom";;

function Navbar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        <Link to="/" onClick={closeMenu} className="text-2xl font-bold flex items-center gap-2 tracking-wide hover:opacity-80 transition-opacity">
          <img src="logo.svg" alt="Logo do Nexus ERP" className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex gap-6 font-medium uppercase tracking-wide text-sm">
          <Link to="/" className="hover:text-[#00A3E0] transition-colors border-b-2 border-transparent hover:border-[#00A3E0] pb-1">Dashboard</Link>
          <Link to="/products" className="hover:text-[#00A3E0] transition-colors border-b-2 border-transparent hover:border-[#00A3E0] pb-1">Produtos</Link>
          <Link to="/raw-materials" className="hover:text-[#00A3E0] transition-colors border-b-2 border-transparent hover:border-[#00A3E0] pb-1">Insumos</Link>
          <Link to="/recipes" className="hover:text-[#00A3E0] transition-colors border-b-2 border-transparent hover:border-[#00A3E0] pb-1">Receitas</Link>
        </div>

        <button 
          className="md:hidden text-white hover:text-[#00A3E0] focus:outline-none transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 px-4 pt-2 pb-6 flex flex-col gap-4 border-t border-slate-700 animate-slide-in-down">
          <Link to="/" onClick={closeMenu} className="font-medium uppercase text-sm tracking-wide hover:text-[#00A3E0] border-b border-slate-700 pb-2">Dashboard</Link>
          <Link to="/products" onClick={closeMenu} className="font-medium uppercase text-sm tracking-wide hover:text-[#00A3E0] border-b border-slate-700 pb-2">Produtos</Link>
          <Link to="/raw-materials" onClick={closeMenu} className="font-medium uppercase text-sm tracking-wide hover:text-[#00A3E0] border-b border-slate-700 pb-2">Insumos</Link>
          <Link to="/recipes" onClick={closeMenu} className="font-medium uppercase text-sm tracking-wide hover:text-[#00A3E0] pb-1">Receitas</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;