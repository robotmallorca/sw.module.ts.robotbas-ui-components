// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { getEstimateSize } from '../../src/runtime/utils/virtualizer'

describe('getEstimateSize', () => {
  it('returns the compact size when no item has a description', () => {
    expect(getEstimateSize([], 'md')).toBe(32)
    expect(getEstimateSize(['a', 'b'], 'md')).toBe(32)
  })

  it('maps each size to its compact height', () => {
    expect(getEstimateSize([], 'xs')).toBe(24)
    expect(getEstimateSize([], 'sm')).toBe(28)
    expect(getEstimateSize([], 'md')).toBe(32)
    expect(getEstimateSize([], 'lg')).toBe(36)
    expect(getEstimateSize([], 'xl')).toBe(40)
  })

  it('returns the taller size when any item has a description', () => {
    const items = [{ label: 'A' }, { label: 'B', desc: 'has description' }]
    expect(getEstimateSize(items, 'md', 'desc')).toBe(52)
  })

  it('maps each size to its tall height when a description is present', () => {
    const items = [{ desc: 'x' }]
    expect(getEstimateSize(items, 'xs', 'desc')).toBe(44)
    expect(getEstimateSize(items, 'xl', 'desc')).toBe(60)
  })

  it('ignores the description key when no item actually has that field', () => {
    expect(getEstimateSize([{ label: 'A' }], 'md', 'desc')).toBe(32)
  })

  it('treats empty-string descriptions as absent', () => {
    expect(getEstimateSize([{ desc: '' }], 'md', 'desc')).toBe(32)
  })
})
