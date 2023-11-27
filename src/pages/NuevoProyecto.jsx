import { FormulariosProyecto } from "../components/FormulariosProyecto";

export function NuevoProyecto() {
    return(
        <>
            <h1 className="text-4xl font-black">Crear Proyecto</h1>

            <div className="mt-10 flex justify-center">
                <FormulariosProyecto />
            </div>
        </>
    );
}