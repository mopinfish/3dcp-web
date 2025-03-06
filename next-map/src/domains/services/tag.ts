import { TagRepository } from '../repositories'

type Reporitories = {
  tag: TagRepository | null
}

export default class TagService {
  constructor(
    readonly repositories: Reporitories = {
      tag: null,
    },
  ) {}

  async getTags() {
    const props = {}
    try {
      const tags = await this.repositories.tag?.get(props)
      if (!tags) return []
      return tags
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async findTag(id: number) {
    try {
      const tag = await this.repositories.tag?.find(id)
      if (!tag) return null
      return tag
    } catch (e) {
      console.error(e)
      return null
    }
  }
}
