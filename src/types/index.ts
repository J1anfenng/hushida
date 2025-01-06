export interface Location {
  name: string
  coords: [number, number]
  description?: string
  image?: string
  images: string[]
  videos: string[]
  detailId: string
}

export interface Comment {
  id: string
  username: string
  content: string
  time: string
}

export {} 