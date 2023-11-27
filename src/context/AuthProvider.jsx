import { useState, useEffect, createContext } from "react";
import { clienteAxios } from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({});
    const [cargando, setCargando] = useState(true);

    const navigate = useNavigate();

    const cerrarSesionAuth = () => {
        setAuth({});
    }

    useEffect(() => {
        const autenticarUsuario = async() => {
            const token = localStorage.getItem("token");
            
            if(token) {
                const config = {
                    headers: {
                        "Content-Type":  "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
                try {
                    const { data } = await clienteAxios("/usuarios/perfil", config);
                    setAuth(data);
                    // navigate("/proyectos")
                } catch (error) {
                    setAuth({});
                    console.log("Error al autenticar usuario: ", error);
                }

            }
            setCargando(false);
        }
        autenticarUsuario();
    }, []);

    return(
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;