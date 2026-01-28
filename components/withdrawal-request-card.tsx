import { View, Text } from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface WithdrawalRequest {
  id: number;
  points: number;
  amountUsd: string;
  method: "instapay" | "vodafone_cash" | "paypal";
  methodDetails: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

interface WithdrawalRequestCardProps {
  request: WithdrawalRequest;
}

export function WithdrawalRequestCard({ request }: WithdrawalRequestCardProps) {
  const colors = useColors();

  const statusConfig = {
    pending: {
      label: "قيد المراجعة",
      icon: "clock.fill" as const,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    approved: {
      label: "مكتمل",
      icon: "checkmark.circle.fill" as const,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    rejected: {
      label: "مرفوض",
      icon: "xmark.circle.fill" as const,
      color: "text-error",
      bgColor: "bg-error/10",
    },
  };

  const methodLabels = {
    instapay: "Instapay",
    vodafone_cash: "Vodafone Cash",
    paypal: "PayPal",
  };

  const status = statusConfig[request.status];
  const date = new Date(request.createdAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border mb-3">
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-foreground text-lg font-bold">
            {request.points} نقطة
          </Text>
          <Text className="text-primary text-base font-semibold">
            ${request.amountUsd}
          </Text>
        </View>
        <View className={`${status.bgColor} px-3 py-1 rounded-full flex-row items-center`}>
          <IconSymbol name={status.icon} size={16} color={colors[request.status === "pending" ? "warning" : request.status === "approved" ? "success" : "error"]} />
          <Text className={`${status.color} text-sm font-semibold ml-1`}>
            {status.label}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <View className="flex-row">
          <Text className="text-muted text-sm">الوسيلة: </Text>
          <Text className="text-foreground text-sm font-semibold">
            {methodLabels[request.method]}
          </Text>
        </View>
        <View className="flex-row">
          <Text className="text-muted text-sm">
            {request.method === "paypal" ? "البريد: " : "الرقم: "}
          </Text>
          <Text className="text-foreground text-sm">{request.methodDetails}</Text>
        </View>
        <View className="flex-row">
          <Text className="text-muted text-sm">التاريخ: </Text>
          <Text className="text-foreground text-sm">{date}</Text>
        </View>
      </View>
    </View>
  );
}
