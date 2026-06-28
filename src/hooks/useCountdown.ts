import { useEffect, useState } from 'react'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  isOver: boolean
}

export function useCountdown(targetDate: Date | string | number): Countdown {
  const getCountdownValues = (target: number): Countdown => {
    const difference = target - Date.now()

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds, isOver: false }
  }

  const targetMs = new Date(targetDate).getTime()
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdownValues(targetMs))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownValues(targetMs))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetMs])

  return countdown
}
