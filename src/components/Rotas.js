import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.js";
import Register from "../pages/Register.js";
import { Outlet, Navigate } from 'react-router-dom';
import authService from "../services/auth.service";
import Login from "../pages/Login.js";
import ListaAcoes from "../pages/ListaAcoes.js";
import Favoritas from "../pages/Favoritas.js";
import ListaFIIs from "../pages/ListaFiis.js";
import FavoritosFiis from "../pages/FiisFavoritos.js";
import GlossarioAcoes from "../pages/GlossarioAcoes.js";

export const PrivateRoute = () => {
    const isAuthenticated = authService.isAuthenticated();

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function Rotas() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Register />} />

            <Route path='/' element={<PrivateRoute />}>
                <Route index element={<Home />} />
                <Route path="/listaAcoes" element={<ListaAcoes />} />
                <Route path="/listaFiis" element={<ListaFIIs />} />
                <Route path="/favoritas" element={<Favoritas />} />
                <Route path="/favoritosFiis" element={<FavoritosFiis />} />
                <Route path="/glossario-acoes" element={<GlossarioAcoes />} />
            </Route>
        </Routes>
    );
}

export default Rotas;