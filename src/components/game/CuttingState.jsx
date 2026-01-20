import React from 'react';
import { CuttingAnimation } from './CuttingAnimation';

export const CuttingState = ({ onCutComplete }) => (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in zoom-in duration-500">
        <h2 className="text-2xl sm:text-3xl font-serif mb-12 text-center animate-pulse text-purple-300">
            กรุณาตัดไพ่... (เลือกตำแหน่งที่ต้องการตัด)
        </h2>
        <div className="cursor-pointer hover:scale-105 transition-transform" onClick={onCutComplete}>
            <CuttingAnimation onComplete={onCutComplete} />
        </div>
    </div>
);
