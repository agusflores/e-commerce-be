import { ticketDao } from '../dao/index.js'

class TicketController {
  static createTicket = async (req, res) => {
    try {
      const ticket = req.body
      const createdTicket = await ticketDao.createTicket(ticket)
      return res.json({
        status: 'success',
        message: createdTicket,
      })
    } catch (error) {
      return res.status(404).send({ status: 'error', message: error.message })
    }
  }
}

export { TicketController }
