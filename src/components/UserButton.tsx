import { UserButton } from "@clerk/nextjs";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CustomUserButton() {
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "h-8 w-8",
          loadingIndicator: "h-8 w-8 flex items-center justify-center"
        }
      }}
    />
  );
} 