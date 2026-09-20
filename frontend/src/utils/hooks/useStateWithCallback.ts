import { useEffect, useRef, useState } from "react"

const useStateWithCallback = <T>(initialState: T): [T, (newState: T, cb?: () => void) => void] => {
    const [state, setState] = useState<T>(initialState)
    const callback = useRef<(() => void) | null>(null)

    const updateState = (newState: T, cb?: () => void) => {
        if (cb) {
            callback.current = cb
        }

        setState(newState)
    }

    useEffect(() => {
        if (callback.current) {
            callback.current()
            callback.current = null
        }
    }, [state])

    return [state, updateState]
}

export default useStateWithCallback