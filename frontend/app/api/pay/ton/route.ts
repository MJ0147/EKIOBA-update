import { handlePayment } from "../paymentHandler";

export async function POST(request: Request) {
  return handlePayment(request, "ton");
}
