import { useCallback, useEffect, useRef, useState } from "react"

type Updater<T> = T | ((prevState: T) => T)

const useStateWithCallback = <T>(initialState: T): [T, (newState: Updater<T>, cb?: () => void) => void] => {
    const [state, setState] = useState<T>(initialState)
    const callback = useRef<(() => void) | null>(null)

    const updateState = useCallback((newState: Updater<T>, cb?: () => void) => {
        if (cb) {
            callback.current = cb
        }

        setState(newState)
    }, [])

    useEffect(() => {
        if (callback.current) {
            callback.current()
            callback.current = null
        }
    }, [state])

    return [state, updateState]
}

export default useStateWithCallback