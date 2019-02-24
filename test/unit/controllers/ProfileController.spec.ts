import { ProfileController } from '~/server/controllers'
import { ProfileService } from '~/server/services'

describe('ProfileController', () => {

  let ctrl: ProfileController
  let profileService: ProfileService

  beforeEach(() => {
    profileService = new ProfileService()
    ctrl = new ProfileController(profileService)
  })

  test('should return profile', async () => {
    // Given
    const username = 'Eric Simons'
    const mockProfile = profileService.generateProfile(username)
    profileService.profile = jest.fn().mockImplementation(() => mockProfile)

    // When
    const data = await ctrl.profile(username)

    // Then
    expect(profileService.profile).toHaveBeenCalled()
    expect(data).toHaveProperty('profile')
    expect(data.profile).toBe(mockProfile)
  })

  it.skip('should throw username is required error', () => true)
})
