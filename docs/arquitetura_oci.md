# Arquitetura AEGIS — Oracle Cloud Infrastructure (OCI)

## Visão Geral

Pipeline escalável, sem vendor lock-in, com alta disponibilidade.
Fontes externas de dados orbitais → ingestão OCI → processamento ML → API → consumo.

```
FONTES EXTERNAS               INGESTÃO OCI              ARMAZENAMENTO OCI
─────────────────             ────────────              ─────────────────
NASA EONET API v3      →      OCI API Gateway      →   OCI Object Storage
NOAA Climate API              OCI Streaming               (raw JSON events)
INPE BDQueimadas              (Kafka-compatible)
Copernicus Sentinel           OCI Data Catalog        Oracle Autonomous DB
USGS EarthExplorer                                      (events · risk scores
Planet Labs                                              history · features)

         │                        │                          │
         ▼                        ▼                          ▼
PIPELINE ML OCI               MODELOS OCI               API DE ALERTAS
─────────────────             ───────────               ──────────────
OCI Data Flow           →     OCI Data Science    →    OCI Container Engine
(Apache Spark ETT)            XGBoost → Risk Score      (OKE / Kubernetes)
Feature Engineering           LSTM → D+7 Forecast       FastAPI + Docker
Sazonalidade · Magnitude      OCI Model Catalog
Batch job agendado            OCI Model Deployment       OCI Functions
                                                         (alertas serverless)
                                                         OCI API Gateway
                                                         (auth · rate · TLS)
         │
         ▼
CONSUMO                       OPS / OBSERVABILIDADE
───────────────────           ─────────────────────
AEGIS Dashboard               OCI Monitoring & Alarms
React 19 · D3.js · TS         OCI Logging
Vercel (CDN global)           OCI Vault (secrets)
                              OCI IAM (identidade)
Oracle Analytics Cloud
(relatórios institucionais    OCI Budget Alerts
 CEMADEN · Defesa Civil       (controle de custo)
 Cruz Vermelha · ONGs)
```

---

## Camadas em Detalhe

### 1. Fontes Externas de Dados Orbitais

| Fonte | URL | Tipo | Custo |
|-------|-----|------|-------|
| NASA EONET API v3 | eonet.gsfc.nasa.gov/api/v3 | REST JSON | Gratuito |
| NOAA Climate API | www.noaa.gov | REST JSON | Gratuito |
| INPE BDQueimadas | queimadas.dgi.inpe.br | REST/CSV | Gratuito |
| Copernicus Sentinel Hub | scihub.copernicus.eu | REST | Gratuito |
| USGS EarthExplorer | earthexplorer.usgs.gov | REST | Gratuito |

### 2. Ingestão — OCI

| Serviço OCI | Função | Equivalente AWS |
|-------------|--------|----------------|
| OCI API Gateway | Endpoint de entrada para chamadas às fontes externas | API Gateway |
| OCI Streaming | Ingestão de eventos em tempo real (Kafka-compatible) | Kinesis Data Streams |
| OCI Data Catalog | Inventário e rastreamento dos datasets orbitais | Glue Data Catalog |

**Intervalo de coleta:** a cada 5 minutos para eventos ativos (NASA EONET open/limit=200)
**Histórico:** job diário — últimos 730 dias (limit=1000)

### 3. Armazenamento — OCI

| Serviço OCI | Conteúdo | Retenção |
|-------------|----------|----------|
| OCI Object Storage | Raw JSON de cada requisição à API | 90 dias (lifecycle policy) |
| Oracle Autonomous Database (ATP) | Eventos normalizados, risk scores, features ML | Indefinido |
| OCI Block Volume | Artefatos de modelo (XGBoost .pkl, LSTM .h5) | Permanente |

**Schema Oracle ATP — tabela principal:**
```sql
CREATE TABLE events (
  id             VARCHAR2(64) PRIMARY KEY,
  title          VARCHAR2(512),
  category       VARCHAR2(64),
  status         VARCHAR2(16),
  date_opened    TIMESTAMP,
  date_closed    TIMESTAMP,
  duration_days  NUMBER,
  lat            NUMBER,
  lon            NUMBER,
  magnitude      NUMBER,
  magnitude_unit VARCHAR2(32),
  n_geometry_pts NUMBER,
  sources        VARCHAR2(512),
  risk_score     NUMBER,         -- saída XGBoost (0–100)
  forecast_d7    VARCHAR2(1024), -- JSON com previsão LSTM
  updated_at     TIMESTAMP DEFAULT SYSTIMESTAMP
);
```

### 4. Pipeline ML — OCI Data Flow (Apache Spark)

**Job de Feature Engineering (batch, agendado via OCI Scheduler):**
```
Input:  OCI Object Storage (raw JSON)
Steps:
  1. Normalização de campos (id, category, date, lat/lon, magnitude)
  2. Feature engineering: sazonalidade (mês_sin, mês_cos), duração, n_geometry_pts
  3. Encoding de categorias
  4. Gravar parquet em OCI Object Storage (processed/)
Output: processed/events_features_{date}.parquet
```

