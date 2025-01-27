const testLink = [
  'https://youtu.be/NKO-CeS1z8c?si=t0ptVmS4XldR0TW-',
  'https://www.youtube.com/watch?v=NKO-CeS1z8c',
  'https://www.youtube.com/embed/NKO-CeS1z8c?si=WFpqEs7cpVUT_H4q',
  'https://www.youtube.com/watch?v=Mz7ktiWuY5g&list=RDMz7ktiWuY5g&start_radio=1&rv=Mz7ktiWuY5g',
  'https://www.youtube.com/watch?v=l4BSJZnEX_c&list=RDMz7ktiWuY5g&index=3',
  'https://youtu.be/l4BSJZnEX_c?si=AhFjWbyqpGXkOOym',
  'https://x.com/BDOSINT/status/1882706137830896094',
  'https://x.com/BDOSINT/status/1882706137830896094',
  'https://in.pinterest.com/pin/68748412975/',
  'https://chatgpt.com/c/679382db-e080-800c-abea-0fb76e0502d6',
]

const check = async (content) => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/health/health', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: content }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Response:', data)
  } catch (error) {
    console.error('Error:', error)
  }
}

async function call() {
  for (const content of testLink) {
    await check(content)
  }
}

call()
