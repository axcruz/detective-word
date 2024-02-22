import {getInvestigations} from '../utils';
import { db } from '../firebase/config';

jest.mock('../firebase/config', () => ({
  db: {
    collection: jest.fn(),
  },
}));

const mockFirestore = () => {
  const data = {
    investigations: [
      { id: 'inv1', case_num: 1 }
    ],
    scores: {
      inv1: [{ playerId: 'player123', levelId: 'lvl1-1', score: 100 }, {playerId: 'player123', levelId: 'lvl1-2', score: 50 }]
    },
  };

  db.collection.mockImplementation((collectionName) => {
    return {
      orderBy: () => {
        return {
          get: async () => {
            if (collectionName === 'investigations') {
              return { docs: data.investigations.map((inv) => ({ id: inv.id, data: () => inv })) };
            } else if (collectionName === 'scores') {
              return { docs: data.investigations.map((inv) => ({ id: inv.id, data: () => ({}) })) };
            }
          },
        };
      },
      where: () => {
        return {
          where: () => {
            return {
              get: async () => {
                const invId = 'inv1';
                return {
                  forEach: (callback) => {
                    data.scores[invId].forEach((scoreData) => {
                      callback({ data: () => scoreData });
                    });
                  },
                };
              },
            };
          },
        };
      },
    };
  });
};

describe('getInvestigations', () => {
  beforeAll(() => {
    mockFirestore();
  });

  it('fetches investigations and calculates total levels completed and total score', async () => {
    const playerId = 'player123';
    const result = await getInvestigations(playerId);

    // Expected result based on the mocked data
    const expectedResult = [
      { id: 'inv1', case_num: 1, totalLevelsCompleted: 2, totalScore: 150 }
    ];

    expect(result).toEqual(expectedResult);
  });

  it('throws an error if there is an issue fetching investigations', async () => {
    db.collection.mockImplementation(() => {
      throw new Error('Firebase fetch error');
    });

    const playerId = 'player123';

    // Assert that the function throws an error
    await expect(getInvestigations(playerId)).rejects.toThrow('Firebase fetch error');
  });
});
