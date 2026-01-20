import React from 'react';
import { ShuffleAnimation } from './ShuffleAnimation';

export const ShufflingState = ({ onShuffleComplete }) => (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-serif mb-12 text-center animate-pulse text-purple-300">
            กำลังสับไพ่... จงตั้งจิตอธิษฐาน
        </h2>
        <ShuffleAnimation onComplete={onShuffleComplete} />
    </div>
);
