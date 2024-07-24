export type FixMe = any;

export type Int = number;
export type Decimal = number;
export type String50 = string;
export type EmailAddress = string;
export type ZipCode = string;
export type OrderId = string;
export type OrderLineId = string;
export interface WidgetCode {
  productType: "widget";
  code: string;
}
export interface GizmoCode {
  productType: "gizmo";
  code: string;
}
export type ProductCode = WidgetCode | GizmoCode;
export type UnitQuantity = { quantityType: "Unit"; quantity: Int };
export type KilogramQuantity = { quantityType: "Kilogram"; quantity: Decimal };
export type OrderQuantity = UnitQuantity | KilogramQuantity;
export type Price = Decimal;
export type BillingAmount = Decimal;
export interface PdfAttachment {
  name: string;
  bytes: ArrayBuffer;
}

export type Primitive =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | null
  | undefined;
export type Err = { msg: string; errType: string };
export type NotErr = Primitive | Omit<object, "errType">;
export const isErr = (e: Primitive | object): e is Err => {
  switch (typeof e) {
    case "string":
    case "number":
    case "boolean":
    case "symbol":
    case "bigint":
    case "undefined":
      return false;
    case "object":
      if (e === null) return false;
      return "errType" in e;
    default:
      const _: never = e;
      return _;
  }
};

export function splitErr<T extends NotErr | Err, SomeErr extends Err = Err>(
  errs: Array<T | SomeErr>
): [T[], SomeErr[]] {
  const isSomeErr = (e: T | SomeErr): e is SomeErr => isErr(e);
  const isNotErr = (e: T | SomeErr): e is T => !isErr(e);
  return [errs.filter(isNotErr), errs.filter(isSomeErr)];
}

namespace ConstrainedType {
  export type CreateStringEmptyError = Err & { errType: "Empty" };
  export type CreateStringTooLongError = Err & { errType: "TooLong" };
  export type CreateStringError =
    | CreateStringEmptyError
    | CreateStringTooLongError;

  const isEmptyString = (str: string): boolean =>
    [null, undefined, ""].includes(str);

  export const createString = (
    fieldName: string,
    maxLen: number,
    str: string
  ): string | CreateStringError => {
    if (isEmptyString(str))
      return {
        errType: "Empty",
        msg: `${fieldName} must not be null or undefined or empty`,
      };
    else if (str.length > maxLen)
      return {
        errType: "TooLong",
        msg: `${fieldName} must not be more than ${maxLen} chars`,
      };
    return str;
  };

  export const createStringOption = (
    fieldName: string,
    maxLen: number,
    str: string
  ): string | null | CreateStringTooLongError => {
    const s = createString(fieldName, maxLen, str);
    if (typeof s === "string") return s;
    switch (s.errType) {
      case "Empty":
        return null;
      case "TooLong":
        return s;
      default:
        const _: never = s;
    }
    return null;
  };

  export type CreateIntTooSmallError = Err & { errType: "TooSmall" };
  export type CreateIntTooBigError = Err & { errType: "TooBig" };
  export type CreateIntNotIntError = Err & { errType: "NotInt" };
  export type CreateIntError =
    | CreateIntTooSmallError
    | CreateIntTooBigError
    | CreateIntNotIntError;

  export const createInt = (
    fieldName: string,
    minVal: number,
    maxVal: number,
    i: number
  ): Int | CreateIntError => {
    if (i < minVal)
      return {
        errType: "TooSmall",
        msg: `${i}: Must not be less than ${minVal}`,
      };
    if (i > maxVal)
      return {
        errType: "TooBig",
        msg: `${i}: Must not be greater than ${maxVal}`,
      };
    if (!Number.isInteger(i))
      return { errType: "NotInt", msg: `${i}: Must be integer` };
    return i;
  };

