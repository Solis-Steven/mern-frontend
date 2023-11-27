import { useState } from "react";
import { Link } from "react-router-dom";
import { Alerta } from "../components/Alerta";
import { clienteAxios } from "../config/clienteAxios";

export function Registrar() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repetirPassword, setRepetirPassword] = useState("");
    const [alerta, setAlerta] = useState({});

    const handleSubmit = async e => {
        e.preventDefault();

        if([nombre, email, password, repetirPassword].includes("")) {
            setAlerta({
                msg: "Todos los campos son obligatorios",
                error: true
            });
            return;
        }

        if(password !== repetirPassword) {
            setAlerta({
                msg: "Los passwords no son iguales",
                error: true
            });
            return;
        }

        if(password.length < 6) {
            setAlerta({
                msg: "El password es muy corto, agrega mínimo 6 caracteres",
                error: true
            });
            return;
        }

        // Crear el usuairo en la API
        try {
            const { data } = await clienteAxios.post("/usuarios", {
                nombre,
                email,
                password
            });

            setAlerta({
                msg: data.msg,
                error: false
            });

            setNombre("");
            setEmail("");
            setPassword("");
            setRepetirPassword("");
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            });
        }
    }

    const { msg } = alerta;
    
    return(
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">
                Crea tu cuenta y administra tus {""}
                <span className="text-slate-700">proyectos</span>
            </h1>
        
            <form 
                onSubmit={handleSubmit}
                className="my-10 bg-white shadow rounded-lg p-10">
                <div className="my-5">
                    <label 
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="nombre">
                        Nombre
                    </label>
                    <input 
                        id="nombre"
                        type="text"
                        placeholder="Tu nombre"
                        value={nombre}
                        onChange={e => setNombre(e.target.value)}
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50" />
                </div>

                <div className="my-5">
                    <label 
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="email">
                        Email
                    </label>
                    <input 
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50" />
                </div>

                <div className="my-5">
                    <label 
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="password">
                        Password
                    </label>
                    <input 
                        id="password"
                        type="password"
                        placeholder="Password de Registro"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50" />
                </div>

                <div className="my-5">
                    <label 
                        className="uppercase text-gray-600 block text-xl font-bold"
                        htmlFor="repetir-password">
                        Repetir Password
                    </label>
                    <input 
                        id="repetir-password"
                        type="password"
                        placeholder="Repetir Tu Password"
                        value={repetirPassword}
                        onChange={e => setRepetirPassword(e.target.value)}
                        className="w-full mt-3 p-3 border rounded-xl bg-gray-50" />
                </div>

                <input
                    type="submit"
                    value="Crear Cuenta"
                    className="bg-sky-700 mb-5 w-full py-3 text-white uppercase
                    font-bold rounded hover:cursor-pointer hover:bg-sky-800
                    transition-colors"
                />

                {
                    msg && (<Alerta alerta={alerta}/>)
                }
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link 
                    to="/"
                    className="block text-center my-5 text-slate-500 uppercase
                    text-sm">
                    ¿Ya tienes una cuenta? Inicia Sesión
                </Link>

                <Link 
                    to="/olvide-password"
                    className="block text-center my-5 text-slate-500 uppercase
                    text-sm">
                    Olvidé Mi Password
                </Link>
            </nav>
        </>
    );
}