import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import type { AppDispatch, RootState } from '../../store/store';
import type RawMaterial from '../../models/RawMaterial';
import { fetchRawMaterials } from '../../store/slices/rawMaterialSlice';
import { createRawMaterial, deleteRawMaterial, updateRawMaterial } from '../../services/services';

const RawMaterials = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { items: rawMaterials, status } = useSelector((state: RootState) => state.rawMaterial);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<RawMaterial>({ id: 0, name: '', stockQuantity: 0 });

    const [materialToDeleteId, setMaterialToDeleteId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchRawMaterials());
    }, [dispatch]);

    const handleOpenCreate = () => {
        setFormData({ id: 0, name: '', stockQuantity: 0 });
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (material: RawMaterial) => {
        setFormData(material);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setIsFormModalOpen(false);
    };

    const handleOpenDeleteConfirm = (id: number) => {
        setMaterialToDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setMaterialToDeleteId(null);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (formData.id === 0) {
                await createRawMaterial({ name: formData.name, stockQuantity: formData.stockQuantity });
            } else {
                await updateRawMaterial(formData.id, { name: formData.name, stockQuantity: formData.stockQuantity });
            }

            setIsFormModalOpen(false);
            dispatch(fetchRawMaterials());

        } catch (error) {
            console.error("Erro ao salvar insumo:", error);
            alert("Ocorreu um erro ao salvar. Verifique o console.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (materialToDeleteId !== null) {
            setIsSubmitting(true);
            try {
                await deleteRawMaterial(materialToDeleteId);
                dispatch(fetchRawMaterials());
                handleCloseDeleteModal();
            } catch (error) {
                console.error("Erro ao deletar insumo:", error);
                alert("Erro ao excluir. Pode estar sendo usado em alguma receita.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const overlayStyle = { background: 'rgba(0, 0, 0, 0.7)' };

    return (
        
        <div className="flex flex-col gap-6 font-sans">

            <div className="border-b-2 border-[#003366] pb-2 flex justify-between items-center pt-2">
                <h1 className="text-2xl font-extrabold text-[#003366] uppercase tracking-wide">
                    Gerenciamento de Insumos
                </h1>
                <button
                    onClick={handleOpenCreate}
                    className="bg-[#003366] hover:bg-[#002244] text-white px-6 py-2 rounded font-bold transition-colors flex items-center gap-2 text-sm uppercase"
                >
                    <span>+</span> Novo Insumo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#F8FAFC] border border-slate-200 p-6 rounded-lg shadow-inner flex items-center gap-6 transition-transform transform hover:scale-[1.02]">
                    <svg className="w-12 h-12 text-[#00A3E0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                    <div className="flex flex-col">
                        <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Insumos Mapeados</span>
                        <span className="text-4xl font-extrabold text-[#003366]">{rawMaterials.length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-300 shadow-xl shadow-slate-100 rounded-lg overflow-hidden mt-4">
                <div className="bg-[#003366] text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="font-extrabold uppercase tracking-wide text-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#198754] rounded-full animate-pulse"></span>
                        Ordem de Produção Ativa
                    </h3>
                    <span className="text-xs opacity-70 font-mono p-1 bg-white/10 rounded">Sequência Otimizada</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 text-slate-700 text-sm uppercase border-b-2 border-slate-200">
                                <th className="px-6 py-4 font-semibold w-[80px]">Seq</th>
                                <th className="px-6 py-4 font-semibold w-[100px]">Cód. ID</th>
                                <th className="px-6 py-4 font-semibold">Produto</th>
                                <th className="px-6 py-4 font-semibold w-[220px]">Status da Ordem</th>
                                <th className="px-6 py-4 font-semibold w-[150px] text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-800">
                            {rawMaterials.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-bold">Nenhum insumo cadastrado.</td>
                                </tr>
                            ) : (
                                rawMaterials.map((material, index) => (
                                    <tr
                                        key={material.id}
                                        className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-5 font-mono text-slate-400">#{(index + 1).toString().padStart(2, '0')}</td>
                                        <td className="px-6 py-5 font-medium text-slate-500">{material.id}</td>
                                        <td className="px-6 py-5 font-extrabold text-[#003366] text-base">{material.name}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-500 font-semibold">{material.stockQuantity}</span>
                                                <div className="w-full h-2 bg-slate-100 rounded-full">
                                                    <div
                                                        className="h-full bg-[#198754] rounded-full shadow-[0_0_8px_rgba(25,135,84,0.3)]"
                                                        style={{ width: '100%' }}
                                                    />
                                                </div>
                                                <span className="text-[#198754] text-xs font-bold whitespace-nowrap">Completa</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-right flex gap-3 justify-end">
                                            <button
                                                onClick={() => handleOpenEdit(material)}
                                                className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors hover:underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleOpenDeleteConfirm(material.id)}
                                                className="text-red-600 hover:text-red-800 font-semibold text-sm transition-colors hover:underline"
                                            >
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

            <Popup
                open={isFormModalOpen}
                onClose={handleCloseFormModal}
                modal
                nested
                overlayStyle={overlayStyle}
                contentStyle={{ width: '100%', maxWidth: '480px', padding: '0', border: 'none', background: 'transparent' }}
                className="popup-with-animation" 
            >
                <div className="bg-[#F1F5F9] border border-slate-300 rounded-lg shadow-2xl overflow-hidden p-8 animate-slide-in-down">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-300 pb-4">
                        <h2 className="text-xl font-extrabold text-[#003366] uppercase tracking-tight">
                            {formData.id === 0 ? 'Cadastrar Novo Insumo' : 'Editar Insumo'}
                        </h2>
                        <button onClick={handleCloseFormModal} className="text-slate-400 hover:text-red-600 text-lg font-bold">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">Nome do Insumo</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Resina Polipropileno Azul"
                                className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-slate-800 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] shadow-sm font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wide">Quantidade em Estoque</label>
                            <input
                                type="number"
                                required
                                min="0"
                                placeholder="0"
                                className="w-full bg-white border border-slate-300 rounded px-4 py-3 text-slate-800 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366] shadow-sm font-medium"
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-6 border-t border-slate-300 pt-6">
                            <button
                                type="button"
                                onClick={handleCloseFormModal}
                                className="px-6 py-3 text-slate-600 hover:bg-slate-200 rounded font-bold uppercase tracking-wide text-xs transition-colors"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#003366] hover:bg-[#002244] text-white px-8 py-3 rounded font-extrabold uppercase tracking-wide text-xs transition-colors disabled:opacity-50 min-w-[150px] shadow-md flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Processando...
                                    </>
                                ) : 'Salvar Insumo Mín/Máx'}
                            </button>
                        </div>
                    </form>
                </div>
            </Popup>

            <Popup
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                modal
                nested
                overlayStyle={overlayStyle}
                contentStyle={{ width: '100%', maxWidth: '400px', padding: '0', border: 'none', background: 'transparent' }}
                className="popup-with-animation"
            >
                <div className="bg-white border border-slate-300 rounded-lg shadow-2xl overflow-hidden p-8 animate-slide-in-down flex flex-col items-center justify-center text-center">

                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-800 uppercase tracking-tight">
                        Confirmar Exclusão
                    </h2>
                    <p className="text-slate-600 mt-2 leading-relaxed">
                        Tem certeza absoluta que deseja excluir este insumo? Essa ação <span className="text-red-600 font-bold">não pode ser desfeita</span> e pode quebrar receitas associadas.
                    </p>

                    <div className="flex gap-4 mt-8 border-t border-slate-200 pt-6 w-full justify-center">
                        <button
                            type="button"
                            onClick={handleCloseDeleteModal}
                            className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded font-bold uppercase tracking-wide text-xs transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleDeleteConfirm}
                            disabled={isSubmitting}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-extrabold uppercase tracking-wide text-xs transition-colors disabled:opacity-50 min-w-[150px] shadow-md flex justify-center items-center gap-2"
                        >
                            {isSubmitting ? 'Excluindo...' : 'Sim, Excluir Insumo'}
                        </button>
                    </div>
                </div>
            </Popup>

        </div>
    );
};

export default RawMaterials;