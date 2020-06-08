export interface Show {
    id: string
    name: string
    background_image: string
    thumbnail_image:string
    category:string
    description:string
    video_urls:string[]
    faceboook_page_url:string
    twitter_page_url:string
    instagram_page_url:string
    youtube_page_url:string
    tiktok_page_url:string
    show_start_date:string
    show_end_date:string
    views:number
    voting_credit?:number
    link?:number
    avgRating?: number
    numRatings?: number
    share_url:string
    approved: boolean
    verified: boolean
    created_by?: number//id of the agent/school
    created_date?:string
    modified_date?:string
    timestamp?: any
}