export class UserDTO {
  constructor(user) {
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.age = user.age
    this.role = user.role
    this.cart = user.cart
  }

  userToDTO(user) {
    return new UserDTO(user)
  }
}
