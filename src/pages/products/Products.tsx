import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Popup from 'reactjs-popup';
import type { AppDispatch, RootState } from '../../store/store';
import type Product from '../../models/Product';
import { fetchProducts } from '../../store/slices/productSlice';
import { createProduct, deleteProduct, updateProduct } from '../../services/services';

const Products = () => {
    
    const dispatch = useDispatch<AppDispatch>();

    const { items: products, status } = useSelector((state: RootState) => state.products);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<Product>({ id: 0, name: '', price: 0 });

    const [productToDeleteId, setProductToDeleteId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setFormData({ id: 0, name: '', price: 0 });
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setFormData(product);
        setIsFormModalOpen(true);
    };

    const handleOpenDeleteConfirm = (id: number) => {
        setProductToDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (formData.id === 0) {
                await createProduct({ name: formData.name, price: formData.price });
            } else {
                await updateProduct(formData.id, { name: formData.name, price: formData.price });
            }

            setIsFormModalOpen(false);
            dispatch(fetchProducts());
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
            alert("Erro ao salvar. Verifique se o backend está rodando.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (productToDeleteId !== null) {
            setIsSubmitting(true);
            try {
                await deleteProduct(productToDeleteId);
                dispatch(fetchProducts());
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Erro ao excluir. O produto pode estar atrelado a uma receita ou simulação.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const overlayStyle = { background: 'rgba(0, 0, 0, 0.7)' };

    return (
        <div className="flex flex-col gap-6 font-sans">

           <div className="border-b-2 border-[#003366] pb-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-extrabold text-[#003366] uppercase tracking-wide">
                    Catálogo de Produtos
                </h1>
                <button
                    onClick={handleOpenCreate}
                    className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-2 rounded font-bold transition-colors flex items-center gap-2 text-sm uppercase shadow-md"
                >
                    <span>+</span> Novo Produto
                </button>
            </div>

            <div className="bg-white border border-slate-300 shadow-xl shadow-slate-100 rounded-lg overflow-hidden mt-2">
                <div className="bg-[#003366] text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="font-extrabold uppercase tracking-wide text-sm flex items-center gap-2">
                        Portfólio de Fabricação
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 text-sm uppercase border-b-2 border-slate-200">
                                <th className="px-6 py-4 font-semibold w-[100px]">Cód. ID</th>
                                <th className="px-6 py-4 font-semibold">Nome do Produto Final</th>
                                <th className="px-6 py-4 font-semibold w-[150px]">Preço (R$)</th>
                                <th className="px-6 py-4 font-semibold w-[200px] text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-800">
                            {status === 'loading' ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-bold">Carregando produtos...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-bold">Nenhum produto cadastrado.</td></tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5 font-mono text-slate-400">#{product.id}</td>
                                        <td className="px-6 py-5 font-extrabold text-[#003366] text-base">{product.name}</td>
                                        <td className="px-6 py-5 font-bold text-[#198754]">
                                            R$ {product.price ? product.price.toFixed(2) : '0.00'}
                                        </td>
                                        <td className="px-6 py-5 text-right flex gap-3 justify-end">
                                            <button onClick={() => handleOpenEdit(product)} className="text-[#00A3E0] hover:text-blue-800 font-semibold text-sm transition-colors">
                                                Editar
                                            </button>
                                            <button onClick={() => handleOpenDeleteConfirm(product.id)} className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors">
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Popup open={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} modal nested overlayStyle={overlayStyle} contentStyle={{ width: '100%', maxWidth: '480px', padding: '0', border: 'none', background: 'transparent' }}>
                <div className="bg-[#F1F5F9] border border-slate-300 rounded-lg shadow-2xl p-8 animate-slide-in-down">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-300 pb-4">
                        <h2 className="text-xl font-extrabold text-[#003366] uppercase tracking-tight">
                            {formData.id === 0 ? 'Cadastrar Novo Produto' : 'Editar Produto'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">Nome Comercial</label>
                            <input
                                type="text" required placeholder="Ex: Cadeira Plástica Branca"
                                className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-slate-800 focus:outline-none focus:border-[#003366] shadow-sm font-medium"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">Preço de Venda (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                placeholder="0.00"
                                className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-slate-800 focus:outline-none focus:border-[#003366] shadow-sm font-medium"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-2 border-t border-slate-300 pt-6">
                            <button type="button" onClick={() => setIsFormModalOpen(false)} className="px-6 py-3 text-slate-600 hover:bg-slate-200 rounded font-bold uppercase tracking-wide text-xs">Cancelar</button>
                            <button type="submit" disabled={isSubmitting} className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-3 rounded font-extrabold uppercase tracking-wide text-xs shadow-md">
                                {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
                            </button>
                        </div>

                    </form>
                </div>
            </Popup>

            <Popup open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} modal nested overlayStyle={overlayStyle} contentStyle={{ width: '100%', maxWidth: '400px', padding: '0', border: 'none', background: 'transparent' }}>
                <div className="bg-white border border-slate-300 rounded-lg shadow-2xl p-8 animate-slide-in-down flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">Confirmar Exclusão</h2>
                    <p className="text-slate-600 mt-2 text-sm">Tem certeza? Esta ação removerá o produto do catálogo.</p>
                    <div className="flex gap-4 mt-6 border-t border-slate-200 pt-6 w-full justify-center">
                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded font-bold uppercase text-xs">Cancelar</button>
                        <button type="button" onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-extrabold uppercase text-xs shadow-md">
                            {isSubmitting ? 'Excluindo...' : 'Sim, Excluir'}
                        </button>
                    </div>
                </div>
            </Popup>

        </div>
    );
};

export default Products;