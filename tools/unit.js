
/* 
    name: convert_unit
    description: 進⾏單位換算
    parameters: value（數字，如 25）、from_unit（字串，原始單位）、 to_unit（字串，⽬標單位） 

*/

export const convertUnitTool = {
  type: "function",
  function: {
    name: "convert_units",
    description: "進行單位換算。所有涉及溫度（c/f）、距離（km/mile）、重量（kg/lb）的換算，都必須呼叫此工具，不可自行計算。",
    parameters: {
      type: "object",
      properties: {
        value: {
          type: "number",
          description: "要換算的數值",
        },
        from_unit: {
          type: "string",
          description: "原始單位",
        },
        to_unit: {
          type: "string",
          description: "目標單位",
        },
      },
      required: ["value", "from_unit", "to_unit"],
    },
  },
};


/* 
    1. 攝⽒ ↔ 華⽒：°F = °C × 9/5 + 32
    2. 公⾥ ↔ 英⾥：1 km = 0.621371 mile 公
    3. ⽄ ↔ 磅：1 kg = 2.20462 lb
    4. 不⽀援的單位組合，回傳錯誤訊息物件
*/
export async function convertUnit({ value, from_unit, to_unit }) {
    const key = `${from_unit.toLowerCase()}_to_${to_unit.toLowerCase()}`;

    switch (key) {
        case "c_to_f":
            return { result: value * 9 / 5 + 32 };
        case "f_to_c":
            return { result: (value - 32) * 5 / 9 };
        case "km_to_mile":
            return { result: value * 0.621371 };
        case "mile_to_km":
            return { result: value / 0.621371 };
        case "kg_to_lb":
            return { result: value * 2.20462 };
        case "lb_to_kg":
            return { result: value / 2.20462 };
        default:
            return { error: `unsupported unit combination` };
    }
}