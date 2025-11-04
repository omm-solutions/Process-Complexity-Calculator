// This file defines the test cases for the Process Complexity Calculator.
// It is used by the TestPage component to automatically verify and display the results of the calculation logic.

export const testCases = [
  {
    description: 'Testfall 1: Geringe Komplexität',
    inputs: {
      1: 'Regelbasiert',          // Definition: 0
      2: 1,                       // Anzahl Anwendungen: 1
      3: 15,                      // Datenfelder: 1
      4: 8,                       // Bildschirme: 1
      5: 2,                       // Variationen: 2
      7: 'Nein',                    // Bildbasierte Automatisierung: 0
      8: 1,                       // Eingabeformate: 1
      9: 'Nein',                    // Document Understanding: 0
    },
    expectedScore: 6,
    expectedComplexity: 'Niedrig',
  },
  {
    description: 'Testfall 2: Mittlere Komplexität',
    inputs: {
      1: 'Regelbasiert',          // 0
      2: 3,                       // 5
      3: 15,                      // 1
      4: 8,                       // 1
      5: 2,                       // 2
      7: 'Nein',                    // 0
      8: 1,                       // 1
      9: 'Nein',                    // 0
    },
    expectedScore: 10,
    expectedComplexity: 'Mittel',
  },
  {
    description: 'Testfall 3: Hohe Komplexität durch hohe Punktzahl',
    inputs: {
      1: 'Human-in-the-Loop',     // 5
      2: 6,                       // 9
      3: 50,                      // 3
      4: 40,                      // 3
      5: 7,                       // 7
      7: 'Nein',                    // 0
      8: 5,                       // 5
      9: 'Ja',                      // 9
    },
    expectedScore: 41,
    expectedComplexity: 'Hoch',
  },
  {
    description: 'Testfall 4: Hohe Komplexität durch bildbasierte Automatisierung (Sonderfall)',
    inputs: {
      1: 'Regelbasiert',          // 0
      2: 1,                       // 1
      3: 1,                       // 1
      4: 1,                       // 1
      5: 1,                       // 1
      7: 'Ja',                      // 9 -> This forces "Hoch" regardless of score.
      8: 1,                       // 1
      9: 'Nein',                    // 0
    },
    expectedScore: 14,
    expectedComplexity: 'Hoch',
  },
  {
    description: 'Zufälliger Testfall 5: Ausgewogene Mitte',
    inputs: {
      1: 'Regelbasiert',          // 0
      2: 4,                       // 5
      3: 25,                      // 2
      4: 12,                      // 2
      5: 3,                       // 3
      7: 'Nein',                    // 0
      8: 2,                       // 2
      9: 'Nein',                    // 0
    },
    expectedScore: 14,
    expectedComplexity: 'Mittel',
  },
  {
    description: 'Zufälliger Testfall 6: KI-lastiger Prozess',
    inputs: {
      1: 'Human-in-the-Loop',     // 5
      2: 8,                       // 9
      3: 70,                      // 5
      4: 60,                      // 5
      5: 1,                       // 1
      7: 'Nein',                    // 0
      8: 6,                       // 6
      9: 'Ja',                      // 9
    },
    expectedScore: 40,
    expectedComplexity: 'Hoch',
  },
    {
    description: 'Zufälliger Testfall 7: Sehr einfacher Prozess',
    inputs: {
      1: 'Regelbasiert',          // 0
      2: 1,                       // 1
      3: 5,                       // 1
      4: 2,                       // 1
      5: 0,                       // 0
      7: 'Nein',                    // 0
      8: 1,                       // 1
      9: 'Nein',                    // 0
    },
    expectedScore: 4,
    expectedComplexity: 'Niedrig',
  },
  {
    description: 'Zufälliger Testfall 8: Hohe Variation',
    inputs: {
      1: 'Human-in-the-Loop',     // 5
      2: 2,                       // 5
      3: 30,                      // 2
      4: 20,                      // 2
      5: 8,                       // 8
      7: 'Nein',                    // 0
      8: 3,                       // 3
      9: 'Nein',                    // 0
    },
    expectedScore: 25,
    expectedComplexity: 'Hoch',
  },
];