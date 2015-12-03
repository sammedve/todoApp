import React from 'react';
import moment from 'moment';
// import marked from 'marked';
// import got from 'got';
// import $ from 'jquery';
import firebase from 'firebase';


var myDataRef = new Firebase('https://boiling-torch-4038.firebaseio.com/');

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

	generateId () {
    	return Math.floor(Math.random() * 90000) + 10000;
  	}

	addTodo(task) {
		var id = this.generateId().toString()

		this.setState({
			todos: [
				{text:task, checked:false, id:id, createdDate:moment()}, 
				...this.state.todos
			]
		})

		console.log(myDataRef)
	}

	handleItemChecked (item, checked) {

		var todos = this.state.todos;
		for (var i in todos) {
			if (todos[i].id == item.id) {
				todos[i].checked = checked;
				break;
			}
		}
		this.setState({todos});
	}

	handleItemSuppr(item){
		var todos =this.state.todos;
		todos = todos.filter(function(el){
			 return el.id !== item.id;
		})
		this.setState({todos});

	}

	render () {
		// console.log(this.state)
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
		console.log(this.props.content.id)
		this.props.onSuppr(this.props.content)
	}

	render () {
		const {checked,text, id, createdDate} = this.props.content;
		var fromNow = createdDate.fromNow();
		const cssClasses = 'item ' + (checked ? 'checked' : '')
		return (
			<li data={id}className={cssClasses}><span><input onChange={::this.handleCheck} type="checkbox" checked={checked}/></span><span>{text}</span><span className="date">{createdDate.fromNow()}</span><span><button type="button" onClick={::this.handleSuppr}>Delete</button></span></li>
			
		)
	}

}

export default App
