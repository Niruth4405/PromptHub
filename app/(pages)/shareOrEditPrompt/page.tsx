import { Suspense } from "react";
import ShareOrEditPromptClient from "./ShareOrEditPromptClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShareOrEditPromptClient />
    </Suspense>
  );
}