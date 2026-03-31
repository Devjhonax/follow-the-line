/**
 * @param {object} query
 * @returns {{ skip: number, take: number, page: number, limit: number }}
 */
export function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20))
  const skip = (page - 1) * limit
  return { page, limit, skip, take: limit }
}

/**
 * @param {Array} dados 
 * @param {number} total
 * @param {number} page 
 * @param {number} limit
 */
export function paginate(dados, total, page, limit) {
  return {
    dados,
    meta: {
      total,
      pagina: page,
      limite: limit,
      totalPaginas: Math.ceil(total / limit),
    },
  }
}

