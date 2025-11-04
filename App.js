import React, { useState, useMemo } from 'react';

const POINTS_CONFIG = {
  'Keine': 0,
  'Niedrig': 1,
  'Mittel': 2,
  'Hoch': 3,
  'Sehr Hoch': 5,
};

const RATING_STYLES = {
    'Keine': { text: 'text-gray-500', bg: 'bg-gray-200' },
    'Niedrig': { text: 'text-green-700', bg: 'bg-green-100' },
    'Mittel': { text: 'text-yellow-700', bg: 'bg-yellow-100' },
    'Hoch': { text: 'text-red-700', bg: 'bg-red-100' },
    'Sehr Hoch': { text: 'text-purple-700', bg: 'bg-purple-100' },
};

const COMPLEXITY_THRESHOLDS = [
  { level: 'Hoch', minScore: 16, color: 'text-red-700', bgColor: 'bg-red-100' },
  { level: 'Mittel', minScore: 10, color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  { level: 'Niedrig', minScore: 0, color: 'text-green-700', bgColor: 'bg-green-100' },
];


const INITIAL_CRITERIA = [
  {
    id: 1,
    name: 'Definition',
    description: 'Regelbasiert oder Human in the Loop',
    inputType: 'select',
    value: '',
    options: [
        { 
            value: 'Regelbasiert', 
            label: 'Regelbasiert', 
            detailedDescription: 'Der Prozess verwendet einfache, streng definierte Automatisierungen und die Dateneingaben sind strukturiert.' 
        },
        { 
            value: 'Human-in-the-Loop', 
            label: 'Human-in-the-Loop',
            detailedDescription: 'Prozesse haben Übergaben, HITL-Anforderungen oder unstrukturierte Eingaben, die menschliche Entscheidungen erfordern.'
        },
    ],
    getRating: (value) => {
        if (value === 'Regelbasiert') return 'Niedrig';
        if (value === 'Human-in-the-Loop') return 'Hoch';
        return 'Keine';
    },
    getPoints: (value) => (value === 'Human-in-the-Loop' ? 5 : 0),
  },
  {
    id: 2,
    name: 'Anzahl Anwendungen',
    description: 'Anzahl der verschiedenen Applikationen, mit denen während des Prozesses interagiert wird (z.B. SAP, Excel, Webbrowser).',
    inputType: 'number',
    value: 0,
    getRating: (value) => {
      const num = Number(value);
      if (num === 0) return 'Keine';
      if (num < 2) return 'Niedrig';
      if (num < 5) return 'Mittel';
      return 'Hoch';
    },
    getPoints: (value) => {
        const num = Number(value);
        if (num >= 5) return 9;
        if (num >= 2) return 5;
        if (num > 0) return 1;
        return 0;
    },
  },
  {
    id: 3,
    name: 'Datenfelder zu extrahieren',
    description: 'Anzahl der Datenpunkte, die pro Transaktion extrahiert werden müssen.',
    inputType: 'number',
    value: 0,
    getRating: (value) => {
      const num = Number(value);
      if (num === 0) return 'Keine';
      if (num < 20) return 'Niedrig';
      if (num < 40) return 'Mittel';
      if (num < 60) return 'Hoch';
      return 'Sehr Hoch';
    },
    getPoints: function(value) {
        const rating = this.getRating(value);
        return POINTS_CONFIG[rating] || 0;
    },
  },
  {
    id: 4,
    name: 'Anzahl Bildschirme',
    description: 'Anzahl der einzigartigen Bildschirme, mit denen interagiert wird.',
    inputType: 'number',
    value: 0,
    getRating: (value) => {
      const num = Number(value);
      if (num === 0) return 'Keine';
      if (num <= 10) return 'Niedrig';
      if (num <= 30) return 'Mittel';
      if (num <= 50) return 'Hoch';
      return 'Sehr Hoch';
    },
    getPoints: function(value) {
        const rating = this.getRating(value);
        return POINTS_CONFIG[rating] || 0;
    },
  },
  {
    id: 5,
    name: 'Anzahl Variationen',
    description: 'Anzahl der unterschiedlichen Pfade oder Zweige, die der Prozess basierend auf Geschäftsregeln nehmen kann.',
    inputType: 'number',
    value: 0,
    getRating: (value) => {
      const num = Number(value);
      if (num === 0) return 'Keine';
      if (num < 3) return 'Niedrig';
      if (num < 6) return 'Mittel';
      return 'Hoch';
    },
    getPoints: (value) => Number(value),
  },
  {
    id: 7,
    name: 'Bildbasierte Automatisierung',
    description: 'Erfordert der Prozess eine bildbasierte Automatisierung (z.B. VDI/Citrix)?',
    inputType: 'select',
    value: '',
    options: [
        { value: '', label: 'Bitte wählen...' },
        { value: 'Nein', label: 'Nein' },
        { value: 'Ja', label: 'Ja' },
    ],
    getRating: (value) => {
        if (value === 'Ja') return 'Hoch';
        if (value === 'Nein') return 'Niedrig';
        return 'Keine';
    },
    getPoints: (value) => (value === 'Ja' ? 9 : 0),
  },
  {
    id: 8,
    name: 'Anzahl Eingabeformate',
    description: 'Geben Sie die Anzahl der verschiedenen Formate an, in denen die Eingabedaten vorliegen (z.B. PDF, E-Mail, Excel, CSV).',
    inputType: 'number',
    value: 0,
    getRating: (value) => {
      const num = Number(value);
      if (num === 0) return 'Keine';
      if (num < 4) return 'Niedrig';
      if (num < 6) return 'Mittel';
      return 'Hoch';
    },
    getPoints: (value) => Number(value),
  },
  {
    id: 9,
    name: 'Document Understanding/AI',
    description: 'Wird eine KI-basierte Dokumentenverarbeitung benötigt?',
    inputType: 'select',
    value: '',
    options: [
        { value: '', label: 'Bitte wählen...' },
        { value: 'Nein', label: 'Nein' },
        { value: 'Ja', label: 'Ja' },
    ],
    getRating: (value) => {
        if (value === 'Ja') return 'Hoch';
        if (value === 'Nein') return 'Niedrig';
        return 'Keine';
    },
    getPoints: (value) => (value === 'Ja' ? 9 : 0),
  },
];

const helpData = [
  {
    name: 'Definition',
    description: 'Regelbasiert: 0 Pkt<br/>Human-in-the-Loop: 5 Pkt',
  },
  {
    name: 'Anzahl Anwendungen',
    description: '&lt; 2: Niedrig (1 Pkt)<br/>2-4: Mittel (5 Pkt)<br/>≥ 5: Hoch (9 Pkt)',
  },
  {
    name: 'Datenfelder zu extrahieren',
    description: '&lt; 20: Niedrig (1 Pkt)<br/>20-39: Mittel (2 Pkt)<br/>40-59: Hoch (3 Pkt)<br/>≥ 60: Sehr Hoch (5 Pkt)',
  },
  {
    name: 'Anzahl Bildschirme',
    description: '≤ 10: Niedrig (1 Pkt)<br/>11-30: Mittel (2 Pkt)<br/>31-50: Hoch (3 Pkt)<br/>≥ 51: Sehr Hoch (5 Pkt)',
  },
  {
    name: 'Anzahl Variationen',
    description: 'Die eingegebene Anzahl an Variationen wird direkt zu den Gesamtpunkten addiert.',
  },
  {
    name: 'Bildbasierte Automatisierung',
    description: 'Nein: Niedrig (0 Pkt)<br/>Ja: Hoch (9 Pkt)',
  },
  {
    name: 'Anzahl Eingabeformate',
    description: 'Die eingegebene Anzahl an Eingabeformaten wird direkt zu den Gesamtpunkten addiert.',
  },
  {
    name: 'Document Understanding/AI',
    description: 'Nein: 0 Punkte<br/>"Ja" addiert 9 Punkte direkt zu den Gesamtpunkten.',
  }
];

function HelpModal({ onClose }) {
  return React.createElement("div", {
    className: "fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300",
    onClick: onClose,
    "aria-modal": true,
    role: "dialog"
  },
    React.createElement("div", {
      className: "bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up",
      onClick: (e) => e.stopPropagation(),
      style: { animation: 'fade-in-up 0.3s ease-out' }
    },
      React.createElement("div", { className: "flex justify-between items-center p-5 border-b border-gray-200" },
        React.createElement("h3", { className: "text-xl font-bold text-gray-800" }, "Details zur Berechnung"),
        React.createElement("button", {
            onClick: onClose,
            className: "text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100",
            "aria-label": "Schließen"
        },
          React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" })
          )
        )
      ),
      React.createElement("div", { className: "p-6 overflow-y-auto" },
        React.createElement("table", { className: "w-full border-collapse" },
          React.createElement("thead", null,
            React.createElement("tr", { className: "bg-slate-100" },
              React.createElement("th", { className: "p-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200" }, "Kriterium"),
              React.createElement("th", { className: "p-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-200" }, "Bewertung & Punkte")
            )
          ),
          React.createElement("tbody", null,
            helpData.map((item, index) => 
              React.createElement("tr", { key: item.name, className: "border-b border-gray-200 hover:bg-slate-50" },
                React.createElement("td", { className: "p-3 text-sm text-gray-800 font-medium" }, item.name),
                React.createElement("td", { className: "p-3 text-sm text-gray-600", dangerouslySetInnerHTML: { __html: item.description } })
              )
            )
          )
        ),
        React.createElement("h4", { className: "text-lg font-bold text-gray-800 mt-6 mb-3" }, "Komplexitätsstufen"),
        React.createElement("p", { className: "text-sm text-gray-600 mb-4" }, "Die Gesamtpunktzahl bestimmt die Komplexität des Prozesses:"),
        React.createElement("div", { className: "space-y-2" },
            React.createElement("div", { className: "flex items-center" },
                React.createElement("div", { className: "w-20 font-semibold text-green-700" }, "Niedrig:"),
                React.createElement("span", { className: "text-sm text-gray-700" }, "0 - 9 Punkte")
            ),
            React.createElement("div", { className: "flex items-center" },
                React.createElement("div", { className: "w-20 font-semibold text-yellow-700" }, "Mittel:"),
                React.createElement("span", { className: "text-sm text-gray-700" }, "10 - 15 Punkte")
            ),
            React.createElement("div", { className: "flex items-center" },
                React.createElement("div", { className: "w-20 font-semibold text-red-700" }, "Hoch:"),
                React.createElement("span", { className: "text-sm text-gray-700" }, "ab 16 Punkte")
            )
        )
      ),
      React.createElement("div", { className: "p-4 border-t border-gray-200 bg-slate-50 text-right rounded-b-xl" },
        React.createElement("button", { 
          onClick: onClose, 
          className: "px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all" 
        }, "Schließen")
      )
    )
  );
}


