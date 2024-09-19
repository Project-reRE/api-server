export function getPage(page?: number): number {
  if (!page || page <= 0) {
    return 1
  }

  return page
}

export function getLimit(limit?: number, defaultLimit = 25): number {
  if (!limit || limit <= 0) {
    return defaultLimit
  }

  return limit
}

export function getOrder(orderBy?: string, alias?: string) {
  if (!orderBy) {
    return undefined
  }

  const result: { [key: string]: 'DESC' | 'ASC' } = {}

  orderBy.split(',').forEach((attribute) => {
    const isDescField = attribute.trim().charAt(0) === '-'
    const field = isDescField ? attribute.trim().substr(1) : attribute.trim()
    const order = isDescField ? 'DESC' : 'ASC'
    result[alias && field.split('.').length === 1 ? `${alias}.${field}` : field] = order
  })

  return result
}

export function getSelect(select: string, alias?: string, primaryKey = 'id'): string[] {
  if (!select?.split(',').length) {
    return undefined
  }

  if (!alias) {
    const selection = select.split(',')
    if (!selection.includes(primaryKey)) {
      selection.push(primaryKey)
    }
    return selection
  }

  const selection = select
    // .replace(' ', '')
    .split(',')
    .map((attribute) => (attribute.split('.').length === 1 ? `${alias}.${attribute}` : attribute))

  if (!selection.includes(`${alias}.${primaryKey}`) && primaryKey != null) {
    selection.push(`${alias}.${primaryKey}`)
  }

  return selection
}

export function getSkip(page?: number, limit?: number): number {
  if (!page) {
    return undefined
  }

  const skip = (getPage(page) - 1) * getLimit(limit)
  return skip
}

export function getTake(limit?: number): number {
  return getLimit(limit)
}

export function getWhere(where?: string): any {
  if (!where) {
    return undefined
  }

  return JSON.parse(where)
}
