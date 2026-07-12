export default function MountainsSilhouette() {
  return (
    <div className="mountains" aria-hidden="true">
      <svg viewBox="0 0 1400 220" preserveAspectRatio="none">
        <polygon
          points="0,220 0,140 120,90 260,150 420,70 600,140 760,60 940,130 1120,80 1260,150 1400,110 1400,220"
          fill="var(--mountain-far)"
          opacity="0.55"
        />
        <polygon
          points="0,220 0,175 160,120 340,180 520,110 700,175 880,105 1060,170 1240,120 1400,165 1400,220"
          fill="var(--mountain-mid)"
          opacity="0.75"
        />
        <polygon
          points="0,220 0,200 200,150 380,200 560,145 760,205 960,150 1160,200 1400,155 1400,220"
          fill="var(--mountain-near)"
        />
      </svg>
    </div>
  );
}
