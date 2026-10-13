import { ExerciseTutorial } from '../types/workout';

export const INITIAL_TUTORIALS: ExerciseTutorial[] = [
  {
    id: 'tut-supino-reto',
    name: 'Supino Reto',
    muscleGroup: 'Peitoral',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    videoType: 'youtube',
    executionNotes: 'Mantenha os pés firmes no chão, escápulas retraídas e deprimidas ("travadas no banco"). Desça a barra ou halteres controladamente até a linha do peito médio, mantendo os cotovelos em um ângulo aproximado de 45° a 60° com o tronco. Não deixe os ombros avançarem na subida.',
    commonMistakes: 'Abrir demais os cotovelos a 90° (risco de impacto no ombro), tirar o quadril do banco e quicar o peso no peito.',
    createdAt: '2026-05-01'
  },
  {
    id: 'tut-puxada-pronada',
    name: 'Puxada pronada',
    muscleGroup: 'Costas',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    videoType: 'youtube',
    executionNotes: 'Pegada um pouco mais aberta que a largura dos ombros. Inicie o movimento deprimindo as escápulas antes de flexionar os cotovelos. Puxe a barra em direção à parte superior do peito, mantendo o peito estufado e leve inclinação para trás. Não use impulso excessivo.',
    commonMistakes: 'Puxar a barra atrás da nuca, inclinar o tronco excessivamente para trás usando a lombar, e não estender totalmente os braços no topo.',
    createdAt: '2026-05-01'
  },
  {
    id: 'tut-remada-sentada',
    name: 'Remada sentada triângulo',
    muscleGroup: 'Costas',
    videoUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74',
    videoType: 'youtube',
    executionNotes: 'Mantenha a coluna ereta e joelhos levemente flexionados. Puxe o triângulo contra o abdômen baixo, aproximando bem as escápulas na contração máxima. Segure 1 segundo e retorne controlando o movimento sem curvar a lombar.',
    commonMistakes: 'Balançar o tronco para frente e para trás para gerar impulso, perder a curvatura natural da coluna lombar.',
    createdAt: '2026-05-01'
  },
  {
    id: 'tut-agachamento-bulgaro',
    name: 'Agachamento Búlgaro',
    muscleGroup: 'Quadríceps & Glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    videoType: 'youtube',
    executionNotes: 'Apoie o peito do pé de trás em um banco. O pé da frente deve estar posicionado de modo que, na descida, a tíbia fique quase vertical ou com leve avanço de joelho sem elevar o calcanhar. Desça até a coxa da frente ficar paralela ao chão.',
    commonMistakes: 'Pé da frente muito próximo ao banco, rotação do quadril, deixar o calcanhar descolar do chão.',
    createdAt: '2026-05-01'
  },
  {
    id: 'tut-cadeira-flexora',
    name: 'Cadeira Flexora',
    muscleGroup: 'Posterior de Coxa',
    videoUrl: 'https://www.youtube.com/watch?v=F488V6536-Y',
    videoType: 'youtube',
    executionNotes: 'Ajuste o encosto de modo que o eixo de rotação da máquina coincida perfeitamente com os seus joelhos. Apoie a almofada sobre a panturrilha distal (perto do tendão de Aquiles). Trave a almofada de fixação nas coxas com firmeza. Flexione totalmente os joelhos e retorne devagar.',
    commonMistakes: 'Tirar as costas do encosto, deixar os glúteos subirem do assento durante a força, soltar o peso sem controlar a fase excêntrica.',
    createdAt: '2026-05-01'
  },
  {
    id: 'tut-elevacao-lateral',
    name: 'Elevação lateral',
    muscleGroup: 'Ombros / Deltoide Lateral',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    videoType: 'youtube',
    executionNotes: 'Cotovelos levemente flexionados e tronco com discreta inclinação para a frente (cerca de 10°). Eleve os braços no plano escapular (levemente à frente do corpo) até a altura dos ombros. Conduza o movimento pelos cotovelos, sem encolher os trapézios.',
    commonMistakes: 'Jogar o peso com impulso das pernas e lombar, elevar os halteres acima dos cotovelos (girando o punho para cima).',
    createdAt: '2026-05-01'
  },
  {
    id: 'tut-peck-deck',
    name: 'Peck Deck',
    muscleGroup: 'Peitoral',
    videoUrl: 'https://www.youtube.com/watch?v=O-5e7e_pYgA',
    videoType: 'youtube',
    executionNotes: 'Ajuste a altura do assento para que os braços ou pegadores fiquem na linha média do peito. Mantenha os ombros baixos e as escápulas apoiadas no encosto. Junte os braços focando em espremer o peitoral.',
    commonMistakes: 'Deixar os ombros subirem em direção às orelhas, amplitude excessiva que gera dor na articulação do ombro.',
    createdAt: '2026-05-01'
  },
  {
    id: 'tut-triceps-pulley',
    name: 'Tríceps Pulley',
    muscleGroup: 'Tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
    videoType: 'youtube',
    executionNotes: 'Mantenha os cotovelos colados e imóveis ao lado das costelas. Estenda os braços completamente para baixo até a contração total do tríceps. Retorne controladamente até formar um ângulo de 90° nos cotovelos sem movê-los para frente.',
    commonMistakes: 'Mover os cotovelos para frente e para trás transformando o exercício em pullover, arredondar as costas.',
    createdAt: '2026-05-01'
  },
  {
    id: 'tut-rosca-direta',
    name: 'Rosca Direta',
    muscleGroup: 'Bíceps',
    videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    videoType: 'youtube',
    executionNotes: 'Pés paralelos na largura do quadril, abdômen contraído. Com os cotovelos firmes ao lado do corpo, flexione os antebraços erguendo a barra ou halteres. Controle a descida completa sem hiperextender ou balançar o tronco.',
    commonMistakes: 'Usar impulso da lombar (gangorra), mover os cotovelos muito para a frente antes do topo do movimento.',
    createdAt: '2026-05-01'
  },
  {
    id: 'tut-leg-press-45',
    name: 'Leg press 45',
    muscleGroup: 'Pernas & Glúteos',
    videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    videoType: 'youtube',
    executionNotes: 'Apoie as costas e o quadril firmemente no encosto durante todo o exercício. Posicione os pés na largura dos ombros na plataforma. Destrave a máquina e desça flexionando os joelhos em direção aos ombros sem descolar a lombar do banco.',
    commonMistakes: 'Tirar o quadril ou lombar do banco na parte mais baixa (retroversão pélvica perigosa), travar completamente os joelhos em hiperextensão no topo.',
    createdAt: '2026-05-01'
  }
];
