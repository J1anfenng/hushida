export interface Location {
  name: string
  coords: [number, number]
  description?: string
  image?: string
  images?: string[]
  videos?: string[]
  detailId: string
  category: '宿舍' | '食堂' | '文化风景' | '教学科研' | '行政' | '重要场馆';
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