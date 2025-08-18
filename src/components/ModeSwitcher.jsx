import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ModeSwitcher() {
    const navigate = useNavigate();
    const location = useLocation();
    const isDaily = location.pathname === "/daily";

    const toggleMode = () => {
        navigate(isDaily ? "/infinite" : "/daily");
    };

    return (
        <button className={"modo"} onClick={toggleMode}>
            {isDaily ? "🌐 Modo Infinito" : "📅 Modo Diário"}
        </button>
    );
}
