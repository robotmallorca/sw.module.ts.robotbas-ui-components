// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  pick,
  omit,
  get,
  set,
  looseToNumber,
  compare,
  isEmpty,
  getDisplayValue,
  isArrayOfArray,
  mergeClasses,
} from '../../src/runtime/utils/index'

describe('pick', () => {
  it('keeps only the requested keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('ignores keys that are absent', () => {
    expect(pick({ a: 1 } as { a: number, b?: number }, ['a', 'b'])).toEqual({ a: 1, b: undefined })
  })
})

describe('omit', () => {
  it('removes the requested keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 })
  })

  it('does not mutate the source object', () => {
    const source = { a: 1, b: 2 }
    omit(source, ['b'])
    expect(source).toEqual({ a: 1, b: 2 })
  })
})

describe('get', () => {
  it('reads a nested value with a string path', () => {
    expect(get({ a: { b: { c: 5 } } }, 'a.b.c')).toBe(5)
  })

  it('reads through array indices', () => {
    expect(get({ items: [{ x: 1 }, { x: 2 }] }, 'items.1.x')).toBe(2)
  })

  it('returns the default when the path is missing', () => {
    expect(get({ a: 1 }, 'a.b.c', 'fallback')).toBe('fallback')
  })

  it('returns the default when the object is nullish', () => {
    expect(get(undefined, 'a', 'fallback')).toBe('fallback')
  })

  it('accepts an array path', () => {
    expect(get({ a: [{ y: 9 }] }, ['a', 0, 'y'])).toBe(9)
  })
})

describe('set', () => {
  it('assigns a value at a nested path, creating intermediates', () => {
    const obj: Record<string, any> = {}
    set(obj, 'a.b.c', 42)
    expect(obj).toEqual({ a: { b: { c: 42 } } })
  })

  it('overwrites an existing value', () => {
    const obj = { a: { b: 1 } }
    set(obj, 'a.b', 2)
    expect(obj.a.b).toBe(2)
  })
})

describe('looseToNumber', () => {
  it('parses numeric strings', () => {
    expect(looseToNumber('42')).toBe(42)
    expect(looseToNumber('3.14')).toBe(3.14)
  })

  it('returns the original value when not parseable', () => {
    expect(looseToNumber('abc')).toBe('abc')
  })
})

describe('compare', () => {
  it('returns false when either value is undefined', () => {
    expect(compare(undefined, 'a')).toBe(false)
    expect(compare('a', undefined)).toBe(false)
  })

  it('compares primitive strings by equality', () => {
    expect(compare('a', 'a')).toBe(true)
    expect(compare('a', 'b')).toBe(false)
  })

  it('deep-compares objects by default', () => {
    expect(compare({ id: 1 }, { id: 1 })).toBe(true)
    expect(compare({ id: 1 }, { id: 2 })).toBe(false)
  })

  it('uses a string comparator as a key', () => {
    expect(compare({ id: 1, name: 'a' }, { id: 1, name: 'b' }, 'id')).toBe(true)
  })

  it('uses a function comparator', () => {
    expect(compare({ v: 2 }, { v: 4 }, (a, b) => a.v * 2 === b.v)).toBe(true)
  })
})

describe('isEmpty', () => {
  it('treats nullish as empty', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('treats blank strings as empty but not other strings', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('   ')).toBe(true)
    expect(isEmpty('x')).toBe(false)
  })

  it('never treats booleans or numbers as empty', () => {
    expect(isEmpty(false)).toBe(false)
    expect(isEmpty(0)).toBe(false)
  })

  it('handles arrays, objects, maps and sets by size', () => {
    expect(isEmpty([])).toBe(true)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({})).toBe(true)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty(new Map())).toBe(true)
    expect(isEmpty(new Set([1]))).toBe(false)
  })

  it('never treats dates as empty', () => {
    expect(isEmpty(new Date())).toBe(false)
  })
})

describe('getDisplayValue', () => {
  const items = [
    { id: 1, name: 'One' },
    { id: 2, name: 'Two' },
  ]

  it('returns the matching item label by keys', () => {
    expect(getDisplayValue(items, 2, { valueKey: 'id', labelKey: 'name' })).toBe('Two')
  })

  it('returns undefined for an empty value', () => {
    expect(getDisplayValue(items, null, { valueKey: 'id', labelKey: 'name' })).toBeUndefined()
  })

  it('stringifies a primitive value that is present in the list', () => {
    expect(getDisplayValue(['a', 'b'], 'b')).toBe('b')
  })

  it('falls back to the raw value when not found', () => {
    expect(getDisplayValue(['a'], 'z')).toBe('z')
  })
})

describe('isArrayOfArray', () => {
  it('detects a nested array', () => {
    expect(isArrayOfArray([['a'], ['b']])).toBe(true)
  })

  it('returns false for a flat array', () => {
    expect(isArrayOfArray(['a', 'b'])).toBe(false)
  })
})

describe('mergeClasses', () => {
  it('returns an empty string when nothing is provided', () => {
    expect(mergeClasses(undefined, undefined)).toBe('')
  })

  it('merges a string app-config class with a prop class', () => {
    expect(mergeClasses('a', 'b')).toEqual(['a', 'b'])
  })

  it('merges an array app-config class with a prop class', () => {
    expect(mergeClasses(['a', 'b'], 'c')).toEqual(['a', 'b', 'c'])
  })

  it('filters out falsy entries', () => {
    expect(mergeClasses(['a', ''], undefined)).toEqual(['a'])
  })
})
