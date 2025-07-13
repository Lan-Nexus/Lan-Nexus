export type steamOwnedGame = {
    "appid": number,
    "name": string,
    "playtime_forever": number,
    "img_icon_url": string,
    "content_descriptorids": number[]
}

export type SteamResponseOwnGames = {
    "response": {
        "game_count": number,
        "games": steamOwnedGame[],
    }
}

export type SteamResponseAppDetails = {
    [key: string]: {
        "success": boolean,
        "data": {
            "type": string,
            "name": string,
            "steam_appid": number,
            "required_age": number,
            "is_free": boolean,
            "detailed_description": string,
            "about_the_game": string,
            "short_description": string,
            "supported_languages": string,
            "header_image": string,
            "capsule_image": string,
            "capsule_imagev5": string,
            "website": null,
            "pc_requirements": {
                "minimum": string
            },
            "mac_requirements": {
                "minimum": string
            },
            "linux_requirements": {
                "minimum": string
            },
            "developers": [
                string
            ],
            "publishers": [
                string
            ],
            "price_overview": {
                "currency": string,
                "initial": number,
                "final": number,
                "discount_percent": number,
                "initial_formatted": string,
                "final_formatted": string
            },
            "packages": number[],
            "package_groups": [
                {
                    "name": string,
                    "title": string,
                    "description": string,
                    "selection_text": string,
                    "save_text": string,
                    "display_type": number,
                    "is_recurring_subscription": string,
                    "subs": {
                        "packageid": number,
                        "percent_savings_text": string,
                        "percent_savings": number,
                        "option_text": string,
                        "option_description": string,
                        "can_get_free_license": string,
                        "is_free_license": boolean,
                        "price_in_cents_with_discount": number
                    }[],
                }
            ],
            "platforms": {
                "windows": boolean,
                "mac": boolean,
                "linux": boolean,
            },
            "metacritic": {
                "score": number,
                "url": string
            },
            "categories": {
                "id": string,
                "description": string
            }[],

            "genres": {
                "id": string,
                "description": string
            }[],
            "screenshots": {
                "id": number,
                "path_thumbnail": string
                "path_full": string
            }[],
            "recommendations": {
                "total": number
            },
            "release_date": {
                "coming_soon": boolean,
                "date": string
            },
            "support_info": {
                "url": string,
                "email": string
            },
            "background": string,
            "background_raw": string,
            "content_descriptors": {
                "ids": number[],
                "notes": string
            },
            "ratings": {
                "usk": {
                    "rating": string
                },
                "dejus": {
                    "rating_generated": string,
                    "rating": string,
                    "required_age": string,
                    "banned": string,
                    "use_age_gate": string,
                    "descriptors": string
                },
                "steam_germany": {
                    "rating_generated": string,
                    "rating": string,
                    "required_age": string,
                    "banned": string,
                    "use_age_gate": string,
                    "descriptors": string
                }
            }
        }
    }
}