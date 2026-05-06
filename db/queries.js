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

async function retrievePublishedPosts() {
  return await prisma.post.findMany({
    where: {
      isPublished: true
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

async function postNewArticle(authorId, title, subtitle, content, postPictureUrl, tags) {
  return await prisma.post.create({
    data: {
      authorId: authorId,
      title: title,
      subtitle: subtitle,
      content: content,
      postPicture: postPictureUrl,
      tags: {
        connectOrCreate: tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName },
        }))
      }
    }
  })
}

async function updatePublish(postId) {
  const prevPost = await prisma.post.findUnique({
    where: {
      id: postId
    }
  })

  return await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      isPublished: !prevPost.isPublished
    }
  })
}

async function deletePost(postId) {
  await prisma.comment.deleteMany({
    where: {
      postId: postId
    }
  })

  return await prisma.post.delete({
    where: {
      id: postId
    }
  })
}

async function updateArticle(postId, title, subtitle, content, tags, postPictureUrl) {
  if(!postPictureUrl) {
    return await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        title: title,
        subtitle: subtitle,
        content: content,
        updatedAt: new Date(),
        tags: {
          set: [],
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName },
          }))
        }
      }
    })
  }

  return await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      title: title,
      subtitle: subtitle,
      content: content,
      postPicture: postPictureUrl,
      updatedAt: new Date(),
      tags: {
        set: [],
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
  retrievePublishedPosts,
  retrieveSpecificPosts,
  retrievePost,
  retrieveAllTags,
  retrieveComments,
  postNewComment,
  postNewArticle,
  updatePublish,
  deletePost,
  updateArticle,
 }