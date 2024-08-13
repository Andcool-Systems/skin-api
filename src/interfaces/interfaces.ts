interface SearchQuery {
    take?: string,
    page?: string,
}

interface Properties {
    name: string;
    value: string;
}

interface Profile {
    id: string;
    name: string;
    properties: Properties[];
}

interface Textures {
    SKIN: {
        url: string;
        metadata?: {
            model: string;
        }
    };
    CAPE?: {
        url: string;
    };
}

interface EncodedResponse {
    timestamp: number,
    profileId: string,
    profileName: string,
    textures: Textures
}

interface SearchUnit {
    name: string,
    uuid: string,
    head: string
}

interface SearchNicks {
    status: string,
    requestedFragment: string
    data: SearchUnit[],
    total_count: number,
    next_page: number
}

interface SearchParams {
    fragment: string,
    take: number,
    page: number
}