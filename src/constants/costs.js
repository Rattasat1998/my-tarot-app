export const READING_COSTS = {
    daily: { cost: 1, isDaily: true },
    monthly: { cost: 10, isDaily: false },
    love: { cost: 5, isDaily: false },
    work: { cost: 3, isDaily: false },
    finance: { cost: 3, isDaily: false },
    health: { cost: 3, isDaily: false },
    social: { cost: 3, isDaily: false },
    luck: { cost: 3, isDaily: false },
    future: { cost: 1, isDaily: false },
    default: { cost: 3, isDaily: false }
};

export const getReadingCost = (topic) => {
    return READING_COSTS[topic] || READING_COSTS.default;
};
