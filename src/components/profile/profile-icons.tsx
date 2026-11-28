/**
 * profile-icons.tsx
 *
 * React Native SVG icons sourced from @iconify-icons/* packages:
 *  • SearchMagnifyingGlassIcon → ci/search-magnifying-glass
 *  • PrivacyPolicyIcon         → iconoir/privacy-policy
 */

import React from "react";
import Svg, { G, Path } from "react-native-svg";

interface IconProps {
  color: string;
  size?: number;
}

export function SearchMagnifyingGlassIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m15 15l6 6m-11-4a7 7 0 1 1 0-14a7 7 0 0 1 0 14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function PrivacyPolicyIcon({ color, size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M20 12V5.749a.6.6 0 0 0-.176-.425l-3.148-3.148A.6.6 0 0 0 16.252 2H4.6a.6.6 0 0 0-.6.6v18.8a.6.6 0 0 0 .6.6H13M8 10h8M8 6h4m-4 8h3" />
        <Path d="M16 2v3.4a.6.6 0 0 0 .6.6H20m-.008 9.125l2.556.649c.266.068.453.31.445.584C22.821 22.116 19.5 23 19.5 23s-3.321-.884-3.493-6.642a.59.59 0 0 1 .445-.584l2.556-.649c.323-.082.661-.082.984 0" />
      </G>
    </Svg>
  );
}
