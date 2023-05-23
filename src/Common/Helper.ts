/**
 * 이메일 검사
 * @param email
 */
export const emailValidator = (email: string): boolean => {
    const mailFormat = /\S+@\S+\.\S+/
    return !!email.match(mailFormat)
}

/**
 * mysql timestamp 변환
 * @param inputDate
 */
export const toMySqlDatetime = (inputDate: Date): string => {
    const date = new Date(inputDate)
    const dateWithOffest = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return dateWithOffest.toISOString().slice(0, 19).replace('T', ' ')
}
