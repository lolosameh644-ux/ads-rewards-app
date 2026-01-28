import { View, Text, TouchableOpacity, Animated } from "react-native";
import { useState, useRef } from "react";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const colors = useColors();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View className="gap-3">
      {items.map((item) => (
        <View
          key={item.id}
          className="bg-surface rounded-2xl border border-border overflow-hidden"
        >
          {/* Question Header */}
          <TouchableOpacity
            onPress={() => toggleExpand(item.id)}
            className="flex-row items-center justify-between p-4 active:opacity-70"
          >
            <Text className="text-foreground text-base font-semibold flex-1 mr-3">
              {item.question}
            </Text>
            <View
              style={{
                transform: [
                  {
                    rotate: expandedId === item.id ? "180deg" : "0deg",
                  },
                ],
              }}
            >
              <IconSymbol name="chevron.down" size={24} color={colors.primary} />
            </View>
          </TouchableOpacity>

          {/* Answer Content */}
          {expandedId === item.id && (
            <View className="border-t border-border bg-background/50 px-4 py-3">
              <Text className="text-muted text-sm leading-relaxed">{item.answer}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
