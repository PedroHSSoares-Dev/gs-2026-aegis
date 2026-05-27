# Roteiro do Pitch — AEGIS GS 2026

Duração total: 5 minutos
Gravar em tela cheia com o dashboard aberto no navegador.
Publicar no YouTube como PÚBLICO e incluir o link na última página do PDF e no arquivo linkvideo.txt.

---

## [0:00 – 0:30] — Hook de abertura (30 segundos)

> "Em 2025, 47 desastres naturais afetaram 180 milhões de pessoas ao redor do mundo.
> Ciclones, enchentes, incêndios, terremotos — todos rastreados por satélites da NASA
> em tempo real, gerando dados suficientes para prever e alertar.
> O problema não é falta de dados. É o tempo que levamos para transformá-los em ação.
> 6 a 24 horas de atraso entre a detecção orbital e o alerta humano.
> Nós construímos o AEGIS para acabar com esse gap."

[Abrir o dashboard no navegador. Câmera no rosto + screen capture simultâneo.]

---

## [0:30 – 1:30] — O problema (60 segundos)

> "A economia espacial gera hoje mais de 12 terabytes de dados por dia.
> 15.000 satélites em órbita monitoram temperatura, movimento, chuva, fogo.
> Mas menos de 3% desses dados chegam a quem decide: a defesa civil, as ONGs,
> os gestores públicos que precisam evacuar cidades, alocar helicópteros, salvar vidas.
>
> O motivo? Esses dados chegam fragmentados, em formatos técnicos, sem interface,
> sem priorização, sem previsão. Alguém precisa interpretar. E isso leva horas.
>
> Em uma enchente repentina, horas são vidas."

[Mostrar slide 3 da apresentação ou o gráfico do EDA com a série temporal de eventos.]

---

## [1:30 – 3:00] — Demo do dashboard (90 segundos)

> "Esse é o AEGIS. Uma plataforma de inteligência orbital em tempo real."

[Navegar no dashboard enquanto fala:]

> "Aqui está o mapa global com todos os eventos ativos agora — dados reais da NASA EONET.
> Cada ponto representa um desastre rastreado por satélite.
> Veja a trilha desse ciclone — trajetória passada em sólido, previsão em pontilhado."

[Clicar num evento no mapa para fazer zoom.]

> "Ao clicar, o sistema faz zoom no evento e expande as informações no painel lateral.
> Risk score calculado com Machine Learning. Sparkline dos últimos 7 dias. Coordenadas exatas."

[Abrir o card expandido de um evento CRITICAL.]

> "Eventos críticos chegam ao topo do feed em tempo real, classificados por severidade.
> A timeline aqui embaixo permite voltar no tempo — ver como um evento evoluiu,
> ou avançar para ver a previsão dos próximos 7 dias."

[Arrastar a timeline.]

> "Isso não é simulação. São dados reais de satélites, processados e servidos aqui."

---

## [3:00 – 4:00] — Como funciona + tecnologias (60 segundos)

> "Por baixo do AEGIS, três camadas:
>
> Primeira: coleta de dados. Usamos a NASA EONET API — open data gratuita — que agrega
> dados de sensores orbitais como MODIS, VIIRS e Copernicus Sentinel.
>
> Segunda: análise e ML. Um pipeline em Python faz a análise exploratória,
> calcula scores de risco com XGBoost, e prevê volume de eventos futuros com LSTM.
> Tudo baseado em padrões históricos que identificamos no EDA — sazonalidade de incêndios,
> ciclones, enchentes — padrões reais, não simulados.
>
> Terceira: o dashboard. React 19, D3.js, TypeScript. Interface pensada para quem decide,
> não para quem programa. Mapas interativos, timeline navegável, alertas priorizados."

[Mostrar slide de arquitetura rapidamente.]

---

## [4:00 – 4:30] — Quem se beneficia (30 segundos)

> "Quem ganha com o AEGIS?
> O CEMADEN, que monitora riscos climáticos no Brasil.
> As prefeituras de municípios em zonas de enchente.
> A Cruz Vermelha, que precisa de 48 horas de antecedência para mobilizar equipes.
> E, no fim, as 180 milhões de pessoas que todo ano são afetadas por desastres
> que os satélites já viram chegar — mas que chegaram cedo demais para a informação."

---

## [4:30 – 5:00] — Conclusão e call to action (30 segundos)

> "O espaço já está monitorando o planeta.
> O AEGIS é a interface entre o que os satélites veem e as decisões que salvam vidas.
> Dados do espaço, impacto na Terra.
>
> O dashboard está no ar em: [falar a URL do Vercel]
> O código é open source: github.com/PedroHSSoares-Dev/gs-2026-aegis
> Nós somos [nome(s)] da turma 2TSCPW. Obrigado."

[Terminar com o mapa do dashboard visível em tela cheia.]

---

## Dicas de gravação

- Resolução mínima: 1080p
- Abrir o dashboard em janela fullscreen antes de começar
- Fechar notificações do sistema operacional (Foco/Não Perturbe)
- Microfone externo se possível — áudio claro é tão importante quanto o visual
- Editar para cortar pausas longas; manter ritmo de fala constante
- Publicar no YouTube como PÚBLICO (exigência do PDF — a banca avaliadora precisa de acesso público)
- Copiar o link e colar na última página do PDF e no arquivo linkvideo.txt
- Testar o link antes de colar na entrega
