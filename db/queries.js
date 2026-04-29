//import { prisma } from '../lib/prisma.js' //ESM format
const { prisma } = require('../lib/prisma.js') //CJS format

async function createNewUser(username, displayName, password) {
  return await prisma.user.create({
    data: {
      name: displayName,
      username: username,
      password: password
    }
  })
}

async function findUniqueUser(username) {
  return await prisma.user.findUnique({where: {username: username}})
}

async function retrieveAllPosts() {
  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          name: true,
          username: true,
        }
      }
    },
    omit: {
      content: true
    }
  })
}

async function retrievePost(postId) {
  return await prisma.post.findFirst({
    where: {
      id: postId
    },
    include: {
      author: {
        select: {
          name: true,
          username: true,
        }
      }
    }
  })
}

module.exports = {
  createNewUser,
  findUniqueUser,
  retrieveAllPosts,
  retrievePost,
 }