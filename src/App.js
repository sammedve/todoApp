import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
// import marked from 'marked';
// import got from 'got';
// import $ from 'jquery';

const firebaseRef = "https://boiling-fire-4828.firebaseio.com/"


/*

- App
-- TodoAdd
-- TodoList
--- TodoItem 

*/


class App extends React.Component {

	constructor() {
		super()
		this.state = {todos:[]}
	}

	componentWillMount () {
  		this.firebaseRef = new Firebase(firebaseRef);

  		this.firebaseRef.on("child_added", (item) => {
			this.setState({
				todos: [
					item, 
					...this.state.todos
				]
			})
  		})

  		this.firebaseRef.on("child_removed", (item) => {
			// console.log(item.key())
			this.setState({
				todos: this.state.todos.filter(el => el.key() != item.key())
			})
  		})

  		this.firebaseRef.on("child_changed", (item) => {
			// console.log(item.key())
			var todos = this.state.todos;
			for (var i in todos) {
				if (todos[i].key() == item.key()) {
					todos[i] = item;
					break;
				}
			}
			this.setState({todos});
  		})
	}

	componentDidMount() {
		// alert('Ok')
		setInterval(::this.forceUpdate, 5000)
	}


	generateId () {
    	return Math.floor(Math.random() * 90000) + 10000;
  	}

	addTodo(task) {
		const id = this.generateId().toString()
		const item = {text:task, checked:false, id:id, createdDate: moment().format('YYYY-MM-DD HH:mm:ss')}
		this.firebaseRef.push(item)
	}

	handleItemChecked (item, checked) {

		this.firebaseRef.child(item.key()).update({checked : checked})

	}

	handleItemSuppr(item){

		this.firebaseRef.child(item.key()).remove()

	}

	render () {

		return (
			<div className="Todo">
				<h1>My todo App</h1>
				<TodoAdd onAdd={::this.addTodo}/>
				<TodoList onCheck={::this.handleItemChecked} onSuppr={::this.handleItemSuppr} items={this.state.todos}/>
			</div>
		)
	}

}

class TodoAdd extends React.Component {

	handleSubmit (e) {
    	e.preventDefault();
    	this.props.onAdd(this.refs.task.value)
    	this.refs.task.value =""
  	}

	render () {
		return (
			<form className="form" onSubmit={::this.handleSubmit}>
				<input ref="task" type="text" placeholder="Add a task"/>
				<input type="submit" value="Add"/>
			</form>
		)
	}

}

class TodoList extends React.Component {

	render () {
		 // console.log(this.props.items)

		const list = this.props.items.map((item,i) => (
				<Item onCheck={this.props.onCheck} onSuppr={this.props.onSuppr} key={i} content={item}/>
				// <li key={i} className="item"><span><input onChange={this.handleCheck.bind(this,i)} type="checkbox"/></span><span>{item}</span></li>
			)
		) 

		return (
		< div className="mytodo">
			<h3>To do</h3>
			<ul className="list">
				{list}
			</ul>
		</div>
		);
	}

}

class Item extends React.Component {

	handleCheck(e){
		this.props.onCheck(this.props.content,e.target.checked)
	}

	handleSuppr(e){
		e.preventDefault()
		// console.log(this.props.content.id)
		this.props.onSuppr(this.props.content)
	}

	render () {
		const {checked,text, createdDate} = this.props.content.val();
		const id = this.props.content.key();
		const fromNow = moment(createdDate).fromNow();
		const cssClasses = 'item ' + (checked ? 'checked' : '')
		return (
			<li data={id}className={cssClasses}>
				<span><input onChange={::this.handleCheck} type="checkbox" checked={checked}/></span>
				<span>{text}</span>
				<span className="date">{fromNow}</span>
				<span><button type="button" onClick={::this.handleSuppr}>Delete</button></span>
			</li>
			
		)
	}

}

export default App
