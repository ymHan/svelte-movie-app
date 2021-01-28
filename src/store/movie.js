import axios from 'axios'
import _unionBy from 'lodash/unionBy'
import { writable, get } from 'svelte/store'

export const movies = writable([])
export const loading = writable(false)
export const theMovie = writable({})
export const message = writable('Search for the movie title!')

export function initMovies() {
  movies.set([])
  message.set('Search for the movie title!')
  loading.set(false)
}

export async function searchMovies(payload) {
  if (get(loading)) return
  loading.set(true)
  message.set('')
  
  let total = 0

  try {
    //const res = await _fetchMovie({...payload, page: 1})

    const res = await axios.post('/.netlify/functions/movie', {
      ...payload,
      page: 1
    })

    const { Search, totalResults } = res.data
    movies.set(Search)
    total = totalResults
  } catch (msg) {
    movies.set([])
    message.set(msg)
    loading.set(false)
    return 
  }

  const pageLength = Math.ceil(total / 10)
  if (pageLength > 1) {
    for (let page = 2; page <= pageLength; page += 1) {
      if (page > (payload.number / 10)) break
      const res = await axios.post('/.netlify/functions/movie', {
        ...payload,
        page
      })
      const { Search } = res.data
      movies.update($movies => _unionBy($movies, Search, 'imdbID'))
    }
  }

  loading.set(false)
}

export async function searchMovieWithId(id) {
  if (get(loading)) return
  loading.set(true)

  const res = await axios.post('/.netlify/functions/movie', {
    id
  })
  
  theMovie.set(res.data)
  loading.set(false)
}
