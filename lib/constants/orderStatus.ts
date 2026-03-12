import {
    Package,
    CreditCard,
    Clock,
    Truck,
    XCircle,
    type LucideIcon
} from "lucide-react";

export interface OrderStatusConfig {
    color: string;
    icon: LucideIcon;
    label: string;
    iconColor: string;
    iconBgColor: string;
}

export const ORDER_STATUS_CONFIG: Record<
  string,
  OrderStatusConfig
> = {
  pending: {
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    label: "Pending",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  paid: {
    color: "bg-green-100 text-green-800",
    icon: CreditCard,
    label: "Paid",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  shipped: {
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
    label: "Shipped",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  delivered: {
    color: "bg-zinc-100 text-zinc-800",
    icon: Package,
    label: "Delivered",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  cancelled: {
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    label: "Cancelled",
    iconColor: "text-red-600 dark:text-red-400",
    iconBgColor: "bg-red-100 dark:bg-red-900/30",
  },
};

export const getOrderStatus = (status: string | null | undefined) =>
    ORDER_STATUS_CONFIG[status ?? "pending"] ?? ORDER_STATUS_CONFIG.pending;