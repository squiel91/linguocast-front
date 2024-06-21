export const getReadablePosition = (index: number): string => {
  const position = index + 1 
  const suffixes = ["th", "st", "nd", "rd"]
  return `${position}${suffixes[position] ?? suffixes[0]}`
}