  export type CreateDecimalTooSmallError = Err & { errType: "TooSmall" };
  export type CreateDecimalTooBigError = Err & { errType: "TooBig" };
  export type CreateDecimalNotDecimalError = Err & { errType: "NotDecimal" };
  export type CreateDecimalError =
    | CreateDecimalTooSmallError
    | CreateDecimalTooBigError
    | CreateDecimalNotDecimalError;

  export const createDecimal = (
    fieldName: string,
    minVal: number,
    maxVal: number,
    i: number
  ): Decimal | CreateDecimalError => {
    if (i < minVal)
      return {
        errType: "TooSmall",
        msg: `${i}: Must not be less than ${minVal}`,
      };
    if (i > maxVal)
      return {
        errType: "TooBig",
        msg: `${i}: Must not be greater than ${maxVal}`,
      };
    if (!Number.isInteger(i))
      return { errType: "NotDecimal", msg: `${i}: Must be decimal` };
    return i;
  };

  export type CreateLikeEmptyError = Err & { errType: "Empty" };
  export type CreateLikeDoesNotMatchError = Err & { errType: "DoesNotMatch" };
  export type CreateLikeError =
    | CreateLikeEmptyError
    | CreateLikeDoesNotMatchError;

  export const createLike = (
    fieldName: string,
    pattern: RegExp,
    str: string
  ): string | CreateLikeError => {
    if (isEmptyString(str))
      return { errType: "Empty", msg: `${str}: Must not be null or empty` };
    if (!pattern.test(str))
      return {
        errType: "DoesNotMatch",
        msg: `${str}: Must not be null or empty`,
      };
    return str;
  };
}

export namespace String50 {
  import CreateStringError = ConstrainedType.CreateStringError;
  export const value = (str: String50): string => str;
  export const create = (
    fieldName: string,
    str: string
  ): String50 | CreateStringError =>
    ConstrainedType.createString(fieldName, 50, str);
}

export namespace EmailAddress {
  import CreateLikeError = ConstrainedType.CreateLikeError;
  export const value = (str: EmailAddress): string => str;
  export const create = (
    fieldName: string,
    str: string
  ): EmailAddress | CreateLikeError =>
    ConstrainedType.createLike(fieldName, new RegExp(".+@.+]"), str);
}

export namespace ZipCode {
  import CreateLikeError = ConstrainedType.CreateLikeError;
  export const value = (str: ZipCode): string => str;
  export const create = (
    fieldName: string,
    str: string
  ): ZipCode | CreateLikeError =>
    ConstrainedType.createLike(fieldName, new RegExp("d{5}"), str);
}

export namespace OrderId {
  import CreateStringError = ConstrainedType.CreateStringError;
  export const value = (str: OrderId): string => str;
  export const create = (
    fieldName: string,
    str: string
  ): OrderId | CreateStringError =>
    ConstrainedType.createString(fieldName, 50, str);
}

export namespace OrderLineId {
  import CreateStringError = ConstrainedType.CreateStringError;
  export const value = (str: OrderLineId): string => str;
  export const create = (
    fieldName: string,
    str: string
  ): OrderLineId | CreateStringError =>
    ConstrainedType.createString(fieldName, 50, str);
}

export namespace WidgetCode {
  import CreateLikeError = ConstrainedType.CreateLikeError;
  export const value = (widgetCode: WidgetCode): string => widgetCode.code;
  export const create = (
    fieldName: string,
    str: string
  ): WidgetCode | CreateLikeError => {
    const code = ConstrainedType.createLike(
      fieldName,
      new RegExp("Wd{4}"),
      str
    );
    return typeof code === "string" ? { productType: "widget", code } : code;
  };
}

export namespace GizmoCode {
  import CreateLikeError = ConstrainedType.CreateLikeError;
  export const value = (str: GizmoCode): string => str.code;
  export const create = (
    fieldName: string,
    str: string
  ): GizmoCode | CreateLikeError => {
    const code = ConstrainedType.createLike(
      fieldName,
      new RegExp("Gd{3}"),
      str
    );
    return typeof code === "string" ? { productType: "gizmo", code } : code;
  };
}

