import { TankParameter } from "../constants/tankParameters";

export function computeTankMetrics(
    cfg: TankParameter,
    ultra_height: number
) {
    let fillRatio = 0;

    if (cfg.height && cfg.height > 0) {
        // ultra_height = distance from sensor → water surface
        fillRatio = 1 - ultra_height / cfg.height;
    } else {
        // fallback: treat value as proportional (already normalized-ish)
        fillRatio = 1 - ultra_height;
    }

    fillRatio = Math.max(0, Math.min(1, fillRatio));

    const liters = fillRatio * cfg.tank_volume;

    const isLowLevel = liters < cfg.lower_safe_limit;
    const isHighLevel = liters > cfg.upper_safe_limit_pct;

    return {
        liters,
        fillPercent: fillRatio * 100,
        isLowLevel,
        isHighLevel,
    };
}