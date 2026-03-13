import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type { Person } from "../types/person";

type LeftPaneProps = {
    onSelect: (person: Person) => void
};

function LeftPane({ onSelect }: LeftPaneProps) {
    const [people, setPeople] = useState<Person[]>([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState<"student" | "instructor" | "">("")

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleRole = (value: "student" | "instructor") => {
        setRole(prev => prev === value ? "" : value)
    }
    const fetchPeople = async (search: string, role: string) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/people`, {
                params: {
                    ...(role && { role }),
                    ...(search && { search })
                }
            })
            setPeople(res.data)
        }
        catch (err) {
            toast.error("failed to fetch people")
            console.log(err);
        }
    }
    const getActiveCourse = (courses: any[] | undefined) => {
        const active = courses?.find(c => c.status === "active");
        const name = active?.course_name || "No active course";
        return name.slice(0, 3);
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchPeople(search, role);
        }, 500)

        return () => clearTimeout(debounce);
    }, [search, role])

    return (
        <div className="w-80 h-screen bg-white border-r border-gray-200 flex flex-col">

            {/* Header */}
            <div className="px-5 py-5 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Directory</p>
                <h2 className="text-xl font-bold text-gray-900">People</h2>
            </div>

            {/* Tabs */}
            <div className="px-5 pt-4">
                <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm">

                    <button
                        onClick={() => handleRole("student")}
                        className={`flex-1 py-2 font-semibold transition-colors
          ${role === "student"
                                ? "bg-gray-900 text-white"
                                : "text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        Students
                    </button>

                    <button
                        onClick={() => handleRole("instructor")}
                        className={`flex-1 py-2 font-semibold transition-colors
          ${role === "instructor"
                                ? "bg-gray-900 text-white"
                                : "text-gray-500 hover:bg-gray-50"
                            }`}
                    >
                        Instructors
                    </button>

                </div>
            </div>

            {/* Search */}
            <div className="px-5 pt-3 pb-1">
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:bg-white transition-all"
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Count */}
            <div className="px-5 pt-3 pb-1">
                <p className="text-xs text-gray-400">{people.length} people</p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1">
                {people.map((person) => (
                    <div
                        key={person.id}
                        onClick={() => onSelect(person)}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                    >

                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold shrink-0">
                            {person.role === "student" ? "S" : "I"}
                        </div>

                        {/* Name + Meta */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                {person.name}
                            </p>

                            {person.role === "student" && (
                                <div className="mt-1 flex items-center gap-2 min-w-0">
                                    <span className="text-[10px] uppercase tracking-wide text-gray-400 shrink-0">
                                        Active
                                    </span>
                                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 truncate">
                                        {getActiveCourse(person.courses)}
                                    </span>
                                </div>
                            )}

                            {person.role === "instructor" && (
                                <p className="text-xs text-gray-400 truncate">
                                    {person.total_eprs_written || 0} EPRs written
                                </p>
                            )}
                        </div>

                        {/* Role badge */}
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium shrink-0">
                            {person.role}
                        </span>

                    </div>
                ))}
            </div>
        </div>
    )
}

export default LeftPane