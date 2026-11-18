export interface TypePackage {
  WEEKLY: Package[]
  MONTHLY: Package[]
  YEARLY: Package[]
}

export interface Package {
  id: string
  name: string
  description: string
  type: string
  duration: number
  price: number
}
