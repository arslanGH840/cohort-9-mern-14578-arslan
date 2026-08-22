import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema } from "../validations/noteSchema";
import RichTextEditor from "./RichTextEditor";
import Button from "../../../components/ui/Button";

function NoteForm({ defaultValues, onSubmit, onCancel, isSubmitting }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: defaultValues || { title: "", body: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register("title")}
          className="w-full border border-border rounded-lg px-4 py-2.5 text-lg font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          placeholder="Untitled note"
        />
        {errors.title && (
          <p className="text-error text-xs mt-1.5">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-6">
        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <RichTextEditor value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.body && (
          <p className="text-error text-xs mt-1.5">{errors.body.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default NoteForm;
