import { useEinesStore } from "../stores/storeEines";


export function Formulari() {
    const { setEinaSeleccionada } = useEinesStore();
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-200/10 z-50">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-xl mb-4">Formulari d'Activitats</h2>
                {/* Aquí va el contingut del formulari */}
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => setEinaSeleccionada(null)} // Tanca el formulari
                >
                    Tanca
                </button>
            </div>
        </div>
    );
}
