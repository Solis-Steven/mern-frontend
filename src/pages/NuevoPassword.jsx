import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alerta } from "../components/Alerta";
import { clienteAxios } from "../config/clienteAxios";

export function NuevoPassword() {
    const { token }= useParams();

    const [password, setPassword] = useState("");
    const [alerta, setAlerta] = useState({});
    const [tokenValido, setTokenValido] = useState(false);
    const [passwordModificado, setPasswordModificado] = useState(false);
    

    useEffect(() => {
        const comprobarToken = async() => {
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`); 

                setTokenValido(true);
            } catch (error) {
                setAlerta({
                    msg: error.response.data.msg,
                    error: true
                });
            }
        }
        comprobarToken();
    }, []);

    const { msg } = alerta;

    const handleSubmit = async e => {
        e.preventDefault();

        if(password.length < 6) {
            setAlerta({
                msg: "El password debe ser minimo de 6 caracteres",
                error: true
            });
            return;
        }

        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {
                password
            });

            setAlerta({
                msg: data.msg,
                error: false
            });

            setPassword("");
            setPasswordModificado(true);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    return(
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Restablece tu password y no pierdas acceso a tus {""}
                <span className="text-slate-700">proyectos</span>
            </h1>

            {
                msg && (<Alerta alerta={alerta}/>)
            }
        
            {
                tokenValido && (
                    <form 
                        onSubmit={handleSubmit}
                        className="my-10 bg-white shadow rounded-lg p-10">
                        <div className="my-5">
                            <label 
                                className="uppercase text-gray-600 block text-xl font-bold"
                                htmlFor="password">
                                Nuevo Password
                            </label>
                            <input 
                                id="password"
                                type="password"
                                placeholder="Escribe tu nuevo Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full mt-3 p-3 border rounded-xl bg-gray-50" />
                        </div>

                        <input
                            type="submit"
                            value="Guardar nuevo Password"
                            className="bg-sky-700 mb-5 w-full py-3 text-white uppercase
                            font-bold rounded hover:cursor-pointer hover:bg-sky-800
                            transition-colors"
                        />
                    </form>
                )
            }

                {
                    passwordModificado && (
                        <Link 
                            to="/"
                            className="block text-center my-5 text-slate-500 uppercase
                            text-sm">
                            Inicia Sesión
                        </Link>
                    )
            }
        </>
    );
}