### 5. Modelos — OCI Data Science

| Modelo | Arquivo | Técnica | Problema | Saída |
|--------|---------|---------|----------|-------|
| XGBoost | xgboost_risk.py | Gradient Boosting | Risk Score (0–100) por evento | risk_score (float) |
| LSTM | lstm_forecast.py | Deep Learning (TensorFlow) | Previsão D+1 a D+7 de volume | forecast_d7 (JSON) |

**OCI Model Catalog:** versiona e gerencia os modelos treinados.
**OCI Model Deployment:** serve os modelos como endpoints REST internos consumidos pela FastAPI.

**Retraining:** job semanal via OCI Data Flow — retreina XGBoost e LSTM com novos eventos.

### 6. API de Alertas — OCI Container Engine (OKE)

```
FastAPI containerizada (Dockerfile)
├── GET /api/events          → lista eventos ativos com risk score
├── GET /api/events/{id}     → detalhe de um evento
├── GET /api/forecast        → previsão D+7 (LSTM)
├── GET /api/categories      → categorias disponíveis
└── GET /api/health          → healthcheck do sistema

OCI Functions (serverless):
└── Trigger em OCI Streaming → gera alerta quando risk_score > threshold
    → notifica via OCI Notifications (email/webhook para Defesa Civil)

OCI API Gateway (camada de entrada):
├── Rate limiting: 100 req/min por IP
├── Auth: API Key para dashboard institucional
└── TLS: certificado gerenciado pelo OCI
```

### 7. Consumo — Frontend e Analytics

**AEGIS Dashboard (Vercel):**
- React 19 + TypeScript + Vite
- D3.js + D3-geo + TopoJSON World Atlas
- Consome a API OCI via HTTPS
- Mapa interativo, timeline scrubber, event feed, risk gauge

**Oracle Analytics Cloud (OAC):**
- Relatórios institucionais para CEMADEN, Defesa Civil, Cruz Vermelha
- Dashboards com histórico de eventos e tendências
- Integração direta com Oracle Autonomous DB

### 8. Observabilidade — OCI OPS

| Serviço | Uso |
|---------|-----|
| OCI Monitoring | Métricas de CPU, memória, latência da API |
| OCI Alarms | Alertas quando risk_score crítico ou API down |
| OCI Logging | Logs centralizados da FastAPI e OCI Functions |
| OCI Vault | Armazena secrets (API keys, DB credentials) |
| OCI IAM | Controle de acesso granular por serviço/usuário |
| OCI Budget Alerts | Notifica quando custo mensal excede limite definido |

---

## Fluxo de Dados em Produção

```
1. [a cada 5 min] OCI Functions aciona coleta NASA EONET
   └── HTTP GET → eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=200
   └── JSON → OCI Object Storage (raw/open_{timestamp}.json)

2. [a cada 1h] OCI Data Flow (Spark) processa raw → parquet
   └── Normalização + feature engineering
   └── Oracle ATP: upsert de eventos

3. [a cada 1h] OCI Model Deployment calcula risk score
   └── XGBoost inference → Oracle ATP: update risk_score

4. [contínuo] FastAPI serve eventos via REST
   └── AEGIS Dashboard React consome a cada 30s

5. [semanal] OCI Data Flow retreina XGBoost + LSTM
   └── OCI Model Catalog: nova versão registrada
   └── OCI Model Deployment: deploy da nova versão (blue/green)
```

---

## Decisões Arquiteturais

| Decisão | Motivo |
|---------|--------|
| Oracle ATP em vez de DynamoDB/MongoDB | Suporte nativo a SQL analítico, integração com OAC e Data Flow |
| OCI Streaming (Kafka) para ingestão | Desacopla coleta do processamento; buffer em caso de falha das APIs externas |
| FastAPI + OKE em vez de OCI Functions para API | Menor cold start, mais controle de estado, melhor para endpoints contínuos |
| OCI Functions só para alertas | Serverless adequado para eventos esporádicos de threshold |
| Vercel para frontend | CDN global gratuito; frontend desacoplado da infraestrutura OCI |
| Open source + dados NASA abertos | Zero vendor lock-in no dado; qualquer agência pode replicar |
| Retraining semanal | Eventos EONET mudam sazonalmente; modelo precisa se adaptar |

---

## Custo Estimado (OCI Always Free + Pay-as-you-go)

| Componente | Tier | Custo estimado/mês |
|------------|------|--------------------|
| Oracle Autonomous DB (1 OCPU, 20 GB) | Always Free | R$ 0 |
| OCI Object Storage (até 20 GB) | Always Free | R$ 0 |
| OCI Compute (OKE — 2 nodes A1 Flex) | Always Free | R$ 0 |
| OCI Functions (< 2M invocações) | Always Free | R$ 0 |
| OCI Streaming (< 1 GB/mês) | Pay-as-you-go | ~R$ 5 |
| Oracle Analytics Cloud (1 usuário) | Pay-as-you-go | ~R$ 80 |
| **Total MVP** | | **~R$ 85/mês** |

> OCI Always Free é permanente (não expira após 30 dias como AWS Free Tier).
