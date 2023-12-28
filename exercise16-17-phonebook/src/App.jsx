import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/noteService'

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

const Persons = ({ persons, filterValue, deletePerson }) => {
    return (
        persons
            .filter(person => person.name.toLowerCase().includes(filterValue.toLowerCase()))
            .map(person => <Person key={person.id} person={person} deletePerson={deletePerson} />)
    )
}

const Person = ({ person, deletePerson }) => {
    return (
        <div>
            {person.name} ({person.number})
            <button onClick={() => deletePerson(person.id)}>Delete</button>
        </div>
    )
}

const ErrorNotification = ({ message }) => {
    if (message === null) return null

    return (
        <div className='error'>
            {message}
        </div>
    )
}

const Notification = ({ message }) => {
    if (message === null) return null

    return (
        <div className='notification'>
            {message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newPhoneNumber, setNewPhoneNumber] = useState('')
    const [filterValue, setFilterValue] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [notification, setNotification] = useState(null)

    //Innit
    useEffect(() => {
        noteService
            .getAll()
            .then(initialPersons => setPersons(initialPersons))
    }, [])

    const handleInput = (event) => {
        setNewName(event.target.value)
    }

    const handlePhoneInput = (event) => {
        setNewPhoneNumber(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        let oldPerson = persons.find(person => person.name.toLowerCase() === newName.trim().toLowerCase())
        if (oldPerson !== undefined && window.confirm(`${oldPerson.name} is already added to phone book, replace the old number with a new one?`)) {
            const newContact = { ...oldPerson, number: newPhoneNumber }
            noteService
                .update(oldPerson.id, newContact)
                .then(newObject => {
                    const newPersons = [...persons].map(person => person.id === oldPerson.id ? newObject : person)
                    setPersons(newPersons)
                })
            setNotification(`Changed information of ${oldPerson.name}`)
        } else if (oldPerson === undefined) {
            const newPerson = { name: newName.trim(), number: newPhoneNumber }
            noteService
                .create(newPerson)
                .then(newObject => {
                    setPersons(persons.concat(newObject))
                })
            setNotification(`Added ${newPerson.name}`)
        }

        setNewName('')
        setNewPhoneNumber('')
        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }

    const deletePerson = (id) => {
        const name = persons.find(person => person.id === id).name
        if (window.confirm(`Delete ${name}?`)) {
            noteService
                .deleteNode(id)
                .then(data => {
                    console.log(data)
                    const newPersons = [...persons].filter(person => person.id !== id)
                    setPersons(newPersons)
                    setNotification(`Deleted successfully`)
                    setTimeout(() => {
                        setNotification(null);
                    }, 5000)
                })
                .catch(error => {
                    const newPersons = [...persons].filter(person => person.id !== id)
                    setPersons(newPersons)
                    setErrorMessage(`Information of '${name}' has already been removed from server`)
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000)
                })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <ErrorNotification message={errorMessage} />
            <Notification message={notification} />
            <Filter filterValue={filterValue} setFilterValue={setFilterValue} />
            <h3>Add a new</h3>
            <PersonForm handleInput={handleInput} handleSubmit={handleSubmit} handlePhoneInput={handlePhoneInput} newName={newName} newPhoneNumber={newPhoneNumber} />
            <h2>Numbers</h2>
            <Persons persons={persons} filterValue={filterValue} deletePerson={deletePerson} />
        </div>
    )
}

export default App