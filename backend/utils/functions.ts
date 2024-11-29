type UserRequest = {
    user: string
    password: string
    role: string
    firstName: string
    lastName: string
}

export const validateUserInput = (body: UserRequest): string | null => {
    if (!body.user || !body.password) return 'Username and password are required.'
    if (body.password.length < 8) return 'Password must be at least 8 characters long.'
    const role = body.role.toLowerCase();
    if(role != 'admin' && role != 'mom' && role !== 'volunteer') return 'Role must be either Admin, Mom, or Volunteer.'
    if(body.firstName.length < 1 || body.lastName.length < 1) return 'First and last name are required.'
    // Will add more validations according to industry best practices later
    return null
}