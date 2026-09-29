// Joueurs de la partie (en attendant les comptes en ligne)
export const PLAYER = { name: 'Salim', title: 'Assistant (to the) Collector' }
// Tayeb n'a pas encore de compte : on ne connaît pas encore ses cartes
export const RIVAL = 'Tayeb'

export const format = (n: number) => Math.floor(n).toLocaleString('fr-FR')

export const cardsLabel = (n: number) => `${n} ${n > 1 ? 'cartes' : 'carte'}`
