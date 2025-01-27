const additionalData = [
  {
    title: 'Pinterest Pin 5',
    link: 'https://in.pinterest.com/pin/123456789/',
    description: 'Explore creative DIY projects on Pinterest.',
    type: 'pinterest',
    tags: ['DIY', 'crafts'],
  },
  {
    title: 'Pinterest Pin 6',
    link: 'https://in.pinterest.com/pin/987654321/',
    description: 'Discover delicious recipes on Pinterest.',
    type: 'pinterest',
    tags: ['recipes', 'food'],
  },
  {
    title: 'Pinterest Pin 7',
    link: 'https://in.pinterest.com/pin/456789123/',
    description: 'Find inspiration for your next travel destination.',
    type: 'pinterest',
    tags: ['travel', 'inspiration'],
  },
  {
    title: 'Pinterest Pin 8',
    link: 'https://in.pinterest.com/pin/321654987/',
    description: 'Get tips for improving your photography skills.',
    type: 'pinterest',
    tags: ['photography', 'tips'],
  },
  {
    title: 'Tweet by TechGuru',
    link: 'https://x.com/TechGuru/status/123456789',
    description: 'TechGuru shares insights on the latest gadgets.',
    type: 'twitter',
    tags: ['tech', 'gadgets'],
  },
  {
    title: 'Tweet by FitnessExpert',
    link: 'https://x.com/FitnessExpert/status/987654321',
    description: 'FitnessExpert shares tips for staying healthy.',
    type: 'twitter',
    tags: ['fitness', 'health'],
  },
  {
    title: 'Tweet by Traveler',
    link: 'https://x.com/Traveler/status/456789123',
    description: 'Traveler shares breathtaking travel photos.',
    type: 'twitter',
    tags: ['travel', 'photography'],
  },
  {
    title: 'Tweet by Foodie',
    link: 'https://x.com/Foodie/status/321654987',
    description: 'Foodie shares delicious food recipes.',
    type: 'twitter',
    tags: ['food', 'recipes'],
  },
  {
    title: 'YouTube Video 5',
    link: 'https://www.youtube.com/watch?v=abc123',
    description: 'Learn how to build a website from scratch.',
    type: 'youtube',
    tags: ['web development', 'tutorial'],
  },
  {
    title: 'YouTube Video 6',
    link: 'https://www.youtube.com/watch?v=def456',
    description: 'Explore the world of artificial intelligence.',
    type: 'youtube',
    tags: ['AI', 'technology'],
  },
  {
    title: 'YouTube Video 7',
    link: 'https://www.youtube.com/watch?v=ghi789',
    description: 'Discover the secrets of successful entrepreneurs.',
    type: 'youtube',
    tags: ['entrepreneurship', 'success'],
  },
  {
    title: 'YouTube Video 8',
    link: 'https://www.youtube.com/watch?v=jkl012',
    description: 'Watch a tutorial on advanced photography techniques.',
    type: 'youtube',
    tags: ['photography', 'tutorial'],
  },
  {
    title: 'My Note on Productivity',
    description: 'Here are some tips to improve your productivity.',
    type: 'note',
    tags: ['productivity', 'tips'],
  },
  {
    title: 'My Note on Mindfulness',
    description: 'Practice mindfulness to reduce stress and improve focus.',
    type: 'note',
    tags: ['mindfulness', 'wellness'],
  },
  {
    title: 'My Note on Time Management',
    description: 'Effective time management strategies for busy professionals.',
    type: 'note',
    tags: ['time management', 'productivity'],
  },
  {
    title: 'My Note on Healthy Eating',
    description: 'Tips for maintaining a healthy diet.',
    type: 'note',
    tags: ['health', 'nutrition'],
  },
  {
    title: 'Pinterest Pin 9',
    link: 'https://in.pinterest.com/pin/654321987/',
    description: 'Find inspiration for your next home renovation project.',
    type: 'pinterest',
    tags: ['home renovation', 'inspiration'],
  },
  {
    title: 'Pinterest Pin 10',
    link: 'https://in.pinterest.com/pin/321987654/',
    description: 'Explore creative ways to organize your workspace.',
    type: 'pinterest',
    tags: ['organization', 'workspace'],
  },
  {
    title: 'Tweet by MotivationalSpeaker',
    link: 'https://x.com/MotivationalSpeaker/status/123987654',
    description: 'MotivationalSpeaker shares inspiring quotes.',
    type: 'twitter',
    tags: ['motivation', 'inspiration'],
  },
  {
    title: 'Tweet by BookLover',
    link: 'https://x.com/BookLover/status/654321987/',
    description: 'BookLover shares recommendations for must-read books.',
    type: 'twitter',
    tags: ['books', 'reading'],
  },
]
const bulkData = [
  // Existing data
  {
    title: 'Pinterest Pin 1',
    link: 'https://in.pinterest.com/pin/1477812373598664/',
    description: 'A beautiful Pinterest pin about design inspiration.',
    type: 'pinterest',
    tags: ['design', 'inspiration'],
  },
  // Add more existing data here...

  // Add the transformed new data
  ...additionalData,

]
const addContent = async (content: any) => {
  const response = await fetch('http://localhost:5000/api/v1/content/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OTI0YWE1NDc3MmQ5Y2M1YjAyZDg0YyIsImlhdCI6MTczNzY0MDYyNn0.K3ZSTAqQuzdydz4ez1jRE9IL-Cnkc7R-6IB7JbMCcM0',
    },
    body: JSON.stringify(content),
  })

  if (response.ok) {
    console.log(`Added: ${content.title}`)
  } else {
    console.error(`Failed to add: ${content.title}`, await response.json())
  }
}

const addBulkData = async () => {
  for (const content of bulkData) {
    await addContent(content)
  }
}

addBulkData()
