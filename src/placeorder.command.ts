import {
  BillingAmount,
  EmailAddress,
  FixMe,
  OrderId,
  OrderLineId,
  OrderQuantity,
  Price,
  ProductCode,
  Address,
  CustomerInfo,
} from "./model";

export interface UnvalidatedCustomerInfo {
  firstName: string;
  lastName: string;
  emailAddress: string;
  vipStatus: string;
}

export interface UnvalidatedAddress {
  isValidated: false;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
}

export interface UnvalidatedOrderLine {
  orderLineId: string;
  productCode: string;
  quantity: number;
}

export interface UnvalidatedOrder {
  orderId: string;
  customerInfo: UnvalidatedCustomerInfo;
  shippingAddress: UnvalidatedAddress;
  billingAddress: UnvalidatedAddress;
  lines: UnvalidatedOrderLine[];
}

export interface OrderAcknowledgmentSent {
  orderId: OrderId;
  emailAddress: EmailAddress;
}

export interface PricedOrderLine {
  orderLineId: OrderLineId;
  productCode: ProductCode;
  quantity: OrderQuantity;
  linePrice: Price;
}

export interface PricedOrder {
  orderId: OrderId;
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  amountToBill: BillingAmount;
  lines: PricedOrderLine[];
}

export type OrderPlaced = PricedOrder;

export interface BillableOrderPlaced {
  orderId: OrderId;
  billingAddress: Address;
  amountToBill: BillingAmount;
}

export type PlaceOrderEvent =
  | OrderPlaced
  | BillableOrderPlaced
  | OrderAcknowledgmentSent;

export type ValidationError = { errType: "Validation"; msg: string };
export const createValidationError = (msg: string): ValidationError => ({
  errType: "Validation",
  msg,
});

export type PricingError = { errType: "Pricing"; msg: string };
export const createPricingError = (msg: string): PricingError => ({
  errType: "Pricing",
  msg,
});

export type URI = string;
export interface ServiceInfo {
  name: string;
  endpoint: URI;
}

export interface RemoteServiceError {
  errType: "RemoteService";
  service: ServiceInfo;
  exception: FixMe;
}

export type PlaceOrderError =
  | ValidationError
  | PricingError
  | RemoteServiceError;

export type PlaceOrder = (
  unvalidatedOrder: UnvalidatedOrder
) => Promise<PlaceOrderEvent[] | PlaceOrderError>;
