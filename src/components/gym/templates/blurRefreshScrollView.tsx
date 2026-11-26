import { useScreenBlur } from "@/context/screenBlurContext"
import React, { useCallback, useEffect, useState } from "react"
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native"

type Props = ScrollViewProps & {
  onRefresh: () => Promise<unknown>
}

export function BlurRefreshScrollView({ onRefresh, children, ...scrollProps }: Readonly<Props>) {
  const { setBlurred } = useScreenBlur()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    setBlurred(refreshing)
    return () => setBlurred(false)
  }, [refreshing, setBlurred])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      await onRefresh()
    } catch (error) {
      console.log("Refresh error:", error)
    } finally {
      setRefreshing(false)
    }
  }, [onRefresh])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      {...scrollProps}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={["#FF6B00"]}
        />
      }
    >
      {children}
    </ScrollView>
  )
}
