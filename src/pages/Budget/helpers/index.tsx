import { parseBrValueToNumber } from "../../../helpers/StringHelpers";

export const getTotalValueWithDiscount = (value: string, discountValue: string, discountType: string) => {
  if (discountType === 'percentage') {
    const discountCurrencyValue = !!(value && discountValue && discountType) ? parseBrValueToNumber(value) * (parseBrValueToNumber(discountValue) / 100) : 0;
    const valueWithDiscount = discountCurrencyValue ? parseBrValueToNumber(value) - discountCurrencyValue : parseBrValueToNumber(value) ?? 0;

    return valueWithDiscount;
  }

  const valueWithDiscount = value && discountValue ? parseBrValueToNumber(value) - parseBrValueToNumber(discountValue) : parseBrValueToNumber(value) ?? 0;

  return valueWithDiscount;
};