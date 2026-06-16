type IconProps = { active?: boolean; className?: string };

function tone(active?: boolean) {
  return {
    primary: active ? "var(--accent)" : "var(--ink3)",
    soft: active ? "var(--blue-soft)" : "color-mix(in srgb, var(--ink3) 35%, transparent)",
  };
}

export function IconDashboard({ active }: IconProps) {
  const c = tone(active);
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="8" height="8" rx="2" fill={c.soft} />
      <rect x="13" y="3" width="8" height="5" rx="2" fill={c.primary} />
      <rect x="13" y="10" width="8" height="11" rx="2" fill={c.soft} />
      <rect x="3" y="13" width="8" height="8" rx="2" fill={c.primary} />
    </svg>
  );
}

export function IconSpending({ active }: IconProps) {
  const c = tone(active);
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 18V8l8-4 8 4v10" fill={c.soft} />
      <path d="M8 14h8M8 10h5" stroke={c.primary} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconTransactions({ active }: IconProps) {
  const c = tone(active);
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="5" width="16" height="14" rx="3" fill={c.soft} />
      <path d="M8 10h8M8 14h5" stroke={c.primary} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconCards({ active }: IconProps) {
  const c = tone(active);
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="7" width="18" height="11" rx="3" fill={c.soft} />
      <rect x="3" y="5" width="18" height="4" rx="2" fill={c.primary} />
      <rect x="6" y="14" width="6" height="2" rx="1" fill={c.primary} />
    </svg>
  );
}

export function IconMore({ active }: IconProps) {
  const c = tone(active);
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r="2" fill={c.primary} />
      <circle cx="12" cy="12" r="2" fill={c.soft} />
      <circle cx="18" cy="12" r="2" fill={c.primary} />
    </svg>
  );
}

export function IconTheme() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="5" fill="var(--accent)" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="var(--blue-soft)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
