import { useState, useEffect } from 'react'
import axios from 'axios'

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
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [filterValue, setFilterValue] = useState('')

    useEffect(() => {
        axios
            .get('http://localhost:3001/persons')
            .then(response => {
                console.log('Sucess!')
                setPersons(response.data)
            })
    }, [])

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