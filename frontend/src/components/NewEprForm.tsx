type CreateFormState = {
  period_start: string
  period_end: string
  overall_rating: number
  technical_skills_rating: number
  non_technical_skills_rating: number
  remarks: string
}

type NewEprFormProps = {
  form: CreateFormState
  onChange: (updater: (prev: CreateFormState) => CreateFormState) => void
  onCreate: () => void
  onCancel: () => void
}

function NewEprForm({ form, onChange, onCreate, onCancel }: NewEprFormProps) {
  return (
    <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">New EPR</h3>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm text-gray-700">
            Period Start
            <input
              type="date"
              value={form.period_start}
              onChange={(e) => onChange((prev) => ({ ...prev, period_start: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm text-gray-700">
            Period End
            <input
              type="date"
              value={form.period_end}
              onChange={(e) => onChange((prev) => ({ ...prev, period_end: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

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
            onClick={onCreate}
            className="px-3.5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            Create
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

export default NewEprForm