export namespace ProductCode {
  import CreateLikeError = ConstrainedType.CreateLikeError;
  export type CreateProductCodeUnknownFormatError = Err & {
    errType: "UnknownFormat";
  };
  export type CreateProductCodeError =
    | CreateLikeError
    | CreateProductCodeUnknownFormatError;

  export const value = (productCode: ProductCode): string => productCode.code;
  export const create = (
    fieldName: string,
    code: string
  ): ProductCode | CreateProductCodeError => {
    if (code.startsWith("W")) return WidgetCode.create(fieldName, code);
    if (code.startsWith("G")) return GizmoCode.create(fieldName, code);
    return {
      errType: "UnknownFormat",
      msg: `${fieldName}: Format not recognized '${code}'`,
    };
  };
}

export namespace UnitQuantity {
  import CreateIntError = ConstrainedType.CreateIntError;
  import CreateDecimalError = ConstrainedType.CreateDecimalError;
  export const value = (v: UnitQuantity): number => v.quantity;
  export const create = (
    fieldName: string,
    v: number
  ): UnitQuantity | CreateIntError => {
    const quantity = ConstrainedType.createInt(fieldName, 1, 1000, v);
    return typeof quantity === "number"
      ? { quantityType: "Unit", quantity }
      : quantity;
  };
}

export namespace KilogramQuantity {
  import CreateDecimalError = ConstrainedType.CreateDecimalError;
  export const value = (v: KilogramQuantity): number => v.quantity;
  export const create = (
    fieldName: string,
    v: number
  ): KilogramQuantity | CreateDecimalError => {
    const quantity = ConstrainedType.createDecimal(fieldName, 0.5, 100, v);
    return typeof quantity === "number"
      ? { quantityType: "Kilogram", quantity }
      : quantity;
  };
}

export namespace OrderQuantity {
  import CreateIntError = ConstrainedType.CreateIntError;
  import CreateDecimalError = ConstrainedType.CreateDecimalError;
  export const value = (qty: OrderQuantity) => qty.quantity;
  export const create = (
    fieldName: string,
    productCode: ProductCode,
    v: number
  ): OrderQuantity | CreateIntError | CreateDecimalError => {
    switch (productCode.productType) {
      case "widget":
        return UnitQuantity.create(fieldName, v);
      case "gizmo":
        return KilogramQuantity.create(fieldName, v);
      default:
        const _: never = productCode;
    }
    return null as unknown as OrderQuantity; // never reached
  };
}

export namespace Price {
  import CreateDecimalError = ConstrainedType.CreateDecimalError;
  export const value = (v: Price): number => v;
  export const create = (v: number): Price | CreateDecimalError =>
    ConstrainedType.createDecimal("Price", 0, 1000, v);

  export const unsafeCreate = (v: number) => {
    const price = create(v);
    if (typeof price !== "number") throw price;
    return price;
  };

  export const multiply = (qty: OrderQuantity, price: Price) =>
    create(qty.quantity * price);
}

export namespace BillingAmount {
  import CreateDecimalError = ConstrainedType.CreateDecimalError;
  export const value = (v: BillingAmount): number => v;
  export const create = (v: number): BillingAmount | CreateDecimalError =>
    ConstrainedType.createDecimal("BillingAmount", 0, 10000, v);
  export const sumPrices = (prices: number[]) => {
    const total = prices.reduce((prev, cur) => prev + cur, 0);
    return create(total);
  };
}

export interface PersonalName {
  firstName: String50;
  lastName: String50;
}

export interface CustomerInfo {
  name: PersonalName;
  emailAddress: EmailAddress;
}

export interface Address {
  addressLine1: String50;
  addressLine2: String50 | null;
  addressLine3: String50 | null;
  addressLine4: String50 | null;
  city: String50;
  zipCode: ZipCode;
}
