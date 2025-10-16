import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";

export default function SubmitDialog() {
  return (
    <Dialog>
      <DialogTrigger>Submit your project</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit Your Project</DialogTitle>
          <DialogDescription>
            <div>
              <small>Description</small>
              <p>
                Pittogramma is a digital platform dedicated to sharing and
                promoting all kinds of graphic design projects created by
                designers under 35 years old from around the world.
              </p>
              <p>
                Submitted projects must be individual works such as academic
                projects, thesis work, PhD research, or other independently
                designed projects. We do not accept projects designed in
                collaboration with, or under the art direction of, a
                studio/agency.
              </p>
              <p>
                To submit your project, please download the Submission Kit and
                follow the instructions provided in the readme.txt file.
              </p>
            </div>
            <div>faq</div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <p>Any other questions that are not present above?</p>
          <Button>Contact us</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
