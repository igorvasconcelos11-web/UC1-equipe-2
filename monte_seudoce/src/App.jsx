import { useMemo, useState } from "react";

const steps = [
  { key: "base", title: "Base", prompt: "Escolha a estrela da sua criação", options: [["Cupcake", "cupcake", "/assets/cupcake-base.png"], ["Donut", "donut", "/assets/donut-base.png"], ["Bolo", "bolo", "/assets/bolo-base.png"], ["Sorvete", "sorvete", "/assets/sorvete-base.png"]] },
  { key: "filling", title: "Recheio", prompt: "Um coração cremoso para o seu doce", options: [["Chocolate", "chocolate"], ["Morango", "morango"], ["Baunilha", "baunilha"], ["Doce de leite", "caramelo"]] },
  { key: "coat", title: "Cobertura", prompt: "Deixe tudo ainda mais gostoso", options: [["Chocolate", "chocolate"], ["Morango", "morango"], ["Branca", "baunilha"], ["Caramelo", "caramelo"]] },
  { key: "topping", title: "Topping", prompt: "Escolha um toque de crocância e cor", options: [["Granulado", "granulado"], ["Confetes", "confetes"], ["Frutinhas", "frutas"], ["Choco chips", "chips"]] },
  { key: "decor", title: "Decoração", prompt: "Finalize sua obra-prima", options: [["Cereja", "cereja"], ["Estrela", "estrela"], ["Coração", "coracao"], ["Velinha", "vela"]] },
];
function Art({ type, name }) { return <span className={`art ${type} ${name}`} aria-hidden="true" />; }
function Dessert({ picks, small = false }) {
  const cake = picks.base?.id === "bolo";
  return <div className={`dessert ${small ? "small" : ""} ${picks.base?.id || "cupcake"}`}><div className="stage">
    <img src={picks.base?.image || "/assets/cupcake-base.png"} alt="" />
    {picks.filling && <div className={`filling ${picks.filling.id}`} />}{picks.coat && <div className={`icing ${picks.coat.id}`} />}
    {picks.topping && <Art type="topping" name={picks.topping.id} />}{picks.decor && <Art type="decor" name={picks.decor.id} />}
  </div>{!small && <div className="plate" />}{cake && <span className="cake-mark" />}</div>;
}
export function App() {
  const [step, setStep] = useState(0), [picks, setPicks] = useState({}), [finished, setFinished] = useState(false);
  const shownSteps = useMemo(() => picks.base?.id === "bolo" ? steps : steps.filter(x => x.key !== "decor"), [picks.base]);
  const current = steps[step], shownIndex = shownSteps.findIndex(x => x.key === current.key);
  const choose = ([label, id, image]) => setPicks(old => current.key === "base" ? { base: { label, id, image } } : { ...old, [current.key]: { label, id } });
  const next = () => { if (!picks[current.key]) return; if (shownIndex === shownSteps.length - 1) return setFinished(true); setStep(steps.indexOf(shownSteps[shownIndex + 1])); };
  const restart = () => { setPicks({}); setStep(0); setFinished(false); };
  return <main className="app-shell"><header><a href="#top">🍰 Monte seu <b>Doce</b></a><span>✦ confeitaria criativa</span></header>
    <section className="workshop" id="top"><aside className="progress"><p>SUA RECEITA</p>{shownSteps.map((item, i) => <div className={i === shownIndex ? "active" : i < shownIndex ? "done" : ""} key={item.key}><i>{i < shownIndex ? "✓" : i + 1}</i>{item.title}</div>)}</aside><div className="creation"><em>✦</em><Dessert picks={picks} /><p>{picks.base ? `Seu ${picks.base.label.toLowerCase()} está ganhando vida!` : "Comece escolhendo uma base deliciosa"}</p></div><aside className="tip"><i>🧁</i><b>Dica da chef</b><p>{current.prompt}</p></aside></section>
    <section className="panel"><div className="panel-head"><div><small>PASSO {shownIndex + 1} DE {shownSteps.length}</small><h1>Escolha {current.title === "Base" ? "a" : "o"} {current.title.toLowerCase()}</h1><p>{current.prompt}</p></div><strong>{shownIndex + 1}/{shownSteps.length}</strong></div><div className="options">{current.options.map(item => <button className={picks[current.key]?.id === item[1] ? "selected" : ""} onClick={() => choose(item)} key={item[1]}>{current.key === "base" ? <img src={item[2]} alt="" /> : <Art type={current.key} name={item[1]} />}<span>{item[0]}</span><b>✓</b></button>)}</div><footer><button className="reset" onClick={restart}>↻ Recomeçar</button><div><button className="back" disabled={!shownIndex} onClick={() => setStep(steps.indexOf(shownSteps[shownIndex - 1]))}>← Voltar</button><button className="next" disabled={!picks[current.key]} onClick={next}>{shownIndex === shownSteps.length - 1 ? "Finalizar doce ✦" : "Próximo passo →"}</button></div></footer></section>
    {finished && <div className="modal"><div><small>✦ RECEITA CONCLUÍDA ✦</small><h2>Ficou uma delícia!</h2><Dessert picks={picks} small /><p>{Object.values(picks).map(x => x.label).join(" • ")}</p><button className="next" onClick={restart}>Criar outro doce</button></div></div>}
  </main>;
}
