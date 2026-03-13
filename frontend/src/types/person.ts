export type Person = {
  id: string
  name: string
  email: string
  role: "student" | "instructor" | "admin"
  courses?: {
    course_name: string
    status: "active" | "completed" | "dropped"
  }[]
  total_eprs_written?: number
}