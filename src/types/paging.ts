export type Paging = {
  pages: number
  start: number
  end: number
}

export const paging = (items: number, pageSize: number, page: number): Paging => {
  const pageCount = Math.floor((items + pageSize - 1) / pageSize)
  page = Math.min(Math.max(page, 1), pageCount)
  return { pages: pageCount, start: (page - 1) * pageSize, end: Math.min(page * pageSize, items) }
}
