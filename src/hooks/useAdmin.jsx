import { useAuth } from "./useAuth";
import { useProyectos } from "./useProyectos";

const useAdmin = () => {
    const { proyectoActual } = useProyectos();
    const { auth } = useAuth();

    return(proyectoActual?.creador === auth._id);
}

export default useAdmin;