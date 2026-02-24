import React from 'react';

export const DayNavigation = ({ days, currentIndex, onDayChange, isDark }) => {
  return (
    <div className={`${isDark ? 'bg-stone-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
      <div className={`p-4 ${isDark ? 'bg-stone-700' : 'bg-stone-800'} text-white`}>
        <h3 className="font-medium text-center">เลือกวันเพื่อดูคำทำนาย</h3>
      </div>
      <nav className="flex flex-col text-sm">
        {days.map((day, index) => (
          <button
            key={day.id}
            onClick={() => onDayChange(index)}
            className={`text-left px-6 py-3 transition-colors border-b ${
              isDark ? 'border-stone-700' : 'border-stone-100'
            } flex justify-between items-center group ${
              currentIndex === index
                ? isDark ? 'bg-stone-700 border-l-4 border-yellow-500 font-bold' : 'bg-stone-50 border-l-4 border-yellow-500 font-bold'
                : isDark ? 'hover:bg-stone-700' : 'hover:bg-stone-50'
            }`}
          >
            <span className={isDark ? 'text-stone-300' : 'text-stone-700'}>{day.dayTH}</span>
            <span className={`${isDark ? 'text-stone-500 group-hover:text-stone-400' : 'text-stone-400 group-hover:text-stone-600'} text-xs`}>
              {day.emoji}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};
