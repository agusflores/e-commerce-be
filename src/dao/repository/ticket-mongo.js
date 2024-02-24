import ticketModel from '../../models/ticket.model.js'

export class TicketMongo {
  constructor() {
    this.model = ticketModel
  }

  async createTicket(ticket) {
    try {
      const result = await ticketModel.create(ticket)
      return result
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
