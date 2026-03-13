import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type { Person } from "../types/person";
import EditEprForm from "./EditEprForm";
import NewEprForm from "./NewEprForm";

type RightPaneProps = {
  person: Person | null
}

type Epr = {
  id: string
  overall_rating: number
  status: "draft" | "submitted" | "archived"
  period_start: string
  period_end: string
}

type EprStatus = Epr["status"]

type EprDetail = Epr & {
  technical_skills_rating: number
  non_technical_skills_rating: number
  remarks: string
  role_type: string
  evaluator: { id: string; name: string } | null
  person: { id: string; name: string } | null
}

const roleLabel: Record<Person["role"], string> = {
  student: "Student",
  instructor: "Instructor",
  admin: "Admin",
}

const API_URL = import.meta.env.VITE_API_URL as string
const ADMIN_EVALUATOR_ID = import.meta.env.VITE_ADMIN_EVALUATOR_ID as string

function eprRoleTypeForPerson(role: Person["role"]) {
  return role === "student" ? "student" : "instructor"
}

function formatPeriod(start: string, end: string) {
  const startDate = new Date(start)
  const endDate = new Date(end)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return `${start} – ${end}`
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear()
  const startMonth = startDate.toLocaleString("en-US", { month: "short" })
  const endMonth = endDate.toLocaleString("en-US", { month: "short" })

  if (sameYear) {
    return `${startMonth}–${endMonth} ${endDate.getFullYear()}`
  }

  return `${startMonth} ${startDate.getFullYear()} – ${endMonth} ${endDate.getFullYear()}`
}

function getActiveCourse(person: Person) {
  return person.courses?.find((course) => course.status === "active")?.course_name ?? person.courses?.[0]?.course_name ?? null
}

function StatusBadge({ status }: { status: Epr["status"] }) {
  const styles = {
    draft: "bg-amber-50 text-amber-700 border border-amber-200",
    submitted: "bg-green-50 text-green-700 border border-green-200",
    archived: "bg-gray-100 text-gray-600 border border-gray-200",
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}

function RatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i <= rating ? "bg-amber-400" : "bg-gray-200"
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs font-semibold text-gray-500">{rating}/5</span>
    </div>
  )
}

