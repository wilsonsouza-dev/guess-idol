import React, { useState, useEffect } from "react";
import idolsData from "../idols.json";
import GuessTable from "../components/GuessTable";
import ModeSwitcher from "../components/ModeSwitcher";

export default function DailyMode() {
    const [idols, setIdols] = useState([]);
    const [idoloSecreto, setIdoloSecreto] = useState(null);
    const [tentativas, setTentativas] = useState([]);
    const [palpite, setPalpite] = useState("");
    const [sugestoes, setSugestoes] = useState([]);
    const [chances, setChances] = useState(0);
    const [mensagemFinal, setMensagemFinal] = useState("");

    const LOCAL_KEY = "daily-idol";

    useEffect(() => {
        setIdols(idolsData);

        // Checar se já existe tentativa do dia
        const saved = JSON.parse(localStorage.getItem(LOCAL_KEY));
        const hoje = new Date().toDateString();

        if (saved && saved.date === hoje) {
            setTentativas(saved.tentativas);
            setChances(saved.chances);
            setMensagemFinal(saved.mensagemFinal);
            setIdoloSecreto(saved.idoloSecreto);
        } else {
            novoJogo();
        }
    }, []);

    const salvarLocalStorage = (novasTentativas, novasChances, novaMensagemFinal) => {
        localStorage.setItem(
            LOCAL_KEY,
            JSON.stringify({
                tentativas: novasTentativas,
                chances: novasChances,
                mensagemFinal: novaMensagemFinal,
                idoloSecreto,
                date: new Date().toDateString(),
            })
        );
    };

    return (
        <div className="container">
            <h1 className="titulo">Guess the Idol - Diário 🎤</h1>
            <ModeSwitcher />
            <GuessTable
                tentativas={tentativas}
                palpite={palpite}
                setPalpite={setPalpite}
                sugestoes={sugestoes}
                setSugestoes={setSugestoes}
                setTentativas={setTentativas}
                chances={chances}
                setChances={setChances}
                mensagemFinal={mensagemFinal}
                setMensagemFinal={setMensagemFinal}
                idoloSecreto={idoloSecreto}
                idols={idols}
                salvarLocalStorage={salvarLocalStorage}
            />
        </div>
    );
}
