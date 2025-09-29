import React, { useState, useMemo } from 'react';
import { INITIAL_CRITERIA, POINTS_CONFIG, RATING_STYLES, COMPLEXITY_THRESHOLDS } from './constants';
import type { Criterion } from './types';

function App() {
  const [criteria, setCriteria] = useState<Criterion[]>(() => 
    INITIAL_CRITERIA.map(c => ({...c}))
  );

  const handleCriteriaChange = (id: number, value: string | number) => {
    setCriteria((prevCriteria) =>
      prevCriteria.map((criterion) =>
        criterion.id === id ? { ...criterion, value } : criterion
      )
    );
  };

  const totalScore = useMemo(() => {
    return criteria.reduce((acc, criterion) => {
      // Special scoring for 'Anzahl Variationen' (id: 5)
      if (criterion.id === 5) {
        return acc + Number(criterion.value);
      }
      const rating = criterion.getRating(criterion.value);
      return acc + (POINTS_CONFIG[rating] || 0);
    }, 0);
  }, [criteria]);

  const complexity = useMemo(() => {
    // The thresholds are sorted from high to low, so the first match is correct.
    return COMPLEXITY_THRESHOLDS.find(t => totalScore >= t.minScore)!;
  }, [totalScore]);

  // Special handling for the 'Definition' criterion to render as cards
  const definitionCriterion = criteria.find(c => c.id === 1)!;
  const otherCriteria = criteria.filter(c => c.id !== 1);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
            {/* Logo and Slogan */}
            <div className="flex items-center space-x-3 flex-shrink-0">
                <svg className="h-12 w-12 text-gray-800" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="6"/>
                    <text x="50" y="62" fontFamily="sans-serif" fontSize="36" fontWeight="bold" textAnchor="middle" fill="currentColor">OMM</text>
                </svg>
                 <div>
                    <h1 className="text-xl font-bold text-gray-800">OMM Solutions GmbH</h1>
                    <p className="text-sm text-gray-500">Ihr Partner für Automatisierung</p>
                </div>
            </div>
            {/* App Title */}
            <div className="text-center sm:text-right">
                <h2 className="text-3xl font-bold text-gray-800">RPA Komplexitätsrechner</h2>
            </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Definition Criterion as Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{definitionCriterion.name}</h2>
                <p className="text-sm text-gray-500 mb-4">{definitionCriterion.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {definitionCriterion.options?.map(option => {
                        const isSelected = definitionCriterion.value === option.value;
                        return (
                            <button
                                key={option.value}
                                onClick={() => handleCriteriaChange(definitionCriterion.id, option.value)}
                                className={`p-4 border rounded-lg text-left transition-all duration-200 ${isSelected ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400' : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md'}`}
                            >
                                <h3 className="font-bold text-md">{option.label}</h3>
                                <p className={`text-sm mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>{option.detailedDescription}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Other Criteria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherCriteria.map((criterion) => {
              const rating = criterion.getRating(criterion.value);
              const ratingStyle = RATING_STYLES[rating];
              
              return (
                <div key={criterion.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-semibold text-gray-900 w-3/4">{criterion.name}</h2>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ratingStyle.bg} ${ratingStyle.text}`}>
                        {rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 mb-4">{criterion.description}</p>
                  </div>
                  
                  <div className="mt-auto">
                    {criterion.inputType === 'number' ? (
                      <input
                        type="number"
                        min="0"
                        id={`criterion-${criterion.id}`}
                        value={criterion.value}
                        onChange={(e) => handleCriteriaChange(criterion.id, e.target.value === '' ? 0 : Number(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label={criterion.name}
                      />
                    ) : (
                      <select
                        id={`criterion-${criterion.id}`}
                        value={String(criterion.value)}
                        onChange={(e) => handleCriteriaChange(criterion.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        aria-label={criterion.name}
                      >
                        {criterion.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className={`sticky top-8 p-6 rounded-xl shadow-lg border transition-all duration-300 ${complexity.bgColor.replace('100', '200')} border-${complexity.color.split('-')[1]}-300`}>
              <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-300 pb-3 mb-4">Ergebnis</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Gesamtpunktzahl:</span>
                  <span className="text-3xl font-bold text-gray-900">{totalScore}</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-white/50">
                  <span className="text-gray-700 font-medium mb-1">Prozess-Komplexität</span>
                   <span className={`text-2xl font-bold px-4 py-2 rounded-full ${complexity.bgColor} ${complexity.color}`}>
                    {complexity.level}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default App;