function RightPane({ person }: RightPaneProps) {

  const [allEprs, setAllEprs] = useState<Epr[]>([])
  const [selectedEpr, setSelectedEpr] = useState<Epr | null>(null)
  const [selectedEprDetail, setSelectedEprDetail] = useState<EprDetail | null>(null)
  const [mode, setMode] = useState<"view" | "edit" | "create">("view")
  const [editForm, setEditForm] = useState({
    overall_rating: 3,
    technical_skills_rating: 3,
    non_technical_skills_rating: 3,
    remarks: "",
    status: "draft" as EprStatus,
  })
  const [createForm, setCreateForm] = useState({
    period_start: "",
    period_end: "",
    overall_rating: 3,
    technical_skills_rating: 3,
    non_technical_skills_rating: 3,
    remarks: "",
  })

  const fetchEprDetail = async (eprId: string) => {
    try {
      const res = await axios.get(`${API_URL}/api/epr/${eprId}`)
      setSelectedEprDetail(res.data as EprDetail)
    } catch {
      toast.error("Failed to load EPR details")
    }
  }

  const fetchEprs = async (personId: string, eprIdToSelect?: string) => {
    try {
      const res = await axios.get(`${API_URL}/api/epr`, {
        params: { personId }
      })

      const records: Epr[] = res.data as Epr[]
      setAllEprs(records)

      if (!eprIdToSelect) {
        return
      }

      const matchedEpr = records.find((item) => item.id === eprIdToSelect) ?? null
      setSelectedEpr(matchedEpr)
      if (matchedEpr) {
        await fetchEprDetail(matchedEpr.id)
      } else {
        setSelectedEprDetail(null)
      }
    } catch {
      toast.error("Failed to load EPR records")
    }
  }

  useEffect(() => {
    if (!person) {
      setAllEprs([])
      setSelectedEpr(null)
      return
    }

    const fetchEprs = async () => {
      setSelectedEpr(null)
      setSelectedEprDetail(null)
      setMode("view")
      await fetchEprsForPerson(person.id)
    }

    fetchEprs()

  }, [person?.id])

  const fetchEprsForPerson = async (personId: string, eprIdToSelect?: string) => {
    await fetchEprs(personId, eprIdToSelect)
  }

  const handleSelectEpr = async (epr: Epr) => {
    setSelectedEpr(epr)
    setSelectedEprDetail(null)
    setMode("view")
    await fetchEprDetail(epr.id)
  }

  const openEditMode = () => {
    if (!selectedEpr) return

    setEditForm({
      overall_rating: selectedEprDetail?.overall_rating ?? selectedEpr.overall_rating,
      technical_skills_rating: selectedEprDetail?.technical_skills_rating ?? 3,
      non_technical_skills_rating: selectedEprDetail?.non_technical_skills_rating ?? 3,
      remarks: selectedEprDetail?.remarks ?? "",
      status: selectedEprDetail?.status ?? selectedEpr.status,
    })
    setMode("edit")
  }

  const handleSaveEdit = async () => {
    if (!selectedEpr || !person) return

    try {
      await axios.patch(`${API_URL}/api/epr/${selectedEpr.id}`, {
        id: selectedEpr.id,
        overall_rating: editForm.overall_rating,
        technical_skills_rating: editForm.technical_skills_rating,
        non_technical_skills_rating: editForm.non_technical_skills_rating,
        remarks: editForm.remarks,
        status: editForm.status,
      })

      toast.success("EPR updated")
      setMode("view")
      await fetchEprsForPerson(person.id, selectedEpr.id)
    } catch {
      toast.error("Failed to update EPR")
    }
  }

  const handleCreateEpr = async () => {
    if (!person) return

    if (!createForm.period_start || !createForm.period_end) {
      toast.error("Period start and end are required")
      return
    }

    try {
      const res = await axios.post(`${API_URL}/api/epr`, {
        person_id: person.id,
        evaluator_id: ADMIN_EVALUATOR_ID,
        role_type: eprRoleTypeForPerson(person.role),
        period_start: createForm.period_start,
        period_end: createForm.period_end,
        overall_rating: createForm.overall_rating,
        technical_skills_rating: createForm.technical_skills_rating,
        non_technical_skills_rating: createForm.non_technical_skills_rating,
        remarks: createForm.remarks,
        status: "draft",
      })

      toast.success("EPR created")
      setCreateForm({
        period_start: "",
        period_end: "",
        overall_rating: 3,
        technical_skills_rating: 3,
        non_technical_skills_rating: 3,
        remarks: "",
      })
      setMode("view")
      await fetchEprsForPerson(person.id, res.data.id)
    } catch {
      toast.error("Failed to create EPR")
    }
  }

  if (!person) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 bg-gray-50">
        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm font-medium">Select a person to view performance records</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-white overflow-hidden">

      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Selected Person</p>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{person.name}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                  {roleLabel[person.role]}
                </span>
                {person.role === "student" && getActiveCourse(person) && (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                    {getActiveCourse(person)}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setCreateForm({
                  period_start: "",
                  period_end: "",
                  overall_rating: 3,
                  technical_skills_rating: 3,
                  non_technical_skills_rating: 3,
                  remarks: "",
                })
                setMode("create")
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New EPR
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Records</h3>
            <p className="text-sm text-gray-500">Review evaluation history for this person.</p>
          </div>
          {allEprs.length > 0 && (
            <span className="text-sm font-medium text-gray-400">{allEprs.length} record{allEprs.length === 1 ? "" : "s"}</span>
          )}
        </div>

        {/* EPR List */}
        {allEprs.length === 0 ? (
          <div className="mt-12 flex flex-col items-center gap-2 text-gray-400">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm font-medium">No EPR records found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allEprs.map((epr) => (
              <div
                key={epr.id}
                onClick={() => handleSelectEpr(epr)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl border cursor-pointer transition-all
                  ${selectedEpr?.id === epr.id
                    ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedEpr?.id === epr.id ? "bg-white/10" : "bg-gray-100"
                }`}>
                  <svg className={`w-4 h-4 ${selectedEpr?.id === epr.id ? "text-white" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${selectedEpr?.id === epr.id ? "text-white" : "text-gray-800"}`}>
                    {formatPeriod(epr.period_start, epr.period_end)}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`text-xs font-medium ${selectedEpr?.id === epr.id ? "text-white/70" : "text-gray-500"}`}>
                      Overall rating
                    </span>
                    <RatingDots rating={epr.overall_rating} />
                  </div>
                </div>

                <div className="shrink-0">
                  {selectedEpr?.id === epr.id ? (
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs font-semibold capitalize text-white/90">
                      {epr.status}
                    </span>
                  ) : (
                    <StatusBadge status={epr.status} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected EPR Detail */}
        {selectedEpr && mode === "view" && (
          <div className="mt-6 rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">EPR Details</h3>
              <button
                onClick={openEditMode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Person</p>
                <p className="text-sm font-medium text-gray-800">
                  {selectedEprDetail?.person?.name ?? person.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Period</p>
                <p className="text-sm font-medium text-gray-800">
                  {formatPeriod(selectedEpr.period_start, selectedEpr.period_end)}
                </p>
              </div>

              {selectedEprDetail?.evaluator && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Evaluator</p>
                  <p className="text-sm font-medium text-gray-800">{selectedEprDetail.evaluator.name}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Ratings</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 w-40">Overall</span>
                    <RatingDots rating={selectedEpr.overall_rating} />
                  </div>
                  {selectedEprDetail && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 w-40">Technical Skills</span>
                        <RatingDots rating={selectedEprDetail.technical_skills_rating} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 w-40">Non-Technical Skills</span>
                        <RatingDots rating={selectedEprDetail.non_technical_skills_rating} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Status</p>
                <StatusBadge status={selectedEpr.status} />
              </div>

              {selectedEprDetail?.remarks && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Remarks</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedEprDetail.remarks}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedEpr && mode === "edit" && (
          <EditEprForm
            form={editForm}
            onChange={(updater) => setEditForm(updater)}
            onSave={handleSaveEdit}
            onCancel={() => setMode("view")}
          />
        )}

        {mode === "create" && (
          <NewEprForm
            form={createForm}
            onChange={(updater) => setCreateForm(updater)}
            onCreate={handleCreateEpr}
            onCancel={() => setMode("view")}
          />
        )}

      </div>
    </div>
  )
}

export default RightPane;