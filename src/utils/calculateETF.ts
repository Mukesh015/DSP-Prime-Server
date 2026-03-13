import { TankParameter } from "../constants/tankParameters";
import { computeTankMetrics } from "./computeTankMetrics";

export const calculateETF = (
    cfg: TankParameter,
    currentUltra: number,
    prevUltra: number,
    currentTime: Date,
    prevTime: Date
): string | null => {

    console.log('first', cfg.tank_no, currentUltra, prevUltra, currentTime, prevTime);

    const currentMetrics = computeTankMetrics(cfg, currentUltra);
    const prevMetrics = computeTankMetrics(cfg, prevUltra);

    const currentLiters = currentMetrics.liters;
    const prevLiters = prevMetrics.liters;

    const deltaLiters = currentLiters - prevLiters;

    const deltaMinutes =
        (currentTime.getTime() - prevTime.getTime()) / (1000 * 60);

    if (deltaLiters <= 0 || deltaMinutes <= 0) {
        return null;
    }

    const ratePerMinute = deltaLiters / deltaMinutes;

    const remainingLiters = cfg.tank_volume - currentLiters;

    if (remainingLiters <= 0) return "Full";

    const minutesToFill = remainingLiters / ratePerMinute;

    const hrs = Math.floor(minutesToFill / 60);
    const mins = Math.round(minutesToFill % 60);

    return `${hrs}h ${mins}m`;
};

export default calculateETF;