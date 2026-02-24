import React, { useEffect, useRef } from 'react';

export const ProgressChart = ({ currentDay, isDark }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Chart && canvasRef.current) {
      // Destroy existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      const daysPassed = currentDay;
      const totalDays = 365;
      
      chartRef.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Passed', 'Remaining'],
          datasets: [{
            data: [daysPassed, totalDays - daysPassed],
            backgroundColor: ['#d4af37', '#e5e7eb'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          },
          animation: {
            animateScale: true,
            animateRotate: true
          }
        },
        plugins: [{
          id: 'textCenter',
          beforeDraw: function(chart) {
            var width = chart.width,
                height = chart.height,
                ctx = chart.ctx;
    
            ctx.restore();
            var fontSize = (height / 114).toFixed(2);
            ctx.font = "bold " + fontSize + "em sans-serif";
            ctx.textBaseline = "middle";
            ctx.fillStyle = isDark ? "#f5f5f4" : "#4a4a4a";
    
            var text = "Day " + daysPassed,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2;
    
            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        }]
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [currentDay, isDark]);

  return (
    <>
      <div className="chart-container" style={{ height: '180px', maxHeight: '180px' }}>
        <canvas ref={canvasRef} id="progressChart"></canvas>
      </div>
      <p className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-500'} mt-2 text-center`}>
        ผ่านไปแล้ว {Math.round((currentDay / 365) * 100)}% ของปี 2026
      </p>
    </>
  );
};
