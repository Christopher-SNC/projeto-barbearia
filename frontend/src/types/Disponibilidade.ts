export type DiaSemana =
  | 'SEGUNDA'
  | 'TERCA'
  | 'QUARTA'
  | 'QUINTA'
  | 'SEXTA'
  | 'SABADO'
  | 'DOMINGO'

export interface Disponibilidade {
  idDisponibilidade: number
  idBarbeiro: number
  diaSemana: DiaSemana
  horaInicio: string
  horaFim: string
  ativo: boolean
}

export interface DisponibilidadeRequest {
  idBarbeiro: number
  diaSemana: DiaSemana
  horaInicio: string
  horaFim: string
}