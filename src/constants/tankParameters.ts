export interface TankParameter {
    device_id: string;
    tank_no: string;
    location: string;
    diameter_breadth?: number;
    length?: number;
    width?: number;
    height?: number;
    tank_volume: number;
    upper_safe_limit_pct: number;
    lower_safe_limit: number;
}

export const TANK_PARAMETERS: TankParameter[] = [
    {
        device_id: "PL_DSP_AD01",
        tank_no: "CS21",
        location: "Battery-5",
        diameter_breadth: 1,
        length: 2.5,
        tank_volume: 1350,
        upper_safe_limit_pct: 1287.65,
        lower_safe_limit: 1094.54,
    },
    {
        device_id: "PL_DSP_AD02",
        tank_no: "CS21B",
        location: "Battery-5",
        diameter_breadth: 1.2,
        length: 2.85,
        tank_volume: 3261.66,
        upper_safe_limit_pct: 3000,
        lower_safe_limit: 2457.04,
    },
    {
        device_id: "PL_DSP_AD03",
        tank_no: "BS-11",
        location: "Battery-5 WF",
        diameter_breadth: 2,
        length: 4,
        tank_volume: 12566,
        upper_safe_limit_pct: 11660,
        lower_safe_limit: 9328,
    },
    {
        device_id: "PL_DSP_AD04",
        tank_no: "BS-10",
        location: "Battery-5 WF",
        diameter_breadth: 2.2,
        length: 2.5,
        tank_volume: 8924.6,
        upper_safe_limit_pct: 8478.37,
        lower_safe_limit: 6782.7,
    },
    {
        device_id: "PL_DSP_AD05",
        tank_no: "BS-7A",
        location: "Battery-3 WF",
        diameter_breadth: 2,
        length: 5.05,
        tank_volume: 12747.4,
        upper_safe_limit_pct: 12110,
        lower_safe_limit: 9688,
    },
    {
        device_id: "PL_DSP_AD06",
        tank_no: "BS-7B",
        location: "Battery-2 WF",
        diameter_breadth: 1.8,
        length: 4.5,
        tank_volume: 11810.7,
        upper_safe_limit_pct: 11220.2,
        lower_safe_limit: 8976.16,
    },
    {
        device_id: "PL_DSP_AD07",
        tank_no: "CS-23B",
        location: "Sinter Plant R",
        diameter_breadth: 2,
        length: 3.9,
        tank_volume: 12810,
        upper_safe_limit_pct: 10950,
        lower_safe_limit: 8881.68,
    },
    {
        device_id: "PL_DSP_AD08",
        tank_no: "BS-6",
        location: "Power Plant",
        diameter_breadth: 2.5,
        length: 5.1,
        tank_volume: 21970.3,
        upper_safe_limit_pct: 20871.8,
        lower_safe_limit: 16697.4,
    },
    {
        device_id: "PL_DSP_AD09",
        tank_no: "LS-1",
        location: "M. Gas Holder",
        diameter_breadth: 1.95,
        length: 2.6,
        tank_volume: 7432.7,
        upper_safe_limit_pct: 7390.6,
        lower_safe_limit: 5912.48,
    },
    {
        device_id: "PL_DSP_AD10",
        tank_no: "MS-14",
        location: "ERS",
        diameter_breadth: 2.3,
        length: 3.7,
        tank_volume: 15250.3,
        upper_safe_limit_pct: 14570.2,
        lower_safe_limit: 11656,
    },
    {
        device_id: "PL_DSP_AD11",
        tank_no: "FIRE-TANK",
        location: "Propane Gas",
        length: 17.9,
        width: 8.9,
        height: 5.15,
        tank_volume: 822000,
        upper_safe_limit_pct: 780900,
        lower_safe_limit: 534300,
    },
];