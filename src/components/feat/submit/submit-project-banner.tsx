import { Button } from "@/components/ui/button";

export default function SubmitProjectBanner() {
  return (
    <div className="flex flex-col items-center justify-start gap-6 rounded-lg bg-secondary p-5 text-3xl">
      <h2>Do you have something interesting to share?</h2>
      <Button>Drop us an email</Button>
    </div>
  );
}
