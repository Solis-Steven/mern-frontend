import { useEffect, useState } from "react";
import { useProyectos } from "../hooks/useProyectos";
import { Alerta } from "./Alerta";
import { useParams } from "react-router-dom";

export function FormulariosProyecto() {
    const [idP, setIdP] = useState(null);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fechaEntrega, setFechaEntrega] = useState("");
    const [cliente, setCliente] = useState("");

    const { alerta, mostrarAlerta, nuevoProyecto, editarProyecto, proyectoActual } = useProyectos();

    const { id } = useParams();

    useEffect(() => {
        if(id) {
            setIdP(proyectoActual._id)
            setNombre(proyectoActual.nombre);
            setDescripcion(proyectoActual.descripcion);
            setFechaEntrega(proyectoActual.fechaEntrega?.split("T")[0]);
            setCliente(proyectoActual.cliente);
            return;
        }


    }, [id])

    const handleSubmit = async e => {
        e.preventDefault();
        if([nombre, descripcion, fechaEntrega, cliente].includes("")) {
            mostrarAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            });
            return;
        }

        // Pasar los datos hacia el provider
        if(idP) {
            await editarProyecto({ idP, nombre, descripcion, fechaEntrega, cliente });
        } else {
            await nuevoProyecto({ nombre, descripcion, fechaEntrega, cliente });
        }
        setIdP(null);
        setNombre("");
        setDescripcion("");
        setFechaEntrega("");
        setCliente("");
    }

    const { msg } = alerta;

    return(
        <form 
            onSubmit={handleSubmit}
            className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow">
            <div className="mb-5">
                <label 
                    htmlFor="nombre"
                    className="text-gray-700 uppercase font-bold text-sm">
                        Nombre Proyecto
                </label>
                
                <input 
                    id="nombre"
                    type="text" 
                    placeholder="Nombre del proyecto"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    className="border w-full p-2 mt-2 placeholder-gray-400
                    rounded-md"    
                />
            </div>

            <div className="mb-5">
                <label 
                    htmlFor="descripcion"
                    className="text-gray-700 uppercase font-bold text-sm">
                        Descripción
                </label>
                
                <textarea 
                    id="descripcion"
                    placeholder="Descripción del proyecto"
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    className="border w-full p-2 mt-2 placeholder-gray-400
                    rounded-md"    
                />
            </div>

            <div className="mb-5">
                <label 
                    htmlFor="fecha-entrega"
                    className="text-gray-700 uppercase font-bold text-sm">
                        Fecha Entrega
                </label>
                
                <input 
                    id="fecha-entrega"
                    type="date"
                    value={fechaEntrega}
                    onChange={e => setFechaEntrega(e.target.value)}
                    className="border w-full p-2 mt-2 placeholder-gray-400
                    rounded-md"    
                />
            </div>

            <div className="mb-5">
                <label 
                    htmlFor="nombre-cliente"
                    className="text-gray-700 uppercase font-bold text-sm">
                        Nombre Cliente
                </label>
                
                <input 
                    id="nombre-cliente"
                    type="text" 
                    placeholder="Nombre del cliente"
                    value={cliente}
                    onChange={e => setCliente(e.target.value)}
                    className="border w-full p-2 mt-2 placeholder-gray-400
                    rounded-md"    
                />
            </div>

            <input 
                type="submit"
                value={idP ? "Actualizar Proyecto" : "Crear Proyecto"}
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white
                rounded cursor-pointer hover:bg-sky-700 transition-colors"
            />

            {
                msg && (<Alerta alerta={alerta} />)
            }
        </form>
    );
}