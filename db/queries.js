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
      },
      tags: true
    },
    omit: {
      content: true
    },
    orderBy: { createdAt: 'desc' }
  })
}

async function retrieveSpecificPosts(tagName) {
  return await prisma.post.findMany({
    where: {
      tags: {
        some: {
          name: tagName
        }
      }
    },
    include: {
      author: {
        select: {
          name: true,
          username: true,
        }
      },
      tags: true
    },
    omit: {
      content: true
    },
    orderBy: { createdAt: 'desc' }
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
      },
      tags: true
    }
  })
}

async function retrieveAllTags() {
  return await prisma.tag.findMany()
}

async function retrieveComments(postId) {
  return await prisma.comment.findMany({
    where: {postId: postId},
    include: {author: true},
    orderBy: {createdAt: 'asc'}
  })
}

async function postNewComment(newComment, postId, userId) {
  return await prisma.comment.create({
    data: {
      authorId: userId,
      body: newComment,
      postId: postId
    }
  })
}

async function postNewArticle(authorId, title, subtitle, content, tags) {
  return await prisma.post.create({
    data: {
      authorId: authorId,
      title: title,
      subtitle: subtitle,
      content: content,
      tags: {
        connectOrCreate: tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        }))
      }
    }
  })
}

module.exports = {
  createNewUser,
  findUniqueUser,
  retrieveAllPosts,
  retrieveSpecificPosts,
  retrievePost,
  retrieveAllTags,
  retrieveComments,
  postNewComment,
  postNewArticle,
 }