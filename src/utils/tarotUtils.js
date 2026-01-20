import { READING_TOPICS } from '../constants/readingTopics';

export const getPositionLabel = (index, topic, readingType) => {
    const topicLabel = READING_TOPICS.find(t => t.id === topic)?.label || '';

    if (readingType === '1-card' || topic === 'daily') {
        return `คำทำนาย${topicLabel}`;
    }

    const timeframes = ['อดีต/พื้นฐาน', 'ปัจจุบัน/สถานการณ์', 'อนาคต/บทสรุป'];
    return `${timeframes[index]} (${topicLabel})`;
};
