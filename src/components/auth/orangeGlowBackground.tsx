import React from "react"
import { StyleProp, ViewStyle } from "react-native"
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg"

interface OrangeGlowBackgroundProps {
  style: StyleProp<ViewStyle>
  glowColor?: string
  midColor?: string
  edgeColor?: string
  opacity?: number
}

export function OrangeGlowBackground({
  style,
  glowColor = "#FF6B00",
  midColor = "#7A3300",
  edgeColor = "#121215",
  opacity = 0.28
}: Readonly<OrangeGlowBackgroundProps>) {
  return (
    <Svg
      width="100%"
      height="100%"
      style={style}
    >
      <Defs>
        <RadialGradient
          id="orangeGlow"
          cx="50%"
          cy="52%"
          rx="70%"
          ry="30%"
          fx="50%"
          fy="52%"
        >
          <Stop
            offset="0%"
            stopColor={glowColor}
            stopOpacity={opacity}
          />
          <Stop
            offset="50%"
            stopColor={midColor}
            stopOpacity={opacity / 2}
          />
          <Stop
            offset="100%"
            stopColor={edgeColor}
            stopOpacity="0"
          />
        </RadialGradient>
      </Defs>
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#orangeGlow)"
      />
    </Svg>
  )
}
