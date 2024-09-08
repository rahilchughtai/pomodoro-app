export const normalizeToZero = (numb: number) => {
    if (numb === 0) {
        return '00'
    }
    return numb
}


export const secondsToMinutesDisplay = (count: number) => normalizeToZero(Math.floor(count / 60))
export const secondsDisplay = (count: number) => normalizeToZero(count % 60)