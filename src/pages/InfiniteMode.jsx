import React, {useEffect, useState} from "react";
import idolsData from "../../idols.json";
import GuessTable from "../components/GuessTable";
import ModeSwitcher from "../components/ModeSwitcher.jsx";

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
    const LOCAL_KEY = "infinite-idol";

    // 🔹 Carregar dados do localStorage
    useEffect(() => {
        setIdols(idolsData);

        const savedRecorde = JSON.parse(localStorage.getItem(RECORDE_KEY));
        if (savedRecorde) setRecorde(savedRecorde);

        const savedData = JSON.parse(localStorage.getItem(LOCAL_KEY));
        if (savedData && savedData.idoloSecreto) {
            setTentativas(savedData.tentativas || []);
            setChances(savedData.chances || 0);
            setMensagemFinal(savedData.mensagemFinal || "");
            setIdoloSecreto(savedData.idoloSecreto);
            setAtual(savedData.atual);
        } else {
            novoJogo();
        }
    }, []);

    // 🔹 Atualizar recorde/streak
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

    const salvarLocalStorage = (novasTentativas, novasChances, novaMensagemFinal) => {
        localStorage.setItem(
            LOCAL_KEY,
            JSON.stringify({
                tentativas: novasTentativas,
                chances: novasChances,
                mensagemFinal: novaMensagemFinal,
                idoloSecreto,
                // 🔹 Salvar streak atualizado ao ganhar
                atual: novaMensagemFinal.includes("❌")
                    ? 0
                    : (novaMensagemFinal.includes("Parabéns") ? atual + 1 : atual),
            })
        );
    };

    // 🔹 Novo jogo
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
            <h1>🎤 GUESS THE IDOL <ModeSwitcher/></h1>

            <div className="scoreboard">
                <p>🏆 Recorde: {recorde}</p>
                <p>🔥 Atual: {atual}</p>
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
                atualizarPontuacao={atualizarPontuacao}
                salvarLocalStorage={salvarLocalStorage} // 🔑 novo
            />

            {mensagemFinal && (
                <div className="next-idol">
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
