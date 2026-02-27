import { Link } from "react-router-dom";

function Navbar() {
    return (
        <>
        <nav className="bg-slate-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">

        <Link to="/" className="text-2xl font-bold flex items-center gap-2 tracking-wide hover:text-slate-300 transition-colors">
          <img src="/logo.svg" alt="Logo do NexusERP " className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex gap-6 font-medium">
          
          <Link to="/" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">
            Dashboard
          </Link>
          
          <Link to="/products" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">
            Products
          </Link>
          
          <Link to="/raw-materials" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">
            Materials
          </Link>
          
          <Link to="/recipes" className="hover:text-blue-400 transition-colors border-b-2 border-transparent hover:border-blue-400 pb-1">
            Recipes
          </Link>
          
        </div>
      </div>
    </nav>
        </>
    )
}
export default Navbar;