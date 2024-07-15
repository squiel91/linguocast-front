export const getReadablePosition = (index: number): string => {
  const position = index + 1 
  const suffixes = ["th", "st", "nd", "rd"]
  return `${position}${suffixes[position] ?? suffixes[0]}`
}

export const calculateAvarage = (array: number[]) => {
  if (array.length === 0) return null
  return array.reduce((acc, c) => acc + c, 0) / array.length
}
