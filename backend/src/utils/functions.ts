import { Request } from 'express'
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
    if(body.role != 'Admin' && body.role != 'Mom' && body.role !== 'Volunteer') return 'Role must be either Admin, Mom, or Volunteer.'
    if(body.firstName.length < 1 || body.lastName.length < 1) return 'First and last name are required.'
    // Will add more validations according to industry best practices later
    return null
}
export const verifySessionRequest = (req: Request): boolean => {
    if(!req.session || !req.session.userId || !req.session.role){
        return false
    }
    return true
}