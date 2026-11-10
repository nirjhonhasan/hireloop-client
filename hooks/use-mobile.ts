import * as React from "react"

const MOBILE_BREAKPOINT = 768

const mediaQuery =
  typeof window === "undefined"
    ? null
    : window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

function subscribe(onStoreChange: () => void) {
  mediaQuery?.addEventListener("change", onStoreChange)
  return () => mediaQuery?.removeEventListener("change", onStoreChange)
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribe,
    () => mediaQuery?.matches ?? false,
    () => false
  )
}
