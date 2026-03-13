import LeftPane from "./components/LeftPane";
import RightPane from "./components/RightPane";
import { useState } from "react";
import type { Person } from "./types/person";
import { Toaster } from "react-hot-toast";

function App() {

  const [person,setPerson] = useState<Person|null>(null);
  const handleSelect = (person: Person) => setPerson(person);
  return (
    <div className="flex h-screen">
        <Toaster position="top-right" />
        <LeftPane onSelect={handleSelect}/>
        <RightPane person={person}/>
    </div>

  )
}

export default App
