import { BlurTargetView, BlurView } from "expo-blur"
import React, { createContext, useContext, useMemo, useRef, useState } from "react"
import { StyleSheet, View } from "react-native"

type ScreenBlurContextType = {
  setBlurred: (value: boolean) => void
}

const ScreenBlurContext = createContext<ScreenBlurContextType>({ setBlurred: () => {} })

export const useScreenBlur = () => useContext(ScreenBlurContext)

type ProviderProps = {
  children: React.ReactNode
  intensity?: number
}

export function ScreenBlurProvider({ children, intensity = 95 }: Readonly<ProviderProps>) {
  const [blurred, setBlurred] = useState(false)
  const blurTargetRef = useRef<React.ComponentRef<typeof BlurTargetView>>(null)
  const value = useMemo(() => ({ setBlurred }), [])

  return (
    <ScreenBlurContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        <BlurTargetView
          ref={blurTargetRef}
          style={{ flex: 1 }}
        >
          {children}
        </BlurTargetView>

        {blurred && (
          <BlurView
            blurTarget={blurTargetRef}
            intensity={intensity}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>
    </ScreenBlurContext.Provider>
  )
}
