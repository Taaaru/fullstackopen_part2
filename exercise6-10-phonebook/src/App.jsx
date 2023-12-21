import { useState } from 'react'

const Filter = ({ filterValue, setFilterValue }) => {
    const handleFilterChange = (event) => {
        setFilterValue(event.target.value)
    }

    return (
        <div>
            Filter shown with <input value={filterValue} onChange={handleFilterChange} />
        </div>
    )
}

const PersonForm = ({ handleSubmit, newName, handleInput, newPhoneNumber, handlePhoneInput }) => {

    return (
        <form onSubmit={handleSubmit}>
            <div>
                Name: <input value={newName} onChange={handleInput} />
            </div>
            <div>
                Number: <input value={newPhoneNumber} onChange={handlePhoneInput} />
            </div>
            <div>
                <button type='submit'>
                    Add
                </button>
            </div>
        </form>
    )
}

const Persons = ({ persons, filterValue }) => {
    return (
        persons
            .filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))
            .map(person => <p key={person.id}>{person.name} ({person.number})</p>)
    )
}

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '1111-2222-3333', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [newName, setNewName] = useState('')
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [filterValue, setFilterValue] = useState('')

    const handleInput = (event) => {
        setNewName(event.target.value)
    }

    const handlePhoneInput = (event) => {
        setNewPhoneNumber(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        for (let person of persons) {
            if (newName.trim().toLowerCase() === person.name.toLowerCase()) {
                alert(person.name + ' is already added to phonebook')
                return
            }
        }
        const newPersons = persons.concat({ name: newName.trim(), id: persons.length + 1, number: newPhoneNumber })
        setPersons(newPersons)
        setNewName('')
        setNewPhoneNumber('')
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter filterValue={filterValue} setFilterValue={setFilterValue} />
            <h3>Add a new</h3>
            <PersonForm handleInput={handleInput} handleSubmit={handleSubmit} handlePhoneInput={handlePhoneInput} newName={newName} newPhoneNumber={newPhoneNumber} />
            <h2>Numbers</h2>
            <Persons persons={persons} filterValue={filterValue} />
        </div>
    )
}

export default App