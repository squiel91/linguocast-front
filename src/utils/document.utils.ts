export const usePageTitle = (title?: string) => {
  document.title = title ? `${title} | Linguocast` : 'Linguocast'
}
