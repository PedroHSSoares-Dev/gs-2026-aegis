# Conteúdo da Apresentação — AEGIS GS 2026

Usar o template `GS_2026.1_2TSC_TEMPLATE.pptx` como base.
Exportar para PDF após finalizar.
Nome do arquivo: `GS_2TSCPW_Pitch_AEGIS_<nome_do_grupo>.pdf`

---

## Slide 1 — Capa

**Título:** AEGIS — Orbital Disaster Intelligence
**Subtítulo:** Transformando Dados Orbitais em Alertas que Salvam Vidas
**Turma:** 2TSCPW | Global Solution 2026 | Indústria Espacial
**Integrantes:** [Nome] — RM [número] | [Nome] — RM [número]
**Data:** Junho de 2026

---

## Slide 2 — Cenário Atual: A Nova Fronteira de Dados

**Título do slide:** O Espaço é a Nova Fronteira de Dados

**Bullets:**
- 15.000+ satélites ativos em órbita (fevereiro 2026)
- USD 613 bilhões em valor gerado pela economia espacial (2024)
- Projeção: USD 1 trilhão até 2034
- Copernicus (UE) e NASA geram mais de 12 TB de dados orbitais por dia
- Menos de 3% desses dados são convertidos em alertas acionáveis em tempo real

**Visual sugerido:** infográfico com satélites em órbita ou linha do tempo da economia espacial

---

## Slide 3 — O Problema: Latência Fatal

**Título do slide:** 6 a 24 Horas de Atraso entre Detecção e Ação

**Bullets:**
- Desastres climáticos custaram USD 2,8 trilhões à economia global na última década
- Em 2025, 47 desastres naturais afetaram 180 milhões de pessoas
- Agências de defesa civil dependem de alertas manuais — 6 a 24h após detecção orbital
- Cada hora perdida entre a detecção e o alerta pode custar vidas e recursos
- Dados espaciais existem — o problema é transformá-los em decisão em tempo real

**Visual sugerido:** linha do tempo de um desastre (detecção orbital → alerta → resposta) com destaque no gap de horas

---

## Slide 4 — Evidência Real: O que os Dados da NASA Revelam

**Título do slide:** Análise Exploratória de 1.200+ Eventos Orbitais

**Bullets:**
- 1.200+ eventos naturais rastreados por satélite nos últimos 2 anos (NASA EONET v3)
- Wildfires e Severe Storms respondem por mais de 60% dos eventos ativos
- Incêndios e tempestades têm picos sazonais previsíveis — padrão detectável com ML
- Hotspots concentrados em América do Norte, Sudeste Asiático e Europa Mediterrânea
- Sensores MODIS, VIIRS e Copernicus Sentinel detectam eventos 18–48h antes dos alertas manuais

**Visual sugerido:** gráfico de distribuição por categoria do EDA (fig_categorias.png) + mapa de densidade geográfica (fig_densidade_geo.png)

---

## Slide 5 — A Solução: AEGIS

**Título do slide:** AEGIS — Inteligência Orbital em Tempo Real

**Descritivo:**
AEGIS é uma plataforma que transforma dados de satélites da NASA e Copernicus em alertas preemptivos de desastres climáticos. Usando a API NASA EONET, análise exploratória de dados e modelos preditivos (LSTM, XGBoost), o sistema monitora globalmente incêndios, ciclones, enchentes e terremotos, antecipando crises com até 72 horas de antecedência para agências de defesa civil.

**Bullets:**
- Dashboard de missão em tempo real com dados de satélites NASA EONET e Copernicus Sentinel
- Monitoramento de 5 categorias: incêndios, ciclones, enchentes, terremotos, secas
- Score de risco calculado com XGBoost sobre features dos dados orbitais
- Previsão de volume e intensidade com LSTM — horizonte D+1 a D+7
- Interface para gestores: mapa interativo, timeline histórica, feed de alertas por severidade

**Visual sugerido:** screenshot geral do dashboard AEGIS (visão global com eventos ativos no mapa)

---

## Slide 6 — Público-alvo e Persona

**Título do slide:** Para quem o AEGIS foi Construído

**Persona principal:**
> **Nome:** Marina Souza
> **Cargo:** Coordenadora de Resposta a Emergências — CEMADEN
> **Idade:** 38 anos | Formação: Meteorologia + Gestão de Riscos
> **Desafio:** Recebe alertas tardios sobre eventos climáticos. Quando confirma o risco, o tempo de mobilização já está comprometido.
> **Motivação:** Salvar vidas antes do desastre, não durante.
> **Necessidade:** Uma interface que traduza dados de satélite em ações claras e priorizadas, sem exigir expertise técnica em sensoriamento remoto.

**Públicos-alvo:**
- Agências governamentais: CEMADEN, Defesa Civil Municipal, IBAMA
- Organizações humanitárias: Cruz Vermelha, UNOCHA, IFRC
- Municípios em zonas de risco climático (enchentes, deslizamentos, secas)
- Pesquisadores e gestores de emergência em clima e meio ambiente

