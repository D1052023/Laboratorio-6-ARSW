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

  update: async (author, name, blueprint) => {

    const index = mockData.findIndex(
      (bp) => bp.author === author && bp.name === name
    )

    if (index === -1) {
      throw new Error("Blueprint not found")
    }

    mockData[index] = {
      ...mockData[index],
      ...blueprint
    }

    return mockData[index]
  },

  remove: async (author, name) => {

    const index = mockData.findIndex(
      (bp) => bp.author === author && bp.name === name
    )

    if (index === -1) {
      throw new Error("Blueprint not found")
    }

    const deleted = mockData.splice(index, 1)

    return deleted[0]
  }

}

export default apimock