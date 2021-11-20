class FetchingVcError extends Error {
    public constructor(
        message?: string,
    ) {
        super(message)
    }
}

export default FetchingVcError