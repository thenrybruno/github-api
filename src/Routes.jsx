import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/home"
import Repositorio from "./pages/repositorio"

export default function RoutesPage () {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/repositorio/:repositorio" element={<Repositorio/>}/>
            </Routes>
        </BrowserRouter>
    )
}