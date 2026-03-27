# 🃏 Poker Range Analyzer & Equity Calculator

**Poker Range Analyzer** est une application web interactive et avancée, conçue pour les joueurs de poker qui souhaitent analyser finement des ranges, calculer l'équité de leurs mains et décortiquer la texture des boards. 

Que ce soit pour revoir une session, étudier des spots spécifiques ou comprendre l'interaction entre deux ranges de poker, cet outil offre une interface fluide et des calculs rapides basés sur des simulations de Monte Carlo.

---

## 🎯 Fonctionnalités Principales

### 1. Construction et Analyse de Ranges (Hero vs Villain)
- **Matrice interactive :** Sélectionnez vos mains de départ facilement via la grille classique (78s, AKo, etc.).
- **Outils rapides :** Raccourcis pour sélectionner les premiums, broadways, connecteurs assortis, ou paires servies.
- **Gestion des fréquences :** Utilisez un slider dynamique pour inclure ou exclure un certain pourcentage de mains depuis le top de la range.
- **Import / Export :** Copiez-collez vos ranges depuis ou vers d'autres logiciels (format standard GTO/Equilab).
- **Ranges personnalisées :** Sauvegardez vos propres ranges par position dans un éditeur intégré pour les réutiliser rapidement.

### 2. Mode "Main Exacte" et Effet Bloqueur 🔒
En plus de jouer "Range contre Range", vous pouvez basculer un joueur en mode "Main" (2 cartes spécifiques sélectionnées).
- **Auto-Blockers :** Lorsqu'une main exacte est sélectionnée, activez la fonction bloqueur : l'application retirera automatiquement les combos impossibles de la range adverse.

### 3. Calculs d'Équité (Monte Carlo) ⚡
- Évaluation de vos chances de gagner (Equity) en temps réel entre Hero et Villain.
- **Évolution de l'équité :** Un graphique interactif permet de simuler comment l'équité évolue d'une street à l'autre (Flop ➔ Turn ➔ River).

### 4. Analyse du Board et des "Dead Cards" 🃏
- **Sélecteur de board intuitif :** Définissez le flop, la turn et la river (jusqu'à 5 cartes). L'outil analyse techniquement la "texture" du board (ex: *Board dry*, *Drawy*, *Monotone*).
- **Cartes mortes (Dead Cards) :** Indiquez les cartes brûlées ou foldées par d'autres joueurs pour affiner mathématiquement les calculs de probabilités.

### 5. Statistiques Détaillées et Graphiques (Hits & Draws) 📊📈
C'est le cœur de l'outil pour comprendre comment une range "frappe" un board :
- **Pré-flop :** Affichez les probabilités qu'une range a de toucher différents types de mains au flop (Brelan, Tirages couleur, Top Paire, etc.), en déduisant ce qui ne touche rien.
- **Post-flop :** Voyez précisément comment la range réagit face aux cartes du board.
- **Tri intelligent :** Visualisez ces statistiques soit sous forme de tableau détaillé (filtré pour ne montrer que ce qui a un impact), soit sous forme de graphique interactif (Chart.js), triable par ordre naturel des mains ou par pourcentage de combos.

### 6. Mode "Hotness" 🔥
- Découvrez en un clic l'effet de retrait (removal effect) : visualisez quelles cartes dans votre main ou sur le board avantagent ou désavantagent le plus la range de votre adversaire.

---

## 🛠️ Stack Technique
Cette application est conçue pour être exécutée directement dans le navigateur, sans backend complexe :
- **HTML5 / CSS3** (Interface moderne avec un design "Glassmorphism" et gestion de thème Dark & Light).
- **Vanilla JavaScript** pour la logique métier, la gestion du DOM et les calculs.
- **Web Workers** utilisés pour déporter les calculs intensifs de simulation Monte Carlo (évitant ainsi tout gel de l'interface utilisateur).
- **Chart.js** pour des rendus de graphiques fluides et esthétiques.

---

## 🚀 Comment utiliser le projet en local ?

1. Clonez ce dépôt sur votre machine :
   ```bash
   git clone https://github.com/votre-nom-utilisateur/Poker-equity-calculator.git
   ```
2. Ouvrez le dossier du projet.
3. Lancez le fichier `index.html` dans votre navigateur web préféré. Aucune installation serveur (Node, npm) n'est requise.
4. *Astuce :* Si vous souhaitez modifier le code, vous pouvez utiliser une extension comme "Live Server" sur VS Code pour voir vos changements CSS/JS en temps réel.

---

## 🤝 Contribution
Vos suggestions sont les bienvenues ! N'hésitez pas à ouvrir une *Issue* ou à soumettre une *Pull Request* pour ajouter de nouvelles fonctionnalités, corriger un bug ou intégrer de nouveaux algorithmes de calcul.
