import React from 'react';

export const OracleCard = ({ day, isDark }) => {
  return (
    <div className={`${isDark ? 'bg-stone-800' : 'bg-white'} rounded-xl shadow-lg p-8 h-full flex flex-col justify-center border-t-8 transition-all duration-300 fade-in ${day.accent}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className={`text-sm font-bold ${isDark ? 'text-stone-400' : 'text-stone-400'} tracking-widest uppercase mb-1`}>
            {day.dayEN}
          </h2>
          <h1 className={`text-3xl font-light ${isDark ? 'text-stone-100' : 'text-stone-800'}`}>
            {day.dayTH}
          </h1>
        </div>
        <div className="text-5xl filter drop-shadow-sm">
          {day.emoji}
        </div>
      </div>
      
      <div className="mb-8">
        <p className={`text-xl italic font-medium ${isDark ? 'text-stone-300' : 'text-stone-600'} mb-4`}>
          {day.quote}
        </p>
        <p className={`${isDark ? 'text-stone-400' : 'text-stone-500'} leading-relaxed font-light`}>
          {day.desc}
        </p>
      </div>

      <div className={`mt-auto ${isDark ? 'bg-stone-700' : 'bg-stone-50'} rounded-lg p-4 border-l-4 ${isDark ? 'border-stone-500' : 'border-stone-400'}`}>
        <h3 className={`text-xs font-bold ${isDark ? 'text-stone-400' : 'text-stone-500'} uppercase mb-1`}>
          Action Item
        </h3>
        <p className={`${isDark ? 'text-stone-200' : 'text-stone-700'} font-medium`}>
          ✨ {day.action}
        </p>
      </div>
    </div>
  );
};
