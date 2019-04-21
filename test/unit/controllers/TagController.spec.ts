import { TagController } from '~/server/controllers'
import { TagService } from '~/server/services'

describe('TagController', () => {

  let ctrl: TagController
  let tagService: TagService

  beforeEach(() => {
    tagService = new TagService({} as any)
    ctrl = new TagController(tagService)
  })

  test('should return tags', async () => {
    // Given
    const mockTags = ['tag1', 'tag2']
    tagService.list = jest.fn().mockImplementation(() => mockTags)

    // When
    const data = await ctrl.tags()

    // Then
    expect(tagService.list).toHaveBeenCalled()
    expect(data).toHaveProperty('tags')
    expect(data.tags).toBe(mockTags)
  })

  test('should return tags2', async () => {
    // Given
    const mockTags = ['tag3', 'tag4']
    tagService.list = jest.fn().mockImplementation(() => mockTags)

    // When
    const data = await ctrl.tags()

    // Then
    expect(tagService.list).toHaveBeenCalled()
    expect(data).toHaveProperty('tags')
    expect(data.tags).toBe(mockTags)
  })
})
