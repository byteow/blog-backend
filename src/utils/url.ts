import { HOST, PORT, PRODUCTION } from "../config"

export function getServerUrl() {
    const proto = PRODUCTION ? 'https' : 'http';
    return `${proto}://${HOST}:${PORT}`;
}

export function getFileUrl(filename: string) {
    if (!filename) {
        return null;
    }
    return `${getServerUrl()}/file?filename=${filename}`;
}