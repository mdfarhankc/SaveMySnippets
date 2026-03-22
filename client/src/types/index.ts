export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
export interface User {
    id: string;
    email: string;
    full_name: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    is_staff: boolean;
}

export interface Lanugage {
    id: string;
    name: string;
    extension: string
}

export interface Snippet {
    id: string;
    slug: string;
    title: string;
    description: string;
    content: string;
    is_public: boolean;
    language: Lanugage;
    tags: Array<string>;
    created_by: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}