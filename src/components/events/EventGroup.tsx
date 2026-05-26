import React from 'react';
import type { Severity, DisasterEvent } from '../../types';
import { severityColor } from '../../utils/colors';
import EventCard from './EventCard';

interface EventGroupProps {
  severity: Severity;
  events: DisasterEvent[];
  selected: string;
  expanded: string | null;
  onSelect: (id: string) => void;
  onExpand: (id: string | null) => void;
}

export default function EventGroup({ severity, events, selected, expanded, onSelect, onExpand }: EventGroupProps) {
  if (events.length === 0) return null;
  const color = severityColor(severity);

  return (
    <div className="event-group" style={{ '--gc': color } as React.CSSProperties}>
      <div className="event-group-header">
        <div className="event-group-line" />
        <span className="event-group-label">{severity.toUpperCase()}</span>
        <span className="event-group-count">{events.length}</span>
        <div className="event-group-line" />
      </div>
      {events.map(ev => (
        <EventCard
          key={ev.id}
          ev={ev}
          selected={selected === ev.id}
          expanded={expanded === ev.id}
          onSelect={onSelect}
          onExpand={onExpand}
        />
      ))}
    </div>
  );
}
