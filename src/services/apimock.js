const mockData = [
  {
    author: 'juan',
    name: 'house',
    points: [
      { x: 50, y: 50 },
      { x: 120, y: 50 },
      { x: 120, y: 120 },
      { x: 50, y: 120 },
    ],
  },
  {
    author: 'juan',
    name: 'tree',
    points: [
      { x: 200, y: 60 },
      { x: 240, y: 120 },
      { x: 160, y: 120 },
    ],
  },
]

const apimock = {
  getAll: async () => {
    return mockData
  },

  getByAuthor: async (author) => {
    return mockData.filter((bp) => bp.author === author)
  },

  getByAuthorAndName: async (author, name) => {
    return mockData.find((bp) => bp.author === author && bp.name === name)
  },

  create: async (blueprint) => {
    mockData.push(blueprint)
    return blueprint
  },
}

export default apimock
