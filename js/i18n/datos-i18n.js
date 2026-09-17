// Carrera de DT — traducción de los datos del juego
// (arquetipos, políticas de prensa, roles, categorías, récords, etiquetas)
const DATOS_I18N = {
arq:{
 formador:{
  pt:{n:"O Formador", d:"Você trabalha com o que tem e faz os moleques crescerem.",
   ef:["Seus jovens sobem +4 de nível a cada temporada","Começa com o vestiário do seu lado (Vestiário 66)","A roleta traz jovens com mais potencial"],
   co:"Começa com 12 a menos de orçamento"},
  en:{n:"The Developer", d:"You work with what you have and make the kids grow.",
   ef:["Your youngsters gain +4 rating each season","You start with the dressing room behind you (66)","The wheel brings youth with a higher ceiling"],
   co:"You start with 12 less budget"}},
 ganador:{
  pt:{n:"O Vencedor", d:"Resultado agora. Te dão dinheiro e não te dão tempo.",
   ef:["+18 de orçamento inicial","Seu melhor atacante começa 8 pontos acima"],
   co:"Você é demitido se a diretoria cair abaixo de 26"},
  en:{n:"The Winner", d:"Results now. They give you money and no time.",
   ef:["+18 starting budget","Your best striker starts 8 points higher"],
   co:"You're sacked if the board drops below 26"}},
 bombero:{
  pt:{n:"O Bombeiro", d:"Te chamam quando o barco está afundando e você segura.",
   ef:["Toda a sua defesa começa +7","A diretoria te banca até o fim (só te demite em 12)"],
   co:"A torcida nunca se apaixona de verdade (-6 no início)"},
  en:{n:"The Firefighter", d:"They call you when the ship is sinking and you hold it together.",
   ef:["Your whole defence starts +7","The board backs you to the end (sacked only at 12)"],
   co:"The fans never quite fall for you (-6 at the start)"}}
},
prensa:{
 abierto:{
  pt:{n:"Portas abertas", desc:"Você deixa os jornalistas entrarem, cria vínculo, responde tudo.",
   pro:"Menos pressão quando perder · os rumores do mercado chegam antes",
   contra:"Vaza como você trabalha: o adversário te lê melhor"},
  en:{n:"Open doors", desc:"You let reporters in, build relationships, answer everything.",
   pro:"Less pressure when you lose · transfer rumours reach you first",
   contra:"How you work leaks out: the opponent reads you better"}},
 neutro:{
  pt:{n:"O necessário", desc:"Coletivas e nada mais. Nem amigo nem inimigo.",
   pro:"Ninguém se irrita", contra:"Ninguém te defende também"},
  en:{n:"Just the minimum", desc:"Press conferences, nothing more. Neither friend nor enemy.",
   pro:"Nobody gets angry", contra:"Nobody defends you either"}},
 cerrado:{
  pt:{n:"Porta fechada", desc:"Treinos fechados e o mínimo indispensável com a imprensa.",
   pro:"Ninguém sabe como você vai jogar · o elenco trabalha tranquilo",
   contra:"Cada má fase vira polêmica e a torcida escuta"},
  en:{n:"Shutters down", desc:"Closed training sessions and the bare minimum with the press.",
   pro:"Nobody knows how you'll play · the squad works in peace",
   contra:"Every bad run becomes a controversy and the fans hear it"}}
},
rol:{
 POR:{pt:"Goleiro",en:"Goalkeeper"}, DFC:{pt:"Zagueiro",en:"Centre-back"},
 LTD:{pt:"Lateral direito",en:"Right-back"}, LTI:{pt:"Lateral esquerdo",en:"Left-back"},
 MCD:{pt:"Volante",en:"Holding mid"}, MC:{pt:"Meio-campista",en:"Central mid"},
 MCO:{pt:"Meia-armador",en:"Playmaker"}, MD:{pt:"Meia direita",en:"Right mid"},
 MI:{pt:"Meia esquerda",en:"Left mid"}, CAD:{pt:"Ala direito",en:"Right wing-back"},
 CAI:{pt:"Ala esquerdo",en:"Left wing-back"}, EXD:{pt:"Ponta direita",en:"Right winger"},
 EXI:{pt:"Ponta esquerda",en:"Left winger"}, DC:{pt:"Centroavante",en:"Striker"}
},
grupo:{ POR:{pt:"Goleiro",en:"Goalkeeper"}, DEF:{pt:"Defesa",en:"Defence"},
 MED:{pt:"Meio-campo",en:"Midfield"}, ATA:{pt:"Ataque",en:"Attack"} },
div:{ "Séptima":{pt:"Sub-15",en:"U-15"}, "Quinta":{pt:"Sub-17",en:"U-17"},
 "Sub-19":{pt:"Sub-20",en:"U-20"}, "Primera":{pt:"Profissional",en:"First team"} },
estilo:{ "Posesion":{pt:"Posse de bola",en:"Possession"},
 "Contraataque / Directo":{pt:"Contra-ataque",en:"Counter-attack"},
 "Presion alta":{pt:"Pressão alta",en:"High press"},
 "Bloque bajo / Repliegue":{pt:"Bloco baixo",en:"Low block"} },
fit:{ "Ideal":{pt:"Ideal",en:"Ideal"}, "Bueno":{pt:"Bom",en:"Good"},
 "Neutro":{pt:"Neutro",en:"Neutral"}, "Forzado":{pt:"Forçado",en:"Forced"},
 "Contradictorio":{pt:"Contraditório",en:"Contradictory"} },
modo:{ expres:{pt:{n:"Expresso",desc:"Três temporadas. Uma partida de café."},
  en:{n:"Express",desc:"Three seasons. A coffee-break run."}},
 normal:{pt:{n:"Normal",desc:"Seis temporadas. A carreira completa."},
  en:{n:"Normal",desc:"Six seasons. The full career."}},
 largo:{pt:{n:"Carreira longa",desc:"Dez temporadas. Dá para construir um ciclo e quebrar recordes."},
  en:{n:"Long career",desc:"Ten seasons. Enough to build a project and break records."}} },
etiqueta:{
 bilardista:{pt:{n:"resultadista raiz",desc:"Especula, fecha e espera. Enquanto ganha, ninguém fala nada."},
  en:{n:"a pragmatist",desc:"Sits back, shuts it down and waits. While he wins, nobody complains."}},
 lirico:{pt:{n:"romântico",desc:"Sai para jogar sempre, mesmo quando o resultado não vem."},
  en:{n:"a romantic",desc:"Always goes out to play, even when the results don't come."}},
 formador:{pt:{n:"formador",desc:"Dá espaço aos moleques e cuida do grupo acima do resultado."},
  en:{n:"a developer",desc:"Gives the kids a chance and puts the group above the result."}},
 politico:{pt:{n:"político",desc:"Nunca briga com ninguém lá em cima. Sempre sai bem na foto."},
  en:{n:"a politician",desc:"Never fights anyone upstairs. Always comes out looking fine."}},
 mediatico:{pt:{n:"midiático",desc:"Vive do microfone. Cada coletiva é um episódio."},
  en:{n:"a media man",desc:"Lives off the microphone. Every press conference is an episode."}},
 resultadista:{pt:{n:"resultadista",desc:"Só olha a tabela."},
  en:{n:"a results man",desc:"All he looks at is the table."}}
},
record:{
 titulos:{pt:"Mais títulos numa carreira",en:"Most titles in a career"},
 puntos:{pt:"Mais pontos de carreira",en:"Most career points"},
 invicto:{pt:"Mais temporadas sem cair abaixo do meio de tabela",en:"Most seasons without dropping below mid-table"},
 unclub:{pt:"Mais temporadas no mesmo clube",en:"Most seasons at one club"},
 ascensos:{pt:"Mais promoções de categoria",en:"Most promotions"},
 vestuario:{pt:"Terminar com o vestiário intacto",en:"Finish with the dressing room intact"}
},
cierre:{
 "Campeón":{pt:"Campeão",en:"Champion"}, "Subcampeón":{pt:"Vice-campeão",en:"Runner-up"},
 "Mitad de tabla":{pt:"Meio de tabela",en:"Mid-table"}, "Zona baja":{pt:"Parte de baixo",en:"Bottom half"},
 "Pelea el descenso":{pt:"Briga contra o rebaixamento",en:"Relegation fight"},
 "Te echaron":{pt:"Você foi demitido",en:"You were sacked"}, "Asumís":{pt:"Você assume",en:"You take over"}
},
motiv:{
 plata:{pt:{n:"o dinheiro",pista:"O empresário dele já ligou três vezes perguntando do contrato."},
  en:{n:"the money",pista:"His agent has called three times already asking about the contract."}},
 familia:{pt:{n:"a família",pista:"Tem dois filhos pequenos e vem de três mudanças em quatro anos."},
  en:{n:"family",pista:"He has two small kids and has moved three times in four years."}},
 copas:{pt:{n:"jogar a Libertadores",pista:"Nunca jogou uma competição internacional e já tem trinta."},
  en:{n:"playing in Europe",pista:"He's never played continental football and he's already thirty."}},
 minutos:{pt:{n:"jogar sempre",pista:"Vem de duas temporadas olhando do banco."},
  en:{n:"playing every week",pista:"He's coming off two seasons watching from the bench."}},
 idolo:{pt:{n:"virar ídolo",pista:"Cresceu aqui na esquina e tem fotos de criança com a camisa."},
  en:{n:"becoming a club legend",pista:"He grew up round the corner and there are photos of him as a kid in the shirt."}},
 proyecto:{pt:{n:"o projeto",pista:"Na conversa pergunta mais como o time vai jogar do que sobre o salário."},
  en:{n:"the project",pista:"In the meeting he asks more about how the team will play than about wages."}}
},
argum:{
 plata:{pt:"Oferece ser o mais bem pago do elenco",en:"Offer to make him the highest paid in the squad"},
 familia:{pt:"Fala da tranquilidade para viver com a família",en:"Talk about the calm life for his family"},
 copas:{pt:"Promete que vai jogar a competição internacional",en:"Promise him continental football"},
 minutos:{pt:"Garante que vai ser titular",en:"Guarantee him a starting spot"},
 idolo:{pt:"Diz que aqui ele pode terminar como ídolo",en:"Tell him he could end up a club legend here"},
 proyecto:{pt:"Explica o projeto e como você o pensou dentro dele",en:"Explain the project and how you built it around him"}
}
};
