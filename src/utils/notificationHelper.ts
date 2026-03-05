export const getTankAlertType = (
    offline: boolean,
    isLowLevel: boolean,
    isHighLevel: boolean,
    status: string | null
) => {

    if (status === "invalid") {
        return {
            type: "fault",
            message: "Sensor fault detected"
        };
    }

    if (offline) {
        return {
            type: "offline",
            message: "Device offline for more than 15 minutes"
        };
    }

    if (isHighLevel) {
        return {
            type: "overflow",
            message: "Tank overflow risk"
        };
    }

    if (isLowLevel) {
        return {
            type: "underflow",
            message: "Tank underflow detected"
        };
    }

    return null;
};