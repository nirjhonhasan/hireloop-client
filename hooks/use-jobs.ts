"use client"

import { useCallback, useEffect, useState } from "react"
import type { Job } from "@/lib/types"
import { getJobs } from "@/lib/jobs"

/** Reads the job list from the server; call `refetch` after a mutation. */
export function useJobs() {
  const [jobs, setJobs] = useState<Job[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    try {
      setJobs(await getJobs())
      setError(null)
    } catch {
      setError("Could not load jobs from the server.")
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    getJobs()
      .then((data) => {
        if (!cancelled) {
          setJobs(data)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not load jobs from the server.")
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { jobs, error, refetch }
}

/** Wraps a mutation so its failure surfaces as one boolean flag. */
export function useJobMutation() {
  const [pending, setPending] = useState(false)

  const run = useCallback(async (mutation: () => Promise<unknown>) => {
    setPending(true)
    try {
      await mutation()
      return true
    } catch {
      return false
    } finally {
      setPending(false)
    }
  }, [])

  return { run, pending }
}
