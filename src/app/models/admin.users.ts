export interface AdminUsers {
    id:string
    email:string
    name:string
    position:string
    image:string
    role:string
    voting_credit?:number
    access_levels:string
    blocked:boolean
    approved:boolean
    user_type:string//admin,agent,
    user_role_type:string//owner, staff
    created_by:number//id of the agent/school
    timestamp:any
}