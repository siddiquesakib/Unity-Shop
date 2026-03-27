const WORKFLOW = [
	"placed",
	"confirmed",
	"packed",
	"picked",
	"inTransit",
	"outForDelivery",
	"delivered",
	"cancelled",
];

const LEGACY_TO_WORKFLOW = {
	New: "placed",
	Processing: "packed",
	Shipped: "outForDelivery",
	Delivered: "delivered",
	Cancelled: "cancelled",
};

const WORKFLOW_TO_LEGACY = {
	placed: "New",
	confirmed: "Processing",
	packed: "Processing",
	picked: "Shipped",
	inTransit: "Shipped",
	outForDelivery: "Shipped",
	delivered: "Delivered",
	cancelled: "Cancelled",
};

const LABELS = {
	placed: "Order Placed",
	confirmed: "Manager Approved",
	packed: "Packed by Seller",
	picked: "Picked by Delivery",
	inTransit: "In Transit",
	outForDelivery: "Out for Delivery",
	delivered: "Delivered",
	cancelled: "Cancelled",
};

export function normalizeToWorkflowStatus(status) {
	if (!status) return "placed";
	return LEGACY_TO_WORKFLOW[status] || status;
}

export function toLegacyOrderStatus(status) {
	const workflow = normalizeToWorkflowStatus(status);
	return WORKFLOW_TO_LEGACY[workflow] || "New";
}

export function getOrderStatusLabel(status) {
	const workflow = normalizeToWorkflowStatus(status);
	return LABELS[workflow] || workflow;
}

export function isForwardStatusTransition(currentStatus, nextStatus) {
	const current = WORKFLOW.indexOf(normalizeToWorkflowStatus(currentStatus));
	const next = WORKFLOW.indexOf(normalizeToWorkflowStatus(nextStatus));
	if (next === -1 || current === -1) return false;
	if (nextStatus === "cancelled") return true;
	return next >= current;
}

export const ORDER_WORKFLOW = WORKFLOW;

