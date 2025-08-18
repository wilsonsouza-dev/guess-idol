import React from "react";
import Select from 'react-select';
import Confetti from 'react-confetti';

export default function GuessTable({
                                       tentativas,
                                       palpite,
                                       setPalpite,
                                       sugestoes,
                                       setSugestoes,
                                       setTentativas,
                                       chances,
                                       setChances,
                                       mensagemFinal,
                                       setMensagemFinal,
                                       idoloSecreto,
                                       salvarLocalStorage,
                                       atualizarStreak,
                                       idols,
                                   }) {
    // Lógica de input e sugestões
    const handleInput = (inputValue) => {
        const valor = inputValue;
        setPalpite(valor);

        if (valor.length > 0) {
            const filtrados = idols
                .filter((idolo) => idolo.nome.toLowerCase().startsWith(valor.toLowerCase()))
                .sort((a, b) => a.nome.localeCompare(b.nome, "pt", {sensitivity: "base"}))
                .slice(0, 10);

            setSugestoes(filtrados);
        } else {
            setSugestoes([]);
        }
    };

    const escolherSugestao = (idolo) => {
        if (idolo) {
            verificarPalpite(idolo);
        }
        // Limpa o campo e a lista de sugestões após a seleção
        setPalpite("");
        setSugestoes([]);
    };

    const verificarPalpite = (idolo) => {
        if (!idoloSecreto || mensagemFinal) return;

        const resultado = {
            nome: idolo.nome,
            grupo: idolo.grupo,
            empresa: idolo.empresa,
            ano_nascimento: idolo.ano_nascimento,
            nacionalidade: idolo.nacionalidade,
            altura_cm: idolo.altura_cm,
            posicao: idolo.posicao,
            feedback: {},
        };

        // Nome, grupo, empresa
        resultado.feedback.nome = idolo.nome === idoloSecreto.nome ? "correto" : "";
        resultado.feedback.grupo = idolo.grupo === idoloSecreto.grupo ? "correto" : "";
        resultado.feedback.empresa = idolo.empresa === idoloSecreto.empresa ? "correto" : "";

        // Ano de nascimento
        if (idolo.ano_nascimento === idoloSecreto.ano_nascimento) {
            resultado.feedback.ano_nascimento = "correto";
        } else if (Math.abs(idolo.ano_nascimento - idoloSecreto.ano_nascimento) <= 1) {
            resultado.feedback.ano_nascimento = idolo.ano_nascimento > idoloSecreto.ano_nascimento ? "proximo-maior" : "proximo-menor";
        } else {
            resultado.feedback.ano_nascimento = idolo.ano_nascimento > idoloSecreto.ano_nascimento ? "maior" : "menor";
        }

        // Altura
        if (idolo.altura_cm === idoloSecreto.altura_cm) {
            resultado.feedback.altura_cm = "correto";
        } else if (Math.abs(idolo.altura_cm - idoloSecreto.altura_cm) <= 1) {
            resultado.feedback.altura_cm = idolo.altura_cm > idoloSecreto.altura_cm ? "proximo-maior" : "proximo-menor";
        } else {
            resultado.feedback.altura_cm = idolo.altura_cm > idoloSecreto.altura_cm ? "maior" : "menor";
        }

        // Nacionalidade
        if (idolo.nacionalidade === idoloSecreto.nacionalidade) {
            resultado.feedback.nacionalidade = "correto";
        } else if (idolo.nacionalidade.includes(idoloSecreto.nacionalidade) || idoloSecreto.nacionalidade.includes(idolo.nacionalidade)) {
            resultado.feedback.nacionalidade = "proximo";
        }

        // Posição (avaliação individual por mini-bloco)
        resultado.feedback.posicao = idolo.posicao.map((p) =>
            idoloSecreto.posicao.includes(p) ? "correto" : ""
        );

        const novasTentativas = [...tentativas, resultado];
        setTentativas(novasTentativas);
        setChances(chances + 1);

        // Salvar no localStorage se existir (modo diário)
        if (salvarLocalStorage) salvarLocalStorage(novasTentativas, chances + 1, mensagemFinal);

        // Mensagem final com delay
        const finalMessage = () => {
            if (idolo.nome === idoloSecreto.nome) {
                if (atualizarStreak) atualizarStreak(true); // modo infinito
                setMensagemFinal("🎉 Parabéns! Você acertou a idol");
            } else if (chances + 1 >= 10) {
                if (atualizarStreak) atualizarStreak(false); // modo infinito
                setMensagemFinal(`❌ Você perdeu! A idol era ${idoloSecreto.nome} - ${idoloSecreto.grupo}.`);
            }
        };

        setTimeout(finalMessage, 2500);
    };

    // Opções para o react-select, baseadas no estado sugestoes
    const options = sugestoes.map((idolo) => ({
        value: idolo.nome,
        label: `${idolo.nome} - ${idolo.grupo}`,
        idolo,
    }));

    return (
        <div className="guess-table-container">
            {mensagemFinal.includes("Parabéns") && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                    tweenDuration={5000}
                />
            )}
            <div className="input-wrapper">
                <Select
                    options={options}
                    onChange={(selectedOption) => escolherSugestao(selectedOption ? selectedOption.idolo : null)}
                    onInputChange={handleInput}
                    inputValue={palpite}
                    placeholder="Digite o nome da idol..."
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    value={null}
                    isDisabled={mensagemFinal !== ""} // Desabilita o input quando o jogo termina
                />
                <span className="chances">{chances} / 10</span>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Grupo</th>
                    <th>Empresa</th>
                    <th>Nacionalidade</th>
                    <th>Ano Nasc.</th>
                    <th>Altura</th>
                    <th>Posição</th>
                </tr>
                </thead>
                <tbody>
                {tentativas.map((t, i) => (
                    <tr key={i} className="reveal">
                        <td className={t.feedback.nome}>{t.nome}</td>
                        <td className={t.feedback.grupo}>{t.grupo}</td>
                        <td className={t.feedback.empresa}>{t.empresa}</td>
                        <td className={t.feedback.nacionalidade}>{t.nacionalidade}</td>
                        <td className={t.feedback.ano_nascimento}>
                            <div className="valor-com-seta">
                                {t.ano_nascimento}
                                {(t.feedback.ano_nascimento === "maior" || t.feedback.ano_nascimento === "proximo-maior") ? "▼" :
                                    (t.feedback.ano_nascimento === "menor" || t.feedback.ano_nascimento === "proximo-menor") ? "▲" : ""}
                            </div>
                        </td>
                        <td className={t.feedback.altura_cm}>
                            <div className="valor-com-seta">
                                {t.altura_cm} cm
                                {(t.feedback.altura_cm === "maior" || t.feedback.altura_cm === "proximo-maior") ? "▼" :
                                    (t.feedback.altura_cm === "menor" || t.feedback.altura_cm === "proximo-menor") ? "▲" : ""}
                            </div>
                        </td>
                        <td>
                            {t.posicao.map((p, index) => (
                                <div
                                    key={index}
                                    className={`mini-bloco ${t.feedback.posicao[index]} ${t.posicao.length === 1 ? 'single-item' : ''}`}
                                >
                                    {p}
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <br/>
        </div>
    );
}