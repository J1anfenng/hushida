export interface Location {
  name: string
  coords: [number, number]
  description?: string
  image?: string
  detailId: string
}

export interface Comment {
  id: string
  username: string
  content: string
  time: string
}

export {} 