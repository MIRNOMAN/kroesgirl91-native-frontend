import { Pressable, Text } from "react-native";

type AuthButtonProps = {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export default function AuthButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: AuthButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`
        h-[56px] w-full rounded-2xl items-center justify-center
        ${isPrimary ? "btn-primary" : "bg-[#E5E7EB]"}
        active:opacity-80
      `}
      style={{ opacity: disabled ? 0.65 : 1 }}
    >
      <Text
        className={`
          text-[16px] font-bold  tracking-wide
          ${isPrimary ? "text-white" : "text-[#002B3B]"}
        `}
      >
        {title}
      </Text>
    </Pressable>
  );
}
