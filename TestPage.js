import React, { useState, useEffect } from 'react';
import { testCases } from './App.test.js';
import { INITIAL_CRITERIA, calculateTotalScore, getComplexity } from './logic.js';

function TestPage({ onViewChange }) {
  const [results, setResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || currentIndex >= testCases.length) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      const testCase = testCases[currentIndex];
      const testCriteria = INITIAL_CRITERIA.map(c => ({
        ...c,
        value: testCase.inputs[c.id] !== undefined ? testCase.inputs[c.id] : c.value,
      }));

      const actualScore = calculateTotalScore(testCriteria);
      const complexityResult = getComplexity(actualScore, testCriteria);
      const actualComplexity = complexityResult ? complexityResult.level : 'Error';

      const passed = actualScore === testCase.expectedScore && actualComplexity === testCase.expectedComplexity;

      setResults(prevResults => [...prevResults, {
        ...testCase,
        actualScore,
        actualComplexity,
        passed,
      }]);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, 800);

    return () => clearTimeout(timer);
  }, [currentIndex, isRunning]);
  
  const progress = (currentIndex / testCases.length) * 100;
  const isComplete = currentIndex >= testCases.length;
  const passedCount = results.filter(r => r.passed).length;

  return React.createElement("div", { className: "bg-slate-100 min-h-screen font-sans" },
    React.createElement("div", { className: "container mx-auto p-4 sm:p-6 lg:p-8" },
      React.createElement("header", { className: "flex items-center justify-between mb-8 pb-4 border-b border-gray-200" },
        React.createElement("h1", { className: "text-3xl font-bold text-gray-800" }, "Testfall-Analyse"),
        React.createElement("button", { 
          onClick: () => onViewChange('calculator'),
          className: "text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-all"
        }, "← Zurück zum Rechner")
      ),
      
      React.createElement("div", { className: "bg-white p-6 rounded-xl shadow-md mb-8" },
        React.createElement("div", { className: "flex justify-between items-center mb-4" },
          React.createElement("h2", { className: "text-lg font-semibold text-gray-700" }, 
            isComplete ? 'Testlauf abgeschlossen' : `Führe Test ${currentIndex + 1} von ${testCases.length} aus...`
          ),
          React.createElement("span", { 
            className: `font-bold text-lg ${isComplete ? (passedCount === testCases.length ? 'text-green-600' : 'text-red-600') : 'text-gray-800'}` 
          }, 
            `${passedCount} / ${testCases.length} bestanden`
          )
        ),
        React.createElement("div", { className: "w-full bg-gray-200 rounded-full h-2.5" },
          React.createElement("div", { 
            className: "bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out", 
            style: { width: `${progress}%` } 
          })
        )
      ),

      React.createElement("div", { className: "space-y-4" },
        testCases.map((testCase, index) => {
          const result = results[index];
          const isCurrent = index === currentIndex && isRunning;
          const isPending = !result && !isCurrent;
          
          let statusStyles = 'border-gray-200';
          if (result) {
            statusStyles = result.passed ? 'border-green-400' : 'border-red-400';
          } else if (isCurrent) {
            statusStyles = 'border-blue-500 ring-2 ring-blue-300 animate-pulse';
          }

          return React.createElement("div", { 
              key: index, 
              className: `bg-white p-5 rounded-lg shadow-sm border-l-4 transition-all duration-300 ${statusStyles} ${isPending ? 'opacity-50' : ''}` 
            },
            React.createElement("h3", { className: "text-md font-bold text-gray-800 mb-4" }, testCase.description),
            
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 text-sm" },
              // Input Parameters Column
              React.createElement("div", { className: 'md:col-span-1' },
                React.createElement("h4", { className: "font-semibold text-gray-600 mb-2 border-b pb-1" }, "Eingabeparameter"),
                React.createElement("ul", { className: "space-y-1 text-gray-500" },
                  Object.entries(testCase.inputs).map(([id, value]) => {
                    const criterionName = INITIAL_CRITERIA.find(c => c.id === parseInt(id))?.name || 'Unbekannt';
                    return React.createElement("li", { key: id, className: "flex justify-between" },
                      React.createElement("span", { className: "truncate mr-2" }, `${criterionName}:`),
                      React.createElement("span", { className: "font-mono font-semibold" }, String(value))
                    );
                  })
                )
              ),
              // Expected Results Column
              React.createElement("div", { className: 'md:col-span-1' },
                React.createElement("h4", { className: "font-semibold text-gray-600 mb-2 border-b pb-1" }, "Erwartetes Ergebnis"),
                React.createElement("div", { className: "space-y-2" },
                  React.createElement("div", { className: "flex justify-between items-center" },
                    React.createElement("span", { className: "text-gray-500" }, "Punktzahl:"),
                    React.createElement("span", { className: "font-mono font-semibold text-gray-800" }, testCase.expectedScore)
                  ),
                  React.createElement("div", { className: "flex justify-between items-center" },
                    React.createElement("span", { className: "text-gray-500" }, "Komplexität:"),
                    React.createElement("span", { className: "font-semibold text-gray-800" }, testCase.expectedComplexity)
                  )
                )
              ),
              // Actual Results Column
              React.createElement("div", { className: 'md:col-span-1' },
                React.createElement("h4", { className: "font-semibold text-gray-600 mb-2 border-b pb-1" }, "Tatsächliches Ergebnis"),
                !result ? React.createElement("div", { className: "text-gray-400 italic pt-2" }, isCurrent ? 'Wird berechnet...' : 'Ausstehend...') :
                React.createElement("div", null,
                    React.createElement("div", { className: "space-y-2 mt-2" },
                        React.createElement("div", { className: "flex justify-between items-center" },
                            React.createElement("span", { className: "text-gray-500" }, "Punktzahl:"),
                            React.createElement("span", { className: "font-mono font-semibold text-gray-800" }, result.actualScore)
                        ),
                        React.createElement("div", { className: "flex justify-between items-center" },
                            React.createElement("span", { className: "text-gray-500" }, "Komplexität:"),
                            React.createElement("span", { className: "font-semibold text-gray-800" }, result.actualComplexity)
                        )
                    ),
                    React.createElement("div", { className: `mt-3 text-center font-bold text-lg p-2 rounded-md ${result.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}` },
                        result.passed ? 'PASS' : 'FAIL'
                    )
                )
              )
            )
          );
        })
      )
    )
  );
}

export default TestPage;
