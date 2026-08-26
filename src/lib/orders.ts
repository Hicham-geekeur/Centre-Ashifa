import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export interface OrderData {
  checkoutReference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  quantity: number;
  bookPrice: number;
  shippingPrice: number;
  totalAmount: number;
  createdAt: string;
  status: "pending" | "paid" | "failed" | "expired";
  paypalOrderId?: string;
  stripeSessionId?: string;
}

const DATA_DIR = join(process.cwd(), "data");
const ORDERS_FILE = join(DATA_DIR, "orders.json");

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readOrders(): Record<string, OrderData> {
  ensureDataDir();
  if (!existsSync(ORDERS_FILE)) return {};
  const raw = readFileSync(ORDERS_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeOrders(orders: Record<string, OrderData>): void {
  ensureDataDir();
  writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export function saveOrder(order: OrderData): void {
  const orders = readOrders();
  orders[order.checkoutReference] = order;
  writeOrders(orders);
}

export function getOrder(checkoutReference: string): OrderData | null {
  const orders = readOrders();
  return orders[checkoutReference] || null;
}

export function updateOrderStatus(
  checkoutReference: string,
  status: OrderData["status"],
  paypalOrderId?: string
): void {
  const orders = readOrders();
  if (orders[checkoutReference]) {
    orders[checkoutReference].status = status;
    if (paypalOrderId) {
      orders[checkoutReference].paypalOrderId = paypalOrderId;
    }
    writeOrders(orders);
  }
}

export function attachStripeSession(
  checkoutReference: string,
  sessionId: string
): void {
  const orders = readOrders();
  if (orders[checkoutReference]) {
    orders[checkoutReference].stripeSessionId = sessionId;
    writeOrders(orders);
  }
}

export function generateCheckoutReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ASHIFA-${timestamp}-${random}`;
}
