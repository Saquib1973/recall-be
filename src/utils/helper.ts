import bcrypt from 'bcryptjs'
function generateRandomHash(length: number) {
  let options = 'qwertyuiopasdfghjklzxcvbnm1234567890'
  let len = options.length
  let hash = ''
  for (let i = 0; i < length; i++) {
    hash += options[Math.floor(Math.random() * len)]
  }
  return hash
}
async function createPassswordHash(password: string) {
  let hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

async function comparePassword(password: string, hashPassword: string) {
  return await bcrypt.compare(password, hashPassword)
}
function findTypeOfContent(item: string) {
  const testLink = [
    'https://youtu.be/NKO-CeS1z8c?si=t0ptVmS4XldR0TW-',
    'https://www.youtube.com/watch?v=NKO-CeS1z8c',
    'https://www.youtube.com/embed/NKO-CeS1z8c?si=WFpqEs7cpVUT_H4q',
    'https://www.youtube.com/watch?v=Mz7ktiWuY5g&list=RDMz7ktiWuY5g&start_radio=1&rv=Mz7ktiWuY5g',
    'https://www.youtube.com/watch?v=l4BSJZnEX_c&list=RDMz7ktiWuY5g&index=3',
    'https://youtu.be/l4BSJZnEX_c?si=AhFjWbyqpGXkOOym',
    'https://x.com/BDOSINT/status/1882706137830896094',
    'https://x.com/BDOSINT/status/1882706137830896094'
  ]


    if (item.includes("www.youtube.com") || item.includes("youtu.be")) {
      return "youtube";
    } else if (item.includes("pinterest.com")) {
      return "pinterest";
    } else if (item.includes("twitter.com") || item.includes("https://x.com")) {
      return "twitter";
    } else if (item.includes("instagram.com")) {
      return "instagram";
    }else {
      return "others"
    }
}

export {
  comparePassword,
  generateRandomHash,
  createPassswordHash,
  findTypeOfContent,
}
