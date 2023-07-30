import { PrismaClient } from '@prisma/client'
import "server-only"

// Basically we are instantiating our PrismaClient
//Aim of this file is => We want to avoid multiple instantiation of PrismaClient in development mode
// check prisma docs for more info

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

export const db = prisma