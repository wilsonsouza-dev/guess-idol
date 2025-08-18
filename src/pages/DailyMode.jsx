import React, {useEffect, useState} from "react";
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

    // Função determinística para escolher o idoloSecreto com base na data
    const escolherIdoloPorData = () => {
        const hoje = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
        // Soma os caracteres da data para criar um valor determinístico
        const somaCaracteres = hoje
            .split("")
            .reduce((acc, char) => acc + char.charCodeAt(0), 0);
        // Usa módulo para mapear ao tamanho do array idolsData
        const indice = somaCaracteres % idolsData.length;
        return idolsData[indice];
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
            <h1>🎤 Guess the Idol: Diário</h1>
            <div className="header-daily">
                <ModeSwitcher/>
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
                salvarLocalStorage={salvarLocalStorage}
            />

        </div>
    );
}