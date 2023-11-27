import { useState, useEffect, createContext } from "react";
import { clienteAxios } from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

let socket;

const ProyectosContext = createContext();

export const ProyectosProvider = ({children}) => {
    const [proyectos, setProyectos] = useState([]);
    const [alerta, setAlerta] = useState({});
    const [proyectoActual, setProyectoActual] = useState({});
    const [cargando, setCargando] = useState(false);
    const [cargandoColaborador, setCargandoColaborador] = useState(false);
    const [modalTarea, setModalTarea] = useState(false);
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false);
    const [tareaActual, setTareaActual] = useState({});
    const [colaborador, setColaborador] = useState({});
    const [buscador, setBuscador] = useState(false);

    const navigate = useNavigate();

    const { auth } = useAuth();

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem("token");

                if(!token) {
                    return;
                }

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios("/proyectos", config);
                setProyectos(data);
            } catch (error) {
                console.log("Error al obtener proyectos: ", error);
            }
        }
        obtenerProyectos();
    }, [auth]);

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
    }, []);


    const mostrarAlerta = nuevaAlerta => {
        setAlerta(nuevaAlerta)

        setTimeout(() => {
            setAlerta({});
        }, 5000);
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem("token");

            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.idP}`, proyecto, config);

            const proyectosActualizados = proyectos.map(proyectoState => 
                proyectoState._id === data._id ? data : proyectoState);
            setProyectos(proyectosActualizados);

            setAlerta({
                msg: "Proyecto editado correctamente",
                error: false
            });

            setTimeout(() => {
                setAlerta({});
                navigate("/proyectos");
            }, 3000);
        } catch (error) {
            console.log("Error al editar proyecto: ", error);
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem("token");

            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post("/proyectos", proyecto, config);

            setProyectos([...proyectos, data]);

            setAlerta({
                msg: "Proyecto creado correctamente",
                error: false
            });

            setTimeout(() => {
                setAlerta({});
                navigate("/proyectos");
            }, 3000);
        } catch (error) {
            console.log("Error al crear proyecto: ", error);
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true);
        try {
            const token = localStorage.getItem("token");

            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config);
            setProyectoActual(data);
        } catch (error) {
            navigate("/proyectos");
            console.log("Error al obtener proyecto: ", error);
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }

        setCargando(false);
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem("token");
     
            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);

            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id);
            setProyectos(proyectosActualizados);

            setAlerta({
                msg: data.msg,
                error: false
            });

            setTimeout(() => {
                setAlerta({});
                navigate("/proyectos");
            }, 3000);
        } catch (error) {
            console.log("Error al eliminar proyecto: ", error);
        }
    }

    const handleModalTarea = () => {
        setModalTarea(!modalTarea);
        setTareaActual({});
    }
    
    const crearTarea = async(tarea) => {
        try {
            const token = localStorage.getItem("token");
     
            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post("/tareas", tarea, config);

            setAlerta({});
            setModalTarea(false);

            //* Socke io
            socket.emit("nueva tarea", data);
        } catch (error) {
            console.log("Error al crear tarea: ", error);
        }
    }

    const editarTarea = async(tarea) => {
        try {
            const token = localStorage.getItem("token");
     
            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/tareas/${tarea.idT}`, tarea, config);
            
            //* socket io
            socket.emit("actualizar tarea", data);

            setAlerta({});
            setModalTarea(false);
        } catch (error) {
            console.log("Error al editar tarea: ", error);
        }
    }

    const submitTarea = async(tarea) => {

        if(tarea?.idT) {
            await editarTarea(tarea);
        } else {
            await crearTarea(tarea);
        }
    }

    const handleModalEditarTarea = tarea => {
        setTareaActual(tarea);
        setModalTarea(true);
    }

    const handleModalEliminarTarea = (tarea = {}) => {
        setTareaActual(tarea);
        setModalEliminarTarea(!modalEliminarTarea);
    }

    const eliminarTarea = async() => {
        try {
            const token = localStorage.getItem("token");
     
            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/tareas/${tareaActual._id}`, config);
            
            setModalEliminarTarea(false);
            
            //* Socket io
            socket.emit("eliminar tarea", tareaActual);

            setTareaActual({});
            mostrarAlerta({
                msg: data.msg,
                error: false
            });
        } catch (error) {
            console.log("Error al eliminar tarea: ", error);
        }
    }   

    const submitColaborador = async(email) => {
        setCargandoColaborador(true);
        setColaborador({});
        try {
            const token = localStorage.getItem("token");
     
            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post("/proyectos/colaboradores", {email}, config);
            setColaborador(data);
            setAlerta({});
        } catch (error) {
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            });
            setColaborador({});
        }
        setCargandoColaborador(false);
    }

    const agregarColaborador = async(email) => {
        try {
            const token = localStorage.getItem("token");
     
            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { _id } = proyectoActual;

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${_id}`, email, config);
            mostrarAlerta({
                msg: data.msg,
                error: false
            });
            setColaborador({});
        } catch (error) {
            console.log("Error al agregar colaborador: ", error);
            mostrarAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const handleModalEliminarColaborador = colaborador => {
        setModalEliminarColaborador(!modalEliminarColaborador);
        setColaborador(colaborador);

    }

    const eliminarColaborador = async() => {
        try {
            const token = localStorage.getItem("token");
     
            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { _id } = proyectoActual;

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${_id}`, {id: colaborador._id}, config);

            const proyectoActualizado = {...proyectoActual}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(
                colaboradorState => colaboradorState._id !== colaborador._id
            );
            setProyectoActual(proyectoActualizado);

            mostrarAlerta({
                msg: data.msg,
                error: false
            });
            setColaborador({});
            setModalEliminarColaborador(false);
        } catch (error) {
            console.log("Error al eliminar colaborador: ", error);
        }
    }

    const completarTarea = async(id) => {
        try {
            const token = localStorage.getItem("token");
     
            if(!token) {
                return;
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config);

            //* socket
            socket.emit("cambiar estado", data);

            setTareaActual({});
            setAlerta({});

        } catch (error) {
            console.log("Error al cambiar estado de tarea: ", error);
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador);
    }

    //* Socket io
    const submitTareasProyecto = (tarea) => {
        // Agrega la tarea al state
        const proyectoActualizado = {...proyectoActual}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
        setProyectoActual(proyectoActualizado);
    }

    const submitEliminarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyectoActual}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id);
        setProyectoActual(proyectoActualizado);
    }

    const submitActualizarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyectoActual}
        proyectoActual.tareas = proyectoActualizado.tareas.map(
            tareaState => tareaState._id === tarea._id ? tarea : tareaState);
        setProyectoActual(proyectoActualizado);
    }

    const submitCambiarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyectoActual}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState =>
            tareaState._id === tarea._id ? tarea : tareaState);
        setProyectoActual(proyectoActualizado);
    }

    const cerrarSesionProyectos = () => {
        setProyectos([]);
        setProyectoActual({});
        setAlerta({});
    }

    return(
        <ProyectosContext.Provider
            value={{
                proyectos,
                alerta,
                mostrarAlerta,
                nuevoProyecto,
                obtenerProyecto,
                proyectoActual,
                cargando,
                editarProyecto,
                eliminarProyecto,
                modalTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tareaActual,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                cargandoColaborador,
                colaborador,
                agregarColaborador,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                submitEliminarTareaProyecto,
                submitActualizarTareaProyecto,
                submitCambiarTareaProyecto,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    );
}

export default ProyectosContext;