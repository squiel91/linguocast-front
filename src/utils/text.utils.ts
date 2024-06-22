export const capitalize = (text: string): string => {
  return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
}

export const readableJoin = (items: string[]): string => {
  if (items.length === 1) return items[0]
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
}

export const removePunctuation = (input: string): string => {
  const punctuationRegex = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~。，！？；：""''「」『』（）【】《》〈〉…—～·]/g;
  return input.replace(punctuationRegex, '');
}
