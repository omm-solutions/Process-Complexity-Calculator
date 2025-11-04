
export const POINTS_CONFIG = {
  'Keine': 0,
  'Niedrig': 1,
  'Mittel': 2,
  'Hoch': 3,
  'Sehr Hoch': 5,
};

export const RATING_STYLES = {
    'Keine': { text: 'text-gray-500', bg: 'bg-gray-200' },
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
    getPoints: (value) => {
        const num = Number(value);
        if (num >= 60) return POINTS_CONFIG['Sehr Hoch'];
        if (num >= 40) return POINTS_CONFIG['Hoch'];
        if (num >= 20) return POINTS_CONFIG['Mittel'];
        if (num > 0) return POINTS_CONFIG['Niedrig'];
        return POINTS_CONFIG['Keine'] || 0;
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
    getPoints: (value) => {
        const num = Number(value);
        if (num > 50) return POINTS_CONFIG['Sehr Hoch'];
        if (num > 30) return POINTS_CONFIG['Hoch'];
        if (num > 10) return POINTS_CONFIG['Mittel'];
        if (num > 0) return POINTS_CONFIG['Niedrig'];
        return POINTS_CONFIG['Keine'] || 0;
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

export function calculateTotalScore(criteria) {
  return criteria.reduce((acc, criterion) => {
    const pointsToAdd = criterion.getPoints(criterion.value);
    return acc + (pointsToAdd || 0);
  }, 0);
}

export function getComplexity(totalScore, criteria) {
  const isImageBased = criteria.find(c => c.id === 7)?.value === 'Ja';
  if (isImageBased) {
      return COMPLEXITY_THRESHOLDS.find(t => t.level === 'Hoch');
  }
  return COMPLEXITY_THRESHOLDS.find(t => totalScore >= t.minScore) || COMPLEXITY_THRESHOLDS[COMPLEXITY_THRESHOLDS.length - 1];
}
