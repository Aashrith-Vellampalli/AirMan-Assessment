type EprStatus = "draft" | "submitted" | "archived"

type EditFormState = {
  overall_rating: number
  technical_skills_rating: number
  non_technical_skills_rating: number
  remarks: string
  status: EprStatus
}

type EditEprFormProps = {
  form: EditFormState
  onChange: (updater: (prev: EditFormState) => EditFormState) => void
  onSave: () => void
  onCancel: () => void
}

function EditEprForm({ form, onChange, onSave, onCancel }: EditEprFormProps) {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Edit EPR</h3>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="text-sm text-gray-700">
            Overall
            <input
              type="number"
              min={1}
              max={5}
              value={form.overall_rating}
              onChange={(e) => onChange((prev) => ({ ...prev, overall_rating: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm text-gray-700">
            Technical
            <input
              type="number"
              min={1}
              max={5}
              value={form.technical_skills_rating}
              onChange={(e) => onChange((prev) => ({ ...prev, technical_skills_rating: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm text-gray-700">
            Non-Technical
            <input
              type="number"
              min={1}
              max={5}
              value={form.non_technical_skills_rating}
              onChange={(e) => onChange((prev) => ({ ...prev, non_technical_skills_rating: Number(e.target.value) }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <label className="text-sm text-gray-700 block">
          Status
          <select
            value={form.status}
            onChange={(e) => onChange((prev) => ({ ...prev, status: e.target.value as EprStatus }))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          >
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="text-sm text-gray-700 block">
          Remarks
          <textarea
            rows={4}
            value={form.remarks}
            onChange={(e) => onChange((prev) => ({ ...prev, remarks: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className="px-3.5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-3.5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditEprForm
