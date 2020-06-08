export interface People {
    id: string
    name: string
    image: string
    event: string
    description: string
    more_information:any[]
    video_urls: string[]
    faceboook_page_url: string
    twitter_page_url: string
    instagram_page_url: string
    youtube_page_url: string
    tiktok_page_url:string
    views: number
    voting_counts: number
    vote_type: string
    capped_vote_number:number
    link?: number
    avgRating?: number
    numRatings?: number
    share_url:string
    approved: boolean
    created_by?: number//id of the agent/school
    created_date?: string
    modified_date?: string
    timestamp?: any
}