export interface RoleUsers {
    id:string
    name:string
    access_levels:string
    user_type:string//admin,agent,school,student
    created_by:number//id of agent of school
    timestamp:any
}