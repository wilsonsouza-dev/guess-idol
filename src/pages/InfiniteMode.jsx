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

    const [atual, setAtual] = useState(0); // streak atual
    const [recorde, setRecorde] = useState(0); // recorde salvo

    const RECORDE_KEY = "infinite-recorde";

    useEffect(() => {
        setIdols(idolsData);
        const savedRecorde = JSON.parse(localStorage.getItem(RECORDE_KEY));
        if (savedRecorde) setRecorde(savedRecorde);
        novoJogo();
    }, []);

    const atualizarPontuacao = (ganhou) => {
        if (ganhou) {
            const novoAtual = atual + 1;
            setAtual(novoAtual);

            if (novoAtual > recorde) {
                setRecorde(novoAtual);
                localStorage.setItem(RECORDE_KEY, JSON.stringify(novoAtual));
            }
        } else {
            setAtual(0);
        }
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

    return (
        <div className="container">
            <h1 className="titulo">Guess the Idol - Infinito 🎤</h1>
            <ModeSwitcher/>

            <div className="scoreboard">
                <p>🔥 Atual: {atual}</p>
                <p>🏆 Recorde: {recorde}</p>
            </div>

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
                atualizarStreak={atualizarPontuacao} // só troquei o nome pra manter compatível
            />

            {mensagemFinal && (
                <div className="botoes-fim">
                    {mensagemFinal.includes("Parabéns") ? (
                        <button onClick={novoJogo}>🎶 Próxima Idol</button>
                    ) : (
                        <button onClick={novoJogo}>🔄 Recomeçar</button>
                    )}
                </div>
            )}
        </div>
    );
}
