export interface Avaliacao {
  idAvaliacao: number
  idAgendamento: number
  notaBarbearia: number
  notaBarbeiro: number | null
  comentario: string | null
  dataAvaliacao: string
}