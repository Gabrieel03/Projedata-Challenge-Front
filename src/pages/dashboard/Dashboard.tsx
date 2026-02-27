import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import type SimulationResponseDTO from '../../models/SimulationResponseDTO';
import { fetchProducts } from '../../store/slices/productSlice';
import { fetchRawMaterials } from '../../store/slices/rawMaterialSlice';
import { simulateProduction } from '../../services/services';

const Dashboard = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { items: products } = useSelector((state: RootState) => state.products);
  const { items: rawMaterials } = useSelector((state: RootState) => state.rawMaterial);

  const [simulation, setSimulation] = useState<SimulationResponseDTO | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const handleSimulate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await simulateProduction();
      setSimulation(result);
    } catch (err) {
      setError('Failed to execute simulation. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sans py-2">

      <div className="border-b-2 border-[#003366] pb-2 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-[#003366] uppercase tracking-wide">
          Factory Dashboard
        </h1>
        <span className="text-slate-500 font-mono text-xs p-2 bg-slate-100 rounded">Status: <span className="text-[#198754] font-bold">Operational</span></span>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-[#F8FAFC] border border-slate-200 p-6 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-6">
          <svg className="w-12 h-12 text-[#00A3E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <div className="flex flex-col">
            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Products Registered</span>
            <span className="text-4xl font-extrabold text-[#003366]">{products.length}</span>
          </div>

        </div>


        <div className="bg-[#F8FAFC] border border-slate-200 p-6 rounded-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-6">
          <svg className="w-12 h-12 text-[#00A3E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
          <div className="flex flex-col">
            <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Materials in Stock</span>
            <span className="text-4xl font-extrabold text-[#003366]">{rawMaterials.length}</span>
          </div>
        </div>


        <div className="bg-[#e9f5ec] border-2 border-[#198754] border-dashed p-6 rounded-lg flex items-center gap-6">
          <svg className="w-12 h-12 text-[#198754]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 8c1.657 0-3 2.105-3 3s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>
          <div className="flex flex-col">
            <span className="text-[#198754] text-sm font-semibold uppercase tracking-wider">Potential Profit Projected</span>
            <span className="text-4xl font-extrabold text-[#198754]">
              {simulation ? `R$ ${simulation.totalSimulationValue.toFixed(2)}` : 'R$ 0,00'}
            </span>
          </div>
        </div>
      </div>


      <div className="bg-[#F1F5F9] border border-slate-300 p-8 rounded-lg shadow-inner flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Optimal Production Queue Calculation</h2>
          <p className="text-slate-600 max-w-xl">
            Click the button to the right so that the AutoFlex Projedata Engine analyzes the available inventory and instantly calculates the production sequence that maximizes factory profitability.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isLoading}
          className="bg-[#003366] hover:bg-[#002244] text-white px-10 py-4 rounded font-extrabold uppercase tracking-wide transition-all duration-150 transform active:scale-95 disabled:opacity-50 min-w-[300px] flex items-center justify-center gap-2 shadow-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Processing Queue...
            </>
          ) : '🚀 Execute Min/Max Optimization'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <div>
            <p className="font-bold">SYSTEM ERROR</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {simulation && simulation.producedItems.length > 0 && (
        <div className="bg-white border border-slate-200 shadow-xl shadow-slate-100 rounded-lg overflow-hidden mt-2">
          <div className="bg-[#003366] text-white px-6 py-4 flex justify-between items-center">
            <h3 className="font-extrabold uppercase tracking-wide text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-[#198754] rounded-full animate-pulse"></span>
              Active and Suggested Production Order
            </h3>
            <span className="text-xs opacity-70 font-mono p-1 bg-white/10 rounded">Optimized Sequence</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-sm uppercase border-b-2 border-slate-200">
                  <th className="px-6 py-4 font-semibold w-[80px]">Seq</th>
                  <th className="px-6 py-4 font-semibold w-[100px]">ID Code</th>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold w-[220px]">Order Status</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-800">

                {simulation.producedItems.map((item, index) => (
                  <tr
                    key={item.productId}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-5 font-mono text-slate-400">#{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="px-6 py-5 font-medium text-slate-500">{item.productId}</td>
                    <td className="px-6 py-5 font-extrabold text-[#003366] text-base">{item.productName}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-semibold">{item.quantityProduced}</span>
                        <div className="w-full h-2 bg-slate-100 rounded-full">
                          <div
                            className="h-full bg-[#198754] rounded-full shadow-[0_0_8px_rgba(25,135,84,0.3)]"
                            style={{ width: '100%' }}
                          />
                        </div>
                        <span className="text-[#198754] text-xs font-bold whitespace-nowrap">Complete</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {simulation && simulation.producedItems.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900 px-6 py-6 rounded-lg text-center flex flex-col items-center justify-center gap-4">
          <svg className="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          <div>
            <p className="font-extrabold text-lg">No Production Items Found</p>
            <p className="text-sm mt-1 max-w-lg">The AutoFlex Projedata engine ran, but concluded that the current inventory of raw materials is insufficient to produce even a single unit of any product. Please review the <span className="font-bold">Raw Material Management</span> or product recipes.</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default Dashboard;