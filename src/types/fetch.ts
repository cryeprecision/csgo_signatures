export type FetchCallback = (result: FetchResult) => void

export interface FetchResult {
  url: string
  index: number
  data: string
}

export const fetchOne = async (url: string, signal?: AbortSignal): Promise<string> => {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('response-code not 200')
  return response.text()
}
export const fetchOneJson = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('response-code not 200')
  return response.json() as T
}

export const toJson = <T>(data: string): T => {
  return JSON.parse(data) as T
}

export const fetchAll = async (urls: string[], signal?: AbortSignal, callback?: FetchCallback): Promise<FetchResult[]> => {
  return Promise.all(
    urls.map((url, index) =>
      fetchOne(url, signal).then(data => {
        const result = { url, index, data }
        callback?.(result)
        return result
      }),
    ),
  )
}
