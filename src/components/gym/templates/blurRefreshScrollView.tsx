import { useScreenBlur } from "@/context/screenBlurContext"
import React, { useCallback, useEffect, useState } from "react"
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native"
import { ALERT_TYPE, Toast } from "react-native-alert-notification"

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
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Failed",
        textBody: "Failed to refresh data"
      })
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
