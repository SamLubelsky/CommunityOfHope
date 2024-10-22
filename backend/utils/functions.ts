type UserRequest = {
    user: string
    password: string
  }

const validateUserInput = (body: UserRequest): string | null => {
    if (!body.user || !body.password) return 'Username and password are required.'
    if (body.password.length < 8) return 'Password must be at least 8 characters long.'
    // Will add more validations according to industry best practices later
    return null
}