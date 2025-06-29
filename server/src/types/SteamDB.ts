
export type SteamDBGameImage = {
    "success": boolean,
    "page": number,
    "total": number,
    "limit": number,
    "data": [{
        "id": number,
        "score": number,
        "style": string,
        "url": string,
        "thumb": string,
        "tags": [
            string
        ],
        "author": {
            "name": string,
            "steam64": string,
            "avatar": string
        }
    }]
}

export type SteamDBGame = {
    "success": boolean,
    "data": {
        "id": number,
        "name": string,
        "types": string[],
        "verified": boolean
    }
}