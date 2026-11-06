import { redirect } from "next/navigation";

/** Old URL; map survey now lives at `/connect`. */
export default function ConnectV2RedirectPage() {
  redirect("/connect");
}