**Visual sugerido:** card de persona com foto ilustrativa + ícones dos públicos-alvo (agência, ONG, município)

---

## Slide 7 — Protótipo: Telas da Solução (parte 1)

**Título do slide:** Dashboard AEGIS — Interface de Missão

**Tela 1 — Mapa Global de Eventos Ativos**
Screenshot: mapa mundial D3.js com pontos coloridos por severidade (vermelho = crítico, laranja = alto, amarelo = moderado).
Descrição: Exibe todos os desastres ativos rastreados por satélite em tempo real via NASA EONET. Cada ponto representa um evento geolocalizado. A cor indica o nível de risco calculado pelo modelo XGBoost. O operador identifica instantaneamente os focos de maior atenção sem necessidade de relatórios.

**Tela 2 — Storm Track: Trajetória de Eventos Móveis**
Screenshot: ciclone com linha sólida (histórico) e linha pontilhada (previsão D+7).
Descrição: Para eventos móveis como ciclones e furacões, o AEGIS exibe a trajetória passada e a projeção futura calculada com base nos dados EONET e padrões históricos LSTM. Permite que a defesa civil identifique municípios no corredor de impacto com até 72 horas de antecedência.

---

## Slide 8 — Protótipo: Telas da Solução (parte 2)

**Título do slide:** Dashboard AEGIS — Análise e Alertas

**Tela 3 — Event Card Expandido com Risk Score**
Screenshot: card lateral com nome do evento, categoria, coordenadas, risk score (gauge 0–100), sparkline 7 dias e botões de ação.
Descrição: Ao selecionar um evento no mapa, o painel lateral expande os dados detalhados: score de risco calculado em tempo real, evolução histórica nos últimos 7 dias (sparkline), magnitude, fonte orbital de detecção e ações diretas (Dispatch / Monitor / Archive). Elimina a necessidade de navegar entre múltiplos sistemas.

**Tela 4 — Timeline Scrubber D-7 a D+7**
Screenshot: barra de timeline com playback e scrubber arrastável.
Descrição: A timeline interativa permite ao operador navegar no tempo — assistir à evolução de um evento nos últimos 7 dias ou avançar para ver a previsão dos próximos 7 dias. Fundamental para reuniões de planejamento e tomada de decisão sobre evacuações e alocação de recursos.

**Link:** Dashboard disponível em: [URL Vercel após deploy]

---

## Slide 9 — Arquitetura da Solução

**Título do slide:** Como o AEGIS Funciona

**Diagrama de fluxo (da esquerda para direita):**

```
ORIGEM                    PROCESSAMENTO              CONSUMO
Satélites Orbitais   →   Pipeline Python        →   AEGIS Dashboard
NASA / Copernicus        EDA (análise padrões)       Mapa interativo
VIIRS / MODIS            XGBoost (risk score)        Event feed
Sentinel Hub             LSTM (previsão D+7)         Timeline scrubber
                         FastAPI (REST API)           Risk gauge
                              ↓
                         Dados abertos:
                         NASA EONET · NOAA
                         INPE BDQueimadas
```

**Detalhamento dos componentes:**
- Coleta: NASA EONET API (open data, sem custo) agrega eventos de sensores MODIS, VIIRS, Copernicus e USGS
- Processamento: pipeline Python — EDA com pandas/plotly, features de sazonalidade, duração e magnitude; modelo XGBoost treina o risk score; LSTM prevê volume futuro de eventos
- API REST: FastAPI desacopla ML do frontend; permite que outras aplicações consumam os alertas
- Frontend: React 19 + D3.js + TypeScript servido no Vercel — zero dependência de serviços pagos

---

## Slide 10 — Tecnologias Empregadas

**Título do slide:** Stack Tecnológico

| Camada | Tecnologia | Uso na solução |
|--------|-----------|----------------|
| Dados orbitais | NASA EONET API · Copernicus Sentinel | Coleta de eventos em tempo real |
| Dados complementares | NOAA · INPE BDQueimadas · USGS | Enriquecimento de contexto regional |
| Análise | Python · pandas · numpy · plotly · matplotlib | EDA e feature engineering |
| Machine Learning | XGBoost · scikit-learn · LSTM (TensorFlow) · SHAP | Risk score e previsão |
| Backend | FastAPI · Docker · uvicorn | API REST de alertas |
| Frontend | React 19 · D3.js · TypeScript · Vite | Dashboard interativo |
| Deploy | Vercel (frontend) · Railway/AWS (API) | Hospedagem e escalabilidade |
| Geoespacial | D3-geo · TopoJSON World Atlas | Mapas e visualização orbital |

---

## Slide 11 — Impactos da Solução

**Título do slide:** O Impacto do AEGIS no Mundo Real

**Impactos Ambientais:**
- Monitoramento contínuo de focos de incêndio reduz área queimada ao acelerar resposta
- Detecção precoce de secas permite ações de conservação hídrica antes do colapso
- Dados de satélite acessíveis a agências ambientais sem infraestrutura própria de sensoriamento

