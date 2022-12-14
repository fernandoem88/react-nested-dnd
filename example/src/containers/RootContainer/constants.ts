const INITIAL_VALUES = {
  workspace: {
    containersOrder: ['container-1', 'container-2'] as const
  },
  containers: {
    'container-1': {
      id: 'container-1',
      items: ['1', '2', '3', '4', '5'],
      isNested: false
    },
    'container-2': {
      id: 'container-2',
      items: ['6', '7', '8', '9', '10', '11'],
      isNested: false
    }
  },
  items: {
    '1': { id: '1', text: 'one', type: 'odd' },
    '2': { id: '2', text: 'two', type: 'even' },
    '3': { id: '3', text: 'three', type: 'odd' },
    '4': { id: '4', text: 'four', type: 'even' },
    '5': { id: '5', text: 'five', type: 'odd' },
    '6': { id: '6', text: 'six', type: 'even' },
    '7': { id: '7', text: 'seven', type: 'odd' },
    '8': { id: '8', text: 'height', type: 'even' },
    '9': { id: '9', text: 'nine', type: 'odd' },
    '10': { id: '10', text: 'ten', type: 'even' },
    '11': { id: '11', text: 'eleven', type: 'odd' }
  }
}

export { INITIAL_VALUES }
