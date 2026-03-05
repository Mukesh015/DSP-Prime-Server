export function horizontalCylinderVolume(
    diameter: number,
    length: number,
    depth: number
) {
    const R = diameter / 2;

    if (depth <= 0) return 0;
    if (depth >= diameter) return Math.PI * R * R * length;

    const term1 = R * R * Math.acos((R - depth) / R);
    const term2 = (R - depth) * Math.sqrt(2 * R * depth - depth * depth);

    const area = term1 - term2;

    return length * area;
}