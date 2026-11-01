export interface ApiError {
    timestamp: string;
    status: number;
    errorCode: string;
    message: string;
    path: string;
    traceId: string;
    fieldErrors: FieldError[];
}

export interface FieldError {
    field: string;
    rejectedValue: unknown;
    message: string;
}