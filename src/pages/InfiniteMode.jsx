import React, {useEffect, useState} from "react";
import idolsData from "../idols.json";
import GuessTable from "../components/GuessTable";
import ModeSwitcher from "../components/ModeSwitcher";

export default function InfiniteMode() {
    const [idols, setIdols] = useState([]);
    const [idoloSecreto, setIdoloSecreto] = useState(null);
    const [tentativas, setTentativas] = useState([]);
    const [palpite, setPalpite] = useState("");
    const [sugestoes, setSugestoes] = useState([]);
    const [chances, setChances] = useState(0);
    const [mensagemFinal, setMensagemFinal] = useState("");
    const [streak, setStreak] = useState(0);

    const STREAK_KEY = "infinite-streak";

    useEffect(() => {
        setIdols(idolsData);
        const saved = JSON.parse(localStorage.getItem(STREAK_KEY));
        if (saved) setStreak(saved);
        novoJogo();
    }, []);

    const atualizarStreak = (ganhou) => {
        let novaStreak = ganhou ? streak + 1 : 0;
        setStreak(novaStreak);
        localStorage.setItem(STREAK_KEY, JSON.stringify(novaStreak));
    };

    const novoJogo = () => {
        const secreto = idolsData[Math.floor(Math.random() * idolsData.length)];
        setIdoloSecreto(secreto);
        setTentativas([]);
        setChances(0);
        setMensagemFinal("");
        setPalpite("");
        setSugestoes([]);
    };

    const handleRecomecar = () => {
        setStreak(0);
        localStorage.setItem(STREAK_KEY, JSON.stringify(0));
        novoJogo();
    };

    return (
        <div className="container">
            <h1 className="titulo">Guess the Idol - Infinito 🎤</h1>
            <ModeSwitcher/>
            <h3>Win streak: {streak}</h3>

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
                atualizarStreak={atualizarStreak}
            />

            {/* Botões de controle após o jogo acabar */}
            {mensagemFinal && (
                <div className="botoes-fim">
                    {mensagemFinal.includes("Parabéns") ? (
                        <button onClick={novoJogo}>🎶 Próxima Idol</button>
                    ) : (
                        <button onClick={handleRecomecar}>🔄 Recomeçar</button>
                    )}
                </div>
            )}
        </div>
    );
}
