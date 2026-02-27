import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Popup from 'reactjs-popup';
import type { AppDispatch, RootState } from '../../store/store';
import { fetchRecipes } from '../../store/slices/productRawMaterial';
import { fetchProducts } from '../../store/slices/productSlice';
import { fetchRawMaterials } from '../../store/slices/rawMaterialSlice';
import { createRecipe, deleteRecipe, updateRecipe } from '../../services/services';

const Recipes = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { items: recipes, status: recipeStatus } = useSelector((state: RootState) => state.recipes);
    const { items: products } = useSelector((state: RootState) => state.products);
    const { items: rawMaterials } = useSelector((state: RootState) => state.rawMaterial);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [recipeToDeleteId, setRecipeToDeleteId] = useState<number | null>(null);

    const [formData, setFormData] = useState({ id: 0, productId: 0, rawMaterialId: 0, quantityNeeded: 1 });

    useEffect(() => {
        dispatch(fetchRecipes());
        dispatch(fetchProducts());
        dispatch(fetchRawMaterials());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setFormData({
            id: 0,
            productId: products.length > 0 ? products[0].id : 0,
            rawMaterialId: rawMaterials.length > 0 ? rawMaterials[0].id : 0,
            quantityNeeded: 1
        });
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (recipe: any) => {
        const prodId = recipe.product ? recipe.product.id : recipe.productId;
        const matId = recipe.rawMaterial ? recipe.rawMaterial.id : recipe.rawMaterialId;
        const qty = recipe.quantityNeeded || recipe.quantity || 1;

        setFormData({
            id: recipe.id,
            productId: prodId,
            rawMaterialId: matId,
            quantityNeeded: qty
        });
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.productId === 0 || formData.rawMaterialId === 0) {
            alert("⚠️ É obrigatório selecionar um Produto e um Insumo.");
            return;
        }

        setIsSubmitting(true);
        try {
            if (formData.id === 0) {

                await createRecipe(formData.productId, formData.rawMaterialId, formData.quantityNeeded);
            } else {

                await updateRecipe(formData.id, formData.productId, formData.rawMaterialId, formData.quantityNeeded);
            }
            setIsFormModalOpen(false);
            dispatch(fetchRecipes());
        } catch (error) {
            console.error("Erro ao salvar receita:", error);
            alert("Falha ao salvar a receita. Verifique o console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (recipeToDeleteId !== null) {
            setIsSubmitting(true);
            try {
                await deleteRecipe(recipeToDeleteId);
                dispatch(fetchRecipes());
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error("Erro ao deletar:", error);
                alert("Falha ao desvincular o item.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const getProductName = (recipe: any) => {
        if (recipe.product && recipe.product.name) return recipe.product.name;
        return products.find(p => p.id === recipe.productId)?.name || `Desconhecido`;
    };

    const getMaterialName = (recipe: any) => {
        if (recipe.rawMaterial && recipe.rawMaterial.name) return recipe.rawMaterial.name;
        return rawMaterials.find(rm => rm.id === recipe.rawMaterialId)?.name || `Desconhecido`;
    };

    const overlayStyle = { background: 'rgba(0, 0, 0, 0.7)' };
    const canCreateRecipe = products.length > 0 && rawMaterials.length > 0;

    return (
        <div className="flex flex-col gap-6 font-sans">

            <div className="border-b-2 border-[#003366] pb-2 flex justify-between items-center pt-2">
                <h1 className="text-2xl font-extrabold text-[#003366] uppercase tracking-wide">
                    Engenharia de Receitas
                </h1>
                <button
                    onClick={handleOpenCreate}
                    disabled={!canCreateRecipe}
                    className={`${canCreateRecipe ? 'bg-[#003366] hover:bg-[#002244]' : 'bg-slate-400 cursor-not-allowed'} text-white px-6 py-2 rounded font-bold transition-colors flex items-center gap-2 text-sm uppercase shadow-md `}
                >
                    <span>+</span> Adicionar Item à Receita
                </button>
            </div>

            {!canCreateRecipe && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-sm">
                    <p className="font-bold">Atenção necessária</p>
                    <p className="text-sm">Para criar uma receita, cadastre ao menos um <strong>Produto</strong> e um <strong>Insumo</strong> nas telas anteriores.</p>
                </div>
            )}

            <div className="bg-white border border-slate-300 shadow-xl shadow-slate-100 rounded-lg overflow-hidden mt-2">
                <div className="bg-[#003366] text-white px-6 py-4">
                    <h3 className="font-extrabold uppercase tracking-wide text-sm">Composições Cadastradas (BOM)</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 text-sm uppercase border-b-2 border-slate-200">
                                <th className="px-6 py-4 font-semibold w-[80px]">ID Relação</th>
                                <th className="px-6 py-4 font-semibold">Produto Final</th>
                                <th className="px-6 py-4 font-semibold">Insumo Utilizado</th>
                                <th className="px-6 py-4 font-semibold w-[150px]">Qtd. Necessária</th>
                                <th className="px-6 py-4 font-semibold w-[150px] text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-800">
                            {recipeStatus === 'loading' ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-bold">Carregando receitas...</td></tr>
                            ) : recipes.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-bold">Nenhuma receita vinculada no momento.</td></tr>
                            ) : (
                                recipes.map((recipe) => (
                                    <tr key={recipe.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-5 font-mono text-slate-400">#{recipe.id}</td>
                                        <td className="px-6 py-5 font-extrabold text-[#003366] text-base">{getProductName(recipe)}</td>
                                        <td className="px-6 py-5 font-medium text-slate-600">{getMaterialName(recipe)}</td>
                                        <td className="px-6 py-5">
                                            <span className="bg-[#e9f5ec] text-[#198754] border border-[#198754] px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                                {recipe.quantityNeeded || recipe.quantityNeeded || 0} UN
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right flex gap-3 justify-end">
                                            <button
                                                onClick={() => handleOpenEdit(recipe)}
                                                className="text-[#00A3E0] hover:text-blue-800 font-semibold text-sm transition-colors"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => { setRecipeToDeleteId(recipe.id); setIsDeleteModalOpen(true); }}
                                                className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors"
                                            >
                                                Desvincular
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Popup open={isFormModalOpen} onClose={handleCloseFormModal} modal nested overlayStyle={overlayStyle} contentStyle={{ width: '100%', maxWidth: '500px', padding: '0', border: 'none', background: 'transparent' }}>
                <div className="bg-[#F1F5F9] border border-slate-300 rounded-lg shadow-2xl p-8 animate-slide-in-down">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-300 pb-4">
                        <h2 className="text-xl font-extrabold text-[#003366] uppercase tracking-tight">
                            {formData.id === 0 ? 'Vincular Insumo a Produto' : 'Editar Receita (BOM)'}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">1. Produto Final</label>
                            <select
                                className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-slate-800 focus:outline-none focus:border-[#003366] font-medium shadow-sm"
                                value={formData.productId}
                                onChange={(e) => setFormData({ ...formData, productId: Number(e.target.value) })}
                            >
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">2. Matéria-Prima Necessária</label>
                            <select
                                className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-slate-800 focus:outline-none focus:border-[#003366] font-medium shadow-sm"
                                value={formData.rawMaterialId}
                                onChange={(e) => setFormData({ ...formData, rawMaterialId: Number(e.target.value) })}
                            >
                                {rawMaterials.map(rm => <option key={rm.id} value={rm.id}>{rm.name} (Estoque: {rm.stockQuantity})</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">3. Quantidade a Consumir</label>
                            <input
                                type="number" required min="1" placeholder="Ex: 5"
                                className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-slate-800 focus:outline-none focus:border-[#003366] shadow-sm font-medium"
                                value={formData.quantityNeeded}
                                onChange={(e) => setFormData({ ...formData, quantityNeeded: Number(e.target.value) })}
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-4 border-t border-slate-300 pt-6">
                            <button type="button" onClick={handleCloseFormModal} className="px-6 py-3 text-slate-600 hover:bg-slate-200 rounded font-bold uppercase tracking-wide text-xs">Cancelar</button>
                            <button type="submit" disabled={isSubmitting} className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-3 rounded font-extrabold uppercase tracking-wide text-xs shadow-md">
                                {isSubmitting ? 'Salvando...' : 'Salvar Receita'}
                            </button>
                        </div>
                    </form>
                </div>
            </Popup>

            <Popup open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} modal nested overlayStyle={overlayStyle} contentStyle={{ width: '100%', maxWidth: '400px', padding: '0', border: 'none', background: 'transparent' }}>
                <div className="bg-white border border-slate-300 rounded-lg shadow-2xl p-8 flex flex-col items-center text-center animate-slide-in-down">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">Desvincular Insumo?</h2>
                    <p className="text-slate-600 mt-2 text-sm">Este insumo não será mais gasto para produzir este produto. Tem certeza?</p>
                    <div className="flex gap-4 mt-6 border-t border-slate-200 pt-6 w-full justify-center">
                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded font-bold uppercase text-xs">Cancelar</button>
                        <button type="button" onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-extrabold uppercase text-xs shadow-md">Sim, Desvincular</button>
                    </div>
                </div>
            </Popup>

        </div>
    );
};

export default Recipes;