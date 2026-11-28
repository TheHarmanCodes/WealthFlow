/**
 * android-tab-icons.tsx
 *
 * React Native–safe SVG icon components for Android tab bar icons.
 * Path data sourced from installed @iconify-icons/* packages and hand-inlined
 * so they render via react-native-svg (no web <svg> tags, no "1em" dimensions).
 *
 * Each component: { color: string; size: number }
 */

import React from "react";
import Svg, { Path } from "react-native-svg";

interface IconProps {
  color: string;
  size: number;
}

// ─── Home — boxicons `home-alt-2-filled` (24×24) ─────────────────────────────
const HOME_ALT2_FILLED =
  "M10.63 1.978a2.2 2.2 0 0 1 2.74 0l8.451 6.722A1.8 1.8 0 0 1 22.5 10.109V20.25a2.5 2.5 0 0 1-2.5 2.5h-5.2v-7.15a1.2 1.2 0 0 0-1.2-1.2h-3.2a1.2 1.2 0 0 0-1.2 1.2v7.15H4a2.5 2.5 0 0 1-2.5-2.5V10.109a1.8 1.8 0 0 1 .679-1.409Z";

// ─── Stats — uis/graph-bar (24×24) ───────────────────────────────────────────
const GRAPH_BAR =
  "M6 13H2c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h4c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1m16-4h-4c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V10c0-.6-.4-1-1-1m-8-8h-4c-.6 0-1 .4-1 1v20c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V2c0-.6-.4-1-1-1";

// ─── AI — ri/quill-pen-ai-line (24×24) ───────────────────────────────────────
const QUILL_PEN_AI =
  "m4.713 7.128l-.246.566a.506.506 0 0 1-.934 0l-.246-.566a4.36 4.36 0 0 0-2.22-2.25l-.759-.339a.53.53 0 0 1 0-.963l.717-.319A4.37 4.37 0 0 0 3.276.931L3.53.32a.506.506 0 0 1 .942 0l.253.61a4.37 4.37 0 0 0 2.25 2.327l.718.32a.53.53 0 0 1 0 .962l-.76.338a4.36 4.36 0 0 0-2.219 2.251m1.621 8.687c.176-.582.373-1.159.605-1.782c2.056-5.527 5.48-8.951 11.074-9.818c-.513 1.143-.998 1.938-1.427 2.367l-1.001 1.002L14.172 9l1.456 1.454c-1.13 2.085-3.363 3.745-5.876 4.059c-1.317.165-2.459.607-3.418 1.303M18 9.997l-1-1l1.003-1.003Q19.502 6.493 21 1.997c-14.689 0-16.911 13.425-17.936 19.616L3 21.997h1.998q.999-5 5.002-5.5c4-.5 7-3.5 8-6.5";

// ─── Wallet — fa-solid/wallet (512×512) ──────────────────────────────────────
const FA_WALLET =
  "M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16c0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48M416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32s32 14.33 32 32s-14.33 32-32 32";

// ─── Exported components ──────────────────────────────────────────────────────

export function HomeAlt2FilledIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={HOME_ALT2_FILLED} fill={color} />
    </Svg>
  );
}

export function GraphBarIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={GRAPH_BAR} fill={color} />
    </Svg>
  );
}

export function QuillPenAiIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={QUILL_PEN_AI} fill={color} />
    </Svg>
  );
}

export function WalletSolidIcon({ color, size }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 512">
      <Path d={FA_WALLET} fill={color} />
    </Svg>
  );
}