**Impactos Comunitários:**
- Evacuações com 24–72h de antecedência reduzem mortes em eventos de enchente e ciclone
- Gestores de defesa civil passam de resposta reativa para prevenção baseada em dados
- Democratiza acesso a inteligência orbital para municípios de baixa capacidade técnica

**Impactos Socioeconômicos:**
- Redução de 60–80% no custo de resposta emergencial por melhor alocação prévia de recursos
- Minimiza perdas econômicas em infraestrutura com alertas antes do pico do evento
- Open source: qualquer agência pública do mundo pode adaptar e implantar o AEGIS

**Visual sugerido:** três colunas (Ambiental / Comunitário / Socioeconômico) com ícones e bullets

---

## Slide 12 — Benefícios Esperados

**Título do slide:** Valor Gerado pelo AEGIS

| Benefício | Como o AEGIS entrega | Justificativa |
|-----------|---------------------|---------------|
| Eficiência operacional | Alertas em < 5 min vs. 6–24h atuais | Automatização do pipeline orbital → decisão |
| Tomada de decisão baseada em dados | Risk score + previsão LSTM no mesmo painel | Elimina dependência de interpretação manual |
| Agilidade na resposta | Timeline D+7 permite planejamento antecipado | Cruz Vermelha precisa de 48h para mobilizar equipes |
| Economia de recursos | Alocação preditiva de helicópteros e equipes | Dados históricos EONET mostram padrões de sazonalidade |
| Segurança da informação | Open source auditável + dados abertos NASA | Zero vendor lock-in, replicável por qualquer agência |
| Melhoria da qualidade | Dados de 4+ sensores orbitais integrados | MODIS + VIIRS + Sentinel = cobertura complementar |

---

## Slide 13 — O que Diferencia o AEGIS

**Título do slide:** Originalidade e Inovação

| Aspecto | Soluções Atuais | AEGIS |
|---------|----------------|-------|
| Latência do alerta | 6–24h | < 5 min |
| Dados utilizados | Relatórios manuais e PDFs | APIs de satélite em tempo real |
| Previsão | Reativa (após o evento) | Preditiva (até 72h antes) |
| Acesso | Sistemas proprietários caros | Open source + dados abertos NASA |
| Interface | Planilhas e painéis técnicos | Dashboard missão para não-especialistas |
| Integração de fontes | Silos separados por agência | EONET + NOAA + INPE em um único painel |

---

## Slide 14 — Conclusão

**Título do slide:** Dados do Espaço, Impacto na Terra

**Texto principal:**
O AEGIS não inventa dados — transforma o que já existe no espaço em decisões que salvam vidas na Terra.
A economia espacial gera hoje 12 TB de dados por dia. O AEGIS é a ponte entre esse dado orbital e o gestor de defesa civil que precisa agir em minutos, não em horas.

**ODS atendidos:** ODS 11 (Cidades Sustentáveis) · ODS 13 (Ação Climática) · ODS 9 (Inovação e Infraestrutura)

**Aprendizados das disciplinas aplicados no projeto:**
- BI, Analytics & Data Visualization: EDA com Python/plotly, dashboard interativo com D3.js, storytelling com dados orbitais
- Data Science & AI: modelos XGBoost (risco) e LSTM (previsão), feature engineering sobre séries temporais
- Cloud & Data Platforms: API REST FastAPI, deploy Vercel/Railway, dados abertos NASA EONET
- Desenvolvimento Web: React 19, TypeScript, Vite — frontend moderno e responsivo

**Call to action:**
- Dashboard ao vivo: [URL Vercel]
- Código open source: github.com/PedroHSSoares-Dev/gs-2026-aegis
- Pitch: [URL YouTube — público]

**Visual sugerido:** QR Code apontando para o dashboard + mapa do AEGIS em tela cheia ao fundo

---

## Checklist antes de exportar para PDF

- [ ] Preencher nomes e RMs dos integrantes no Slide 1
- [ ] Inserir screenshots reais do dashboard nos Slides 7 e 8 (após deploy Vercel)
- [ ] Substituir [URL Vercel] pelo link real em todos os slides
- [ ] Substituir [URL YouTube] pelo link do vídeo após gravar
- [ ] Nomear o arquivo: `GS_2TSCPW_Pitch_AEGIS_<nome_do_grupo>.pdf`
- [ ] Preencher `linkvideo.txt` com o link do YouTube
- [ ] Conferir que o vídeo está configurado como PÚBLICO no YouTube

## Entregáveis do Portal FIAP (um representante posta)

| # | Arquivo | Formato | Observação |
|---|---------|---------|------------|
| a | `descritivo_projeto.txt` | .txt | Já pronto — 5 linhas |
| b | `GS_2TSCPW_Pitch_AEGIS_<nome>.pdf` | .pdf | Exportar do PPTX após preencher |
| c | `linkvideo.txt` | .txt | URL completa do YouTube público |
| d | Link do dashboard Vercel | URL | Entregável d) = link do dashboard ao vivo |

**Atenção:** postar sem compactar. Não usar links para o PDF.
