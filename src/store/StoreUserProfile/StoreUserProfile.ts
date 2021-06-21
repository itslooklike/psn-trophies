import { makeAutoObservable, runInAction } from 'mobx'
import { fetcher } from '../../utils'
import { IUserProfile } from './types'
// import { mock1 } from './mocks'

export class StoreUserProfile {
  data: IUserProfile | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetch() {
    const { data } = await fetcher.get<IUserProfile>(`/userProfile/v1/users/trueKanta/profile2`, {
      baseURL: 'https://ru-prof.np.community.playstation.net',
      params: {
        fields:
          'onlineId,aboutMe,consoleAvailability,languagesUsed,avatarUrls,personalDetail,personalDetail(@default,profilePictureUrls),primaryOnlineStatus,trophySummary(level,progress,earnedTrophies),plus,isOfficiallyVerified,friendRelation,personalDetailSharing,presences(@default,platform),npId,blocking,following,currentOnlineId,displayableOldOnlineId,mutualFriendsCount,followerCount',
        profilePictureSizes: 's,m,l',
        avatarSizes: 's,m,l',
      },
    })

    runInAction(() => {
      this.data = data
    })
  }
}
