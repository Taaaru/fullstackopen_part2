const Header = ({ course }) => {
    return (
        <>
            <h1>{course.name}</h1>
        </>
    )
}

const Content = ({ course }) => {
    return (
        <>
            {course.parts.map(part => (
                <Part key={part.name} name={part.name} exercises={part.exercises} />
            ))}
        </>
    )
}

const Part = ({ name, exercises }) => {
    return (
        <>
            <p>
                {name} {exercises}
            </p>
        </>
    )
}

const Total = ({ course }) => {
    let sum = course.parts.reduce((result, part) => result + part.exercises, 0)

    return (
        <>
            <h4>total of {sum} exercises</h4>
        </>
    )
}
/* <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div> */

const Course = ({ course }) => {
    return (
        <div id='course'>
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
        </div>
    )
}

export default Course