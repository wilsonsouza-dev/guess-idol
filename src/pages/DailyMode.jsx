import React, {useEffect, useState} from "react";
import idolsData from "../../idols.json";
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
    const HISTORY_KEY = "daily-history"; // 🔑 histórico do Daily
    const escolherIdoloPorData = () => {
        if (!idolsData || idolsData.length === 0) return null; // retorna null se não houver ídolos

        const hoje = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

        // Função de hash determinístico, embaralhado
        const hashCode = (str) => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                // shift e xor para embaralhar os bits
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash ^= (hash >> 13);
                hash |= 0; // converte para int32
            }
            return Math.abs(hash);
        };

        const numero = hashCode(hoje);           // número determinístico baseado na data
        const indice = numero % idolsData.length; // índice válido dentro do array
        return idolsData[indice];                 // retorna o ídolo do dia
    };


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

        // 👉 salva histórico apenas quando o jogo termina
        if (novaMensagemFinal) {
            const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || {};
            const resultado = novasChances; // número de chances que precisou
            history[resultado] = (history[resultado] || 0) + 1;
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        }
    };


    const novoJogo = () => {
        const secreto = escolherIdoloPorData(); // Usa função determinística
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