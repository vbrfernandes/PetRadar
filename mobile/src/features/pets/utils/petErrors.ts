interface PetErrorResponse {
    status?: unknown;
    data?: unknown;
}

interface PetErrorShape {
    response?: PetErrorResponse;
    message?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function getErrorShape(error: unknown): PetErrorShape {
    if (!isRecord(error)) {
        return {};
    }

    const response = isRecord(error.response)
        ? {
            status: error.response.status,
            data: error.response.data,
        }
        : undefined;

    return {
        response,
        message: error.message,
    };
}

export function getPetErrorContext(error: unknown) {
    const errorShape = getErrorShape(error);

    return {
        status: errorShape.response?.status,
        details: errorShape.response?.data || errorShape.message,
    };
}

export function getPetErrorMessage(error: unknown, fallback: string) {
    const responseData = getErrorShape(error).response?.data;

    if (isRecord(responseData) && typeof responseData.detail === "string") {
        return responseData.detail || fallback;
    }

    return fallback;
}