function App() {
  const [criteria, setCriteria] = useState(() => 
    INITIAL_CRITERIA.map(c => ({...c}))
  );
  const [isHelpVisible, setHelpVisible] = useState(false);

  const handleCriteriaChange = (id, value) => {
    setCriteria((prevCriteria) =>
      prevCriteria.map((criterion) =>
        criterion.id === id ? { ...criterion, value } : criterion
      )
    );
  };

  const totalScore = useMemo(() => {
    return criteria.reduce((acc, criterion) => {
      const pointsToAdd = criterion.getPoints(criterion.value);
      return acc + (pointsToAdd || 0);
    }, 0);
  }, [criteria]);

  const complexity = useMemo(() => {
    const isImageBased = criteria.find(c => c.id === 7)?.value === 'Ja';
    if (isImageBased) {
        return COMPLEXITY_THRESHOLDS.find(t => t.level === 'Hoch');
    }
    // The thresholds are sorted from high to low, so the first match is correct.
    return COMPLEXITY_THRESHOLDS.find(t => totalScore >= t.minScore) || COMPLEXITY_THRESHOLDS[COMPLEXITY_THRESHOLDS.length - 1];
  }, [totalScore, criteria]);

  // Special handling for the 'Definition' criterion to render as cards
  const definitionCriterion = criteria.find(c => c.id === 1);
  const otherCriteria = criteria.filter(c => c.id !== 1);
  
  if (!definitionCriterion) return null; // Should not happen

  return React.createElement("div", { className: "bg-slate-50 min-h-screen font-sans" },
    isHelpVisible && React.createElement(HelpModal, { onClose: () => setHelpVisible(false) }),
    React.createElement("div", { className: "container mx-auto p-4 sm:p-6 lg:p-8" },
      React.createElement("header", { className: "flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200" },
        React.createElement("div", { className: "flex items-center space-x-3 flex-shrink-0" },
          React.createElement("svg", { className: "h-12 w-12 text-gray-800", viewBox: "0 0 100 100", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            React.createElement("circle", { cx: "50", cy: "50", r: "48", stroke: "currentColor", strokeWidth: "6" }),
            React.createElement("text", { x: "50", y: "62", fontFamily: "sans-serif", fontSize: "36", fontWeight: "bold", textAnchor: "middle", fill: "currentColor" }, "OMM")
          ),
          React.createElement("div", null,
            React.createElement("h1", { className: "text-xl font-bold text-gray-800" }, "OMM Solutions GmbH"),
            React.createElement("p", { className: "text-sm text-gray-500" }, "Ihr Partner für Automatisierung")
          )
        ),
        React.createElement("div", { className: "text-center sm:text-right" },
          React.createElement("h2", { className: "text-3xl font-bold text-gray-800" }, "RPA Komplexitätsrechner")
        )
      ),
      React.createElement("main", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" },
        React.createElement("div", { className: "lg:col-span-2 space-y-6" },
          React.createElement("div", { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100" },
            React.createElement("h2", { className: "text-xl font-semibold text-gray-900 mb-1" }, definitionCriterion.name),
            React.createElement("p", { className: "text-sm text-gray-500 mb-4" }, definitionCriterion.description),
            React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
              definitionCriterion.options.map(option => {
                const isSelected = definitionCriterion.value === option.value;
                return React.createElement("button", {
                    key: option.value,
                    onClick: () => handleCriteriaChange(definitionCriterion.id, option.value),
                    className: `p-4 border rounded-lg text-left transition-all duration-200 ${isSelected ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400' : 'bg-gray-50 hover:bg-gray-100 hover:shadow-md'}`
                  },
                  React.createElement("h3", { className: "font-bold text-md" }, option.label),
                  React.createElement("p", { className: `text-sm mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-600'}` }, option.detailedDescription)
                );
              })
            )
          ),
          React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
            otherCriteria.map((criterion) => {
              const rating = criterion.getRating(criterion.value);
              const ratingStyle = RATING_STYLES[rating];
              return React.createElement("div", { key: criterion.id, className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between" },
                React.createElement("div", null,
                  React.createElement("div", { className: "flex justify-between items-start" },
                    React.createElement("h2", { className: "text-lg font-semibold text-gray-900 w-3/4" }, criterion.name),
                    React.createElement("span", { className: `text-xs font-semibold px-2.5 py-1 rounded-full ${ratingStyle.bg} ${ratingStyle.text}` }, rating)
                  ),
                  React.createElement("p", { className: "text-sm text-gray-500 mt-1 mb-4" }, criterion.description)
                ),
                React.createElement("div", { className: "mt-auto" },
                  criterion.inputType === 'number' ?
                  React.createElement("input", {
                    type: "number",
                    min: "0",
                    id: `criterion-${criterion.id}`,
                    value: criterion.value,
                    onChange: (e) => handleCriteriaChange(criterion.id, e.target.value === '' ? 0 : Number(e.target.value)),
                    className: "w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    "aria-label": criterion.name
                  }) :
                  React.createElement("select", {
                      id: `criterion-${criterion.id}`,
                      value: String(criterion.value),
                      onChange: (e) => handleCriteriaChange(criterion.id, e.target.value),
                      className: "w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900",
                      "aria-label": criterion.name
                    },
                    criterion.options.map((option) =>
                      React.createElement("option", { key: option.value, value: option.value }, option.label)
                    )
                  )
                )
              );
            })
          )
        ),
        React.createElement("aside", { className: "lg:col-span-1" },
          React.createElement("div", { className: `sticky top-8 p-6 rounded-xl shadow-lg border transition-all duration-300 ${complexity.bgColor.replace('100', '200')} border-${complexity.color.split('-')[1]}-300` },
             React.createElement("div", { className: "flex justify-between items-center border-b border-gray-300 pb-3 mb-4" },
                React.createElement("h2", { className: "text-2xl font-bold text-gray-800" }, "Ergebnis"),
                React.createElement("button", {
                    onClick: () => setHelpVisible(true),
                    className: "text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200",
                    "aria-label": "Hilfe zur Berechnung anzeigen"
                  },
                  React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
                  )
                )
             ),
            React.createElement("div", { className: "space-y-4" },
              React.createElement("div", { className: "flex justify-between items-center" },
                React.createElement("span", { className: "text-gray-700 font-medium" }, "Gesamtpunktzahl:"),
                React.createElement("span", { className: "text-3xl font-bold text-gray-900" }, totalScore)
              ),
              React.createElement("div", { className: "flex flex-col items-center justify-center text-center p-4 rounded-lg bg-white/50" },
                React.createElement("span", { className: "text-gray-700 font-medium mb-1" }, "Prozess-Komplexität"),
                React.createElement("span", { className: `text-2xl font-bold px-4 py-2 rounded-full ${complexity.bgColor} ${complexity.color}` }, complexity.level)
              )
            )
          )
        )
      )
    )
  );
}

export default App;