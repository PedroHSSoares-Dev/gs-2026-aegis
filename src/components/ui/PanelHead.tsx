interface PanelHeadProps {
  title: string;
  sub: string;
}

export default function PanelHead({ title, sub }: PanelHeadProps) {
  return (
    <div className="phead">
      <div>
        <div className="phead-title">{title}</div>
        <div className="phead-sub">{sub}</div>
      </div>
      <div className="phead-deco">
        <span /><span /><span />
      </div>
    </div>
  );
}
