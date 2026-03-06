export enum SlideTemplate {
  HOOK = 'HOOK',
  PILLAR = 'PILLAR',
  CONCLUSION = 'CONCLUSION',
}

export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  content: string[]; // For bullet points or body text
  highlight?: string; // Text to be colored red
  highlightLabel?: string; // "METRIC", "INSIGHT", "WARNING", etc.
  icon?: string; // "activity", "chart", "alert", "check", "zap", "target"
  footerLeft?: string;
  footerRight?: string;
  category?: string; // Badge text (e.g. "RAPPORT TECHNIQUE", "STAGES")
  template: SlideTemplate;
}

export const SAMPLE_INPUT = `SLIDE 1: UNLOCK YOUR TRUE POTENTIAL
The science of endurance is changing.
- Data-driven training
- Metabolic efficiency
- Mental resilience
Are you ready to evolve?

SLIDE 2: THE 3 PILLARS OF PERFORMANCE
Consistency is the key to longevity.
- Aerobic Base: Build the engine first.
- Strength: Durability prevents injury.
- Recovery: Where the adaptation happens.
Metric: +15% Efficiency

SLIDE 3: YOUR LEGACY STARTS NOW
Don't wait for the perfect moment.
Join the BPC Elite program today.
#BuildYourLegacy`;

export const SAMPLE_JSON = `[
  {
    "id": 1,
    "title": "TITRE DE LA SLIDE",
    "template": "HOOK",
    "category": "STAGES",
    "content": [
      "Sous-titre impactant ici",
      "Premier point clé",
      "Deuxième point clé"
    ],
    "highlight": "TEXTE EN ROUGE",
    "highlightLabel": "INSIGHT",
    "footerLeft": "bpctriathlon.fr",
    "footerRight": "#BuildYourLegacy"
  },
  {
    "id": 2,
    "title": "ANALYSE DONNÉES",
    "template": "PILLAR",
    "category": "SCIENCE & MÉTHODOLOGIE",
    "icon": "activity",
    "content": [
      "Donnée 1: Analyse",
      "Donnée 2: Résultat",
      "Donnée 3: Action",
      "Donnée 4: Conclusion"
    ],
    "highlight": "+20% WATTS",
    "highlightLabel": "METRIC"
  },
  {
    "id": 3,
    "title": "SURVEILLANCE GLYCÉMIE",
    "template": "PILLAR",
    "category": "OUTILS & TECHNOLOGIE",
    "icon": "alert",
    "content": [
       "Le capteur ne remplace pas le ressenti.",
       "Utilise les tendances, pas les valeurs absolues.",
       "Teste ton plan nutritionnel à l'entraînement."
    ],
    "highlight": "CGM = photo locale, pas vérité absolue.",
    "highlightLabel": "A RETENIR"
  },
  {
    "id": 4,
    "title": "PASSEZ À L'ACTION",
    "template": "CONCLUSION",
    "category": "BÉNÉFICES CLIENTS",
    "icon": "target",
    "content": [
      "Ne laissez pas le hasard dicter votre course.",
      "Rejoignez le programme Elite."
    ],
    "highlight": "START NOW"
  }
]`;