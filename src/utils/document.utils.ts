export const useTitle = (title?: string, exact = false) => {
  if (!title) document.title = 'Linguocast | The podcast platform for language learners'
  else document.title = exact ? title : `${title} | Linguocast`
}
