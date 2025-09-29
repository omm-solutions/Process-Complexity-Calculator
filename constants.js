// constants.js

export const POINTS_CONFIG = {
  'Niedrig': 1,
  'Mittel': 2,
  'Hoch': 3,
  'Sehr Hoch': 5,
};

export const RATING_STYLES = {
    'Niedrig': { text: 'text-green-700', bg: 'bg-green-100' },
    'Mittel': { text: 'text-yellow-700', bg: 'bg-yellow-100' },
    'Hoch': { text: 'text-red-700', bg: 'bg-red-100' },
    'Sehr Hoch': { text: 'text-purple-700', bg: 'bg-purple-100' },
};

export const COMPLEXITY_THRESHOLDS = [
  { level: 'Hoch', minScore: 16, color: 'text-red-700', bgColor: 'bg-red-100' },
  { level: 'Mittel', minScore: 10, color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  { level: 'Niedrig', minScore: 0, color: 'text-green-700', bgColor: 'bg-green-100' },
];


export const INITIAL_CRITERIA = [
  {
    id: 1,
    name: 'Definition',
    description: 'Regelbasiert vs. HITL',
    inputType: 'select',
    value: 'Niedrig',
    options: [
        { 
            value: 'Niedrig', 
            label: 'Regelbasiert', 
            detailedDescription: 'Der Prozess verwendet einfache, regelbasierte, streng definierte Automatisierungen, die Dateneingaben sind strukturiert. Der Prozess hat keine manuellen nicht-digitalen Eingaben (wie gescannte Bilder, unstrukturierte, handschriftliche Dokumente usw.), bei denen eine menschliche Entscheidung erforderlich ist.' 
        },
        { 
            value: 'Mittel', 
            label: 'Beaufsichtigt / Binär',
            detailedDescription: 'Der Prozess hat maximal einfache binäre Entscheidungsschritte (Ja/Nein usw.). Der Prozess erfordert möglicherweise eine beaufsichtigte Version der Automatisierung.'
        },
        { 
            value: 'Hoch', 
            label: 'Human-in-the-Loop',
            detailedDescription: 'Prozesse haben Übergaben zwischen Teilprozessen, und die Verknüpfungen müssen genau verwaltet werden. Prozesse mit HITL (Human-in-the-loop) Anforderungen. Unstrukturierte Eingaben.'
        },
    ],
    getRating: (value) => value,
  },
  {
    id: 2,
    name: 'Anzahl Anwendungen',
    description: 'Anzahl der verschiedenen Applikationen, mit denen während des Prozesses interagiert wird (z.B. SAP, Excel, Webbrowser).',
    inputType: 'number',
    value: 0,
    getRating: (value) => {
      const num = Number(value);
      if (num < 4) return 'Niedrig';
      if (num < 6) return 'Mittel';
      return 'Hoch';
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
      if (num < 20) return 'Niedrig';
      if (num < 40) return 'Mittel';
      if (num < 60) return 'Hoch';
      return 'Sehr Hoch';
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
      if (num <= 10) return 'Niedrig';
      if (num <= 30) return 'Mittel';
      if (num <= 50) return 'Hoch';
      return 'Sehr Hoch';
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
      if (num < 3) return 'Niedrig';
      if (num < 6) return 'Mittel';
      return 'Hoch';
    },
  },
  {
    id: 6,
    name: 'Strenges Prozess-SLA',
    description: 'Gibt es eine strenge Service-Level-Vereinbarung?',
    inputType: 'select',
    value: 'Nein',
     options: [
        { value: 'Nein', label: 'Nein' },
        { value: 'Ja', label: 'Ja' },
    ],
    getRating: (value) => (value === 'Ja' ? 'Hoch' : 'Niedrig'),
  },
  {
    id: 7,
    name: 'Bildbasierte Automatisierung',
    description: 'Erfordert der Prozess eine bildbasierte Automatisierung (z.B. VDI/Citrix)?',
    inputType: 'select',
    value: 'Nein',
    options: [
        { value: 'Nein', label: 'Nein' },
        { value: 'Ja', label: 'Ja' },
    ],
    getRating: (value) => (value === 'Ja' ? 'Hoch' : 'Niedrig'),
  },
  {
    id: 8,
    name: 'Anzahl Eingabeformate',
    description: '2-3 / 4-5 / 6+',
    inputType: 'number',
    value: 0,
    getRating: (value) => {
      const num = Number(value);
      if (num < 4) return 'Niedrig';
      if (num < 6) return 'Mittel';
      return 'Hoch';
    },
  },
  {
    id: 9,
    name: 'Document Understanding/AI',
    description: 'Wird eine KI-basierte Dokumentenverarbeitung benötigt?',
    inputType: 'select',
    value: 'Nein',
    options: [
        { value: 'Nein', label: 'Nein' },
        { value: 'Ja', label: 'Ja' },
    ],
    getRating: (value) => (value === 'Ja' ? 'Hoch' : 'Niedrig'),
  },
];