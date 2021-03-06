import React from 'react';
import moment from 'moment';
import firebase from 'firebase';
// import marked from 'marked';
// import got from 'got';
// import $ from 'jquery';


const firebaseRef = "https://boiling-torch-4038.firebaseio.com/"
// const firebaseRef = "https://boiling-fire-4828.firebaseio.com/"


/*

- App
-- TodoAdd
-- TodoList
--- TodoItem 

*/


class App extends React.Component {

	constructor() {
		super()
		this.state = {todos:[], filter:[], ftodos :[]}
	}

	componentWillMount () {
  		this.firebaseRef = new Firebase(firebaseRef);
  		this.firebaseRef.on("child_added", (item) => {
			this.setState({
				todos: [
					item, 
					...this.state.todos
				], 
				ftodos : [
					item,
					...this.state.todos
				]
			})
  		})

  		this.firebaseRef.on("child_removed", (item) => {
			
			this.setState({
				todos: this.state.todos.filter(el => el.key() != item.key())
			})
			this.setState({
				ftodos: this.state.ftodos.filter(el => el.key() != item.key())
			})

  		})

  		this.firebaseRef.on("child_changed", (item) => {
			
			var todos = this.state.todos;
			for (var i in todos) {
				if (todos[i].key() == item.key()) {
					todos[i] = item;
					break;
				}
			}
			var ftodos = todos
			this.setState({todos});
			this.setState({ftodos})
  		})
	}

	componentDidMount() {
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

	handleHover(filter){
	// Something to do here
	} 

	filterTodo(filter){

		var filter = filter.value;


		var ftodos = this.state.todos.filter(function(item, i) {
			if(filter === 'all'){
				return item
			} else if (filter === 'true') {
				return item.val().checked === true
			} else {
				return item.val().checked === false
			}
			
		})
		console.log(filter.label)
		this.setState({ftodos})
		
	}

	render () {

		return (
			<div className="Todo">
				<h1>My todo App</h1>
				<TodoAdd onAdd={::this.addTodo}/>
				<FilterList onHover={::this.handleHover} onFilter={::this.filterTodo}/>
				<TodoList onCheck={::this.handleItemChecked} onSuppr={::this.handleItemSuppr} items={this.state.ftodos}/>
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

class FilterList extends React.Component {
	render () {
		const availableFilters = [
			{ label:'All', value: 'all', active:''},
			{ label:'Remaining', value: 'false', active:''},
			{ label:'Done', value: 'true', active:''},
		];

		const filterList = availableFilters.map((filter, i) => (
			<FilterItem onHover={this.props.onHover} onFilter={this.props.onFilter} key={i} filter={filter} active={filter.active}/>
			)
		)

		return(
			<ul className="filters">
				{filterList}
			</ul>
		) 

	}
}

class FilterItem extends React.Component{

	handleOver () {
     	console.log(this.state)
        console.log(this.props.filter)
        // this.props.onHover(this.props.filter)
    }

	handleFilter(e){
		e.preventDefault()
		this.props.onFilter(this.props.filter)
	}

	render(){
		return(
			<li><a href="#" className={this.props.filter.active} onMouseOver={::this.handleOver} onClick={::this.handleFilter}>{this.props.filter.label}</a></li>
		)
	}
} 

export default App