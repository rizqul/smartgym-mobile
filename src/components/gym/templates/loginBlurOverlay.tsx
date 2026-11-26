// import { AppDispatch, RootState } from "@/store/store"
// import { BlurView } from "expo-blur"
// import React, { useEffect, useRef, useState } from "react"
// import { ActivityIndicator, Animated, StyleSheet, View } from "react-native"
// import { useDispatch, useSelector } from "react-redux"

// export default function LoginBlurOverlay({ duration = 2500 }: Readonly<{ duration?: number }>) {
//   const dispatch = useDispatch<AppDispatch>()
//   const opacity = useRef(new Animated.Value(1)).current
//   const [visible, setVisible] = useState(false)

//   useEffect(() => {
//     if (!show) return
//     opacity.setValue(1)
//     setVisible(true)

//     const timer = setTimeout(() => {
//       Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
//         setVisible(false)
//         dispatch(finishLoginBlur())
//       })
//     }, duration)

//     return () => clearTimeout(timer)
//   }, [show])

//   if (!visible) return null

//   return (
//     <Animated.View
//       style={[StyleSheet.absoluteFill, { opacity, zIndex: 100 }]}
//       pointerEvents="auto"
//     >
//       <BlurView
//         intensity={50}
//         tint="dark"
//         experimentalBlurMethod="dimezisBlurView"
//         style={StyleSheet.absoluteFill}
//       />
//       <View className="absolute inset-0 items-center justify-center bg-background/60">
//         <ActivityIndicator
//           size="large"
//           color="#FF6B00"
//         />
//       </View>
//     </Animated.View>
//   )
// }
