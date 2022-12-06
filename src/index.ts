import { v4 as uuidV4 } from 'uuid'
import './styles.css'

type ToDo = {
  id: string,
  title: string,
  description: string,
  active: boolean
}

const toDoForm = document.querySelector<HTMLFormElement>('.addToDo--form')
const toDoTitle = document.querySelector<HTMLInputElement>('.addToDo--form__title')
const toDoDescription = document.querySelector<HTMLInputElement>('.addToDo--form__description')
const toDoList = document.querySelector<HTMLUListElement>('.toDo-list')
let toDos: ToDo[] = []

const toDo = (title: string, description: string): ToDo => {
  return {
    id: uuidV4(),
    title,
    description,
    active: true
  }
}

const saveToDosToLocalStorage = (toDos: ToDo[]) => {
  window.localStorage.setItem('toDos', JSON.stringify(toDos))
};

toDoForm.addEventListener('submit', event => {
  event.preventDefault()
  if (toDoTitle.value === '' || toDoTitle.value === null) {
    return;
  }
  toDos.push(toDo(toDoTitle.value, toDoDescription.value))
  saveToDosToLocalStorage(toDos)
  toDoForm.reset()
  window.dispatchEvent(new Event('statechange'))
})

const liTemplate = (toDo: ToDo) => {
  return `
    <li id=${toDo.id} class="${toDo.active ? 'todo__item' : 'todo__item todo__item--completed'}">
      <h2>${toDo.title}</h2>
      <h3>${toDo.description}</h3>
      ${toDo.active ? '' : '<button class="button">Remove</button>'}
    </li>`
}

const renderLi = (li: String, ul: HTMLElement) => {
  ul.innerHTML += li
}

const displayToDos = (toDos: ToDo[]) => {
  toDoList.innerHTML = ''
  toDos.forEach((todo) => {
    renderLi(liTemplate(todo), toDoList)
  })
}

const createRemoveButton = (element: HTMLElement) => {
  const button = document.createElement('button')
  button.setAttribute('class', 'button')
  button.textContent = 'Remove'
  element.appendChild(button)
}

const toggleMarkComplete = (element: HTMLElement) => {
  element.classList.toggle('todo__item--completed')
  if (element.classList[1]) {
    createRemoveButton(element)
  } else {
    element.removeChild(element.lastElementChild)
  }
}

const toggleToDo = (id: string) => {
  const todo = toDos.find((todoToMark: ToDo) => todoToMark.id === id);
  todo.active = !todo.active
}

toDoList.addEventListener('click', (event: Event) => {
  if ((event.target as Element).matches('li')) {
    const toDoId: string | null = (event.target as Element).getAttribute('id')
    if (!toDoId) {
      return
    }
    toggleToDo(toDoId)
    toggleMarkComplete(event.target as HTMLElement)
    saveToDosToLocalStorage(toDos)
  }
  if ((event.target as Element).matches('button')) {
    const toDoId: string = (event.target as Element).parentElement.getAttribute('id')
    toDos.splice(toDos.findIndex(toDo => toDo.id === toDoId), 1)
    saveToDosToLocalStorage(toDos)
    displayToDos(toDos)
  }
})

window.addEventListener('statechange', () => {
  toDos = JSON.parse(localStorage.getItem('toDos')) || []
  displayToDos(toDos)
})

window.dispatchEvent(new Event('statechange'))
