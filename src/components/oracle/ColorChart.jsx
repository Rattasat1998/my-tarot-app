import React, { useEffect, useRef } from 'react';

export const ColorChart = ({ colors, colorNames, isDark }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Chart && canvasRef.current) {
      // Destroy existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new window.Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: colorNames,
          datasets: [{
            data: [10, 10, 10],
            backgroundColor: colors,
            borderColor: '#ffffff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              display: false
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              titleColor: '#333',
              bodyColor: '#333',
              borderColor: '#ddd',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return ' สีมงคล: ' + context.label;
                }
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          }
        }
      });
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [colors, colorNames]);

  return (
    <>
      <div className="chart-container" style={{ height: '250px' }}>
        <canvas ref={canvasRef} id="colorChart"></canvas>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs">
        {colorNames.map((name, i) => (
          <div key={i} className="flex flex-col items-center">
            <span 
              className="w-4 h-4 rounded-full inline-block mb-1 shadow-sm" 
              style={{ backgroundColor: colors[i] }}
            ></span>
            <span className={isDark ? 'text-stone-400' : 'text-stone-600'}>{name}</span>
          </div>
        ))}
      </div>
    </>
  );
};
