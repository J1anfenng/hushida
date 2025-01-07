export interface Location {
  name: string
  coords: [number, number]
  description?: string
  image?: string
  images?: string[]
  videos?: string[]
  detailId: string
}

export interface Detail {
  name: string
  description: string
  images: string[]
  videos: string[]
}


export interface Comment {
  id: string
  username: string
  content: string
  time: string
}

export {} 