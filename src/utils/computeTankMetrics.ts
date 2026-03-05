import { TankParameter } from "../constants/tankParameters";
import { horizontalCylinderVolume } from "./computeHorizontalCylinderVolume";

export function computeTankMetrics(
    cfg: TankParameter,
    ultraHeight: number
) {
    let depth = 0;
    let volumeLiters = 0;

    // ---------- FIRE TANK (RECTANGULAR) ----------
    if (cfg.tank_no === "FIRE-TANK") {
        const maxHeight = cfg.length!; // 17.9 sensor height

        depth = maxHeight - ultraHeight;
        depth = Math.max(0, Math.min(depth, maxHeight));

        volumeLiters = cfg.width! * cfg.height! * depth * 1000;
    }

    // ---------- HORIZONTAL CYLINDER ----------
    else {
        const D = cfg.diameter_breadth!;
        const L = cfg.length!;

        depth = D - ultraHeight;
        depth = Math.max(0, Math.min(depth, D));

        volumeLiters = horizontalCylinderVolume(D, L, depth) * 1000;
    }

    const fillPercent = (volumeLiters / cfg.tank_volume) * 100;

    const isLowLevel = volumeLiters < cfg.lower_safe_limit;
    const isHighLevel = volumeLiters > cfg.upper_safe_limit_pct;

    return {
        liters: volumeLiters,
        fillPercent,
        isLowLevel,
        isHighLevel,
        depth,
    };
}