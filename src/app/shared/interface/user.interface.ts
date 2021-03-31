import { Role } from '../enum/role.enum'

interface users { 
    id: string,
    fname: string,
    mname: string,
    lname: string,
    email: string,
    phone: number,
    role: Role,
    address: string,
    editable: boolean
}
export interface User extends Array<users>{}
