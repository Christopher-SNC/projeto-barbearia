export type DiaSemana =
  | 'SEGUNDA'
  | 'TERCA'
  | 'QUARTA'
  | 'QUINTA'
  | 'SEXTA'
  | 'SABADO'
  | 'DOMINGO'

export interface HorarioFuncionamento {
  idHorario: number
  idBarbearia: number
  diaSemana: DiaSemana
  horaAbertura: string | null
  horaFechamento: string | null
  fechado: boolean
}

export interface HorarioFuncionamentoRequest {
  idBarbearia: number
  diaSemana: DiaSemana
  horaAbertura: string | null
  horaFechamento: string | null
  fechado: boolean
}