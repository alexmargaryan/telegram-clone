import { AxiosError } from "axios";
import { toast } from "sonner";

import { ApiError } from "@/api/types";

export function handleError(error: AxiosError<ApiError>) {
  toast.error(error.response?.data.message ?? "Something went wrong");
}
