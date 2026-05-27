# Pendências Frontend — AEGIS Dashboard

Análise do estado atual do código em `src/`. Todos os itens abaixo precisam ser implementados
antes do deploy e da gravação do pitch.

---

## 1. React Router — navegação entre telas

Hoje o projeto é uma SPA monolítica sem roteamento. `activeNav` em `App.tsx` é capturado
mas nunca usado para renderizar conteúdo diferente.

**O que fazer:**

```bash
npm install react-router-dom
```

Em `src/main.tsx`:
```tsx
import { BrowserRouter } from 'react-router-dom';
// envolver <App /> em <BrowserRouter>
```

Em `src/App.tsx`, criar `<Routes>` com pelo menos 3 rotas:
- `/overview` — tela atual (mapa + timeline + event feed)
- `/analytics` — Risk Gauge + Forecast Chart + Sensor Network
- `/archive` — lista de eventos históricos com filtros

Em `src/components/nav/LeftNav.tsx`, substituir `onClick` por `<NavLink to="/overview">` etc.

---

## 2. LeftNav — botões não navegam

`LeftNav.tsx` recebe `onNav` callback e chama `onNav(id)`, mas em `App.tsx` o state
`activeNav` é setado e nunca usado. O nav é puramente decorativo.

Após adicionar React Router: mapear cada `NavId` para uma rota:
- `globe` → `/overview`
- `layers` → `/analytics`
- `archive` → `/archive`
- `alert` → `/overview` (mantém foco no feed)
- `pulse` / `satellite` / `team` → podem redirecionar para `/analytics` por enquanto

---

## 3. Timeline sync com Event Feed

**Problema:** `filteredEvents` em `App.tsx` filtra apenas por severidade/kind.
O Event Feed mostra todos os eventos independente da posição do scrubber.
O mapa filtra por `daysBack` mas o feed não.

**Correção em `App.tsx`:**
```tsx
// Após o filtro existente, adicionar:
const daysFromNow = (scrub - 0.5) * 14; // -7 a +7
const visibleEvents = filteredEvents.filter(
  e => e.detectedDaysAgo <= daysFromNow + 0.5
);
// Passar visibleEvents para EventGroup em vez de filteredEvents
```

---

## 4. DetailDrawer — componente não integrado

`src/components/events/DetailDrawer.tsx` está implementado (tem rows de detalhes + 3 botões:
DISPATCH BRIEF, ESCALATE, DETAILS →) mas não é renderizado em lugar nenhum.

**Opção A (mais simples):** renderizar dentro de `EventCard.tsx` quando `expanded === true`,
substituindo o conteúdo de expand atual.

**Opção B:** renderizar como painel lateral fixo à direita quando um evento é selecionado
(requer ajuste no grid do `App.tsx`).

---

## 5. Botões sem ação no EventCard

Em `EventCard.tsx`, os botões DISPATCH, MONITOR e ARCHIVE não têm `onClick`.
Para o protótipo, adicionar ao menos um `console.log` ou um estado visual (toast/feedback)
para que a interação fique evidente durante o pitch.

---

## 6. Integração NASA EONET API (dados reais)

**Criar `src/hooks/useEonetEvents.ts`:**

```typescript
import { useEffect, useState } from 'react';
import { DisasterEvent } from '../types';

const EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50';

const CATEGORY_MAP: Record<string, string> = {
  wildfires: 'wildfire',
  severeStorms: 'cyclone',
  floods: 'flood',
  earthquakes: 'quake',
  drought: 'drought',
};

export function useEonetEvents() {
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(EONET_URL)
      .then(r => r.json())
      .then(data => {
        const normalized = data.events
          .filter((e: any) => e.geometry?.length > 0)
          .map((e: any, i: number): DisasterEvent => {
            const geo = e.geometry[0];
            const catId = e.categories[0]?.id ?? 'severeStorms';
            return {
              id: e.id,
              kind: (CATEGORY_MAP[catId] ?? 'cyclone') as any,
              name: e.title,
              region: 'Global',
              lat: geo.coordinates[1],
              lon: geo.coordinates[0],
              risk: Math.floor(Math.random() * 40) + 40,
              severity: i < 2 ? 'critical' : i < 5 ? 'high' : 'medium',
              delta: '+0.0',
              detected: new Date(geo.date).toLocaleString('en-US', { timeZone: 'UTC' }),
              area: 'Active',
              spark: Array.from({ length: 7 }, () => Math.random() * 80 + 20),
              radius: 12,
              detectedDaysAgo: 0,
            };
          });
        setEvents(normalized);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return { events, loading };
}
```

Em `App.tsx`, importar o hook e fazer merge com mockData:
```tsx
const { events: liveEvents, loading } = useEonetEvents();
const events = liveEvents.length > 0 ? [...liveEvents, ...AEGIS_DATA.events.filter(e => e.detectedDaysAgo !== 0)] : AEGIS_DATA.events;
```

---

## 7. Deploy Vercel

```bash
npm run build          # verificar que não há erros de TypeScript
npx vercel --prod      # deploy direto do terminal
```

Ou via GitHub:
1. Push para `main` no repo `PedroHSSoares-Dev/gs-2026-aegis`
2. Acessar vercel.com → Import Project → selecionar o repo
3. Framework: Vite | Build: `npm run build` | Output: `dist`
4. Deploy → copiar URL pública para usar na apresentação e no pitch

---

## 8. App.css — limpeza

`src/App.css` contém apenas os estilos padrão do template Vite (`.read-the-docs`, `.card`, etc.).
Nenhum desses seletores é usado no projeto. Pode apagar o conteúdo ou deletar o arquivo
(remover o import em `App.tsx` também).

---

## Prioridade de execução

1. Deploy Vercel (sem isso não tem link para o pitch)
2. React Router + LeftNav funcional (critério 8 da avaliação: "conjunto de telas")
3. EONET API (dados reais no mapa = mais impacto no pitch)
4. Timeline sync (bug visível durante demo)
5. DetailDrawer + botões (nice-to-have para o protótipo)
