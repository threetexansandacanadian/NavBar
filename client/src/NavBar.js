import React, { Component } from 'react';
import axios from 'axios';
import ShoppingCart from './ShoppingCart.js';
import './styles.css';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchBoxValue: '',
      searchResults: [],
      allowTypeSearch: true,
      finalSearchId: -Infinity,
      searched: false,
      shoppingCart: [{name:'Maple Syrup', price:10.00}, {name:'Crack', price:5.99}]
    };
  }
  
  componentDidMount() {
    window.addEventListener('buyItem', this.handleBuy.bind(this))
  }

  handleBuy(e) {
    const itemsToBuy = this.state.shoppingCart;
    itemsToBuy.push(e.detail)
    this.setState({shoppingCart: itemsToBuy})
  }

  handleSearchChange(e) {
    e.preventDefault();
    if(this.state.allowTypeSearch) {
      this.setState({searchBoxValue: e.target.value, allowTypeSearch:false}, () => {
        axios.get(`http://ec2-3-17-161-19.us-east-2.compute.amazonaws.com/api/products/names/partial?name=${this.state.searchBoxValue}`)
        .then(response => {
          this.setState({searchResults: response.data, allowTypeSearch: true})
        })
        .catch(err => console.log(err))
        })
    }
  }

  handleSearch(e) {
    e.preventDefault();
    const searchParam = this.state.searchBoxValue;
    if (searchParam !== '' && this.state.searchResults.length !== 0) {
      axios.get(`http://ec2-3-17-161-19.us-east-2.compute.amazonaws.com/api/products/names?name=${searchParam}`)
      .then(results => {
        this.setState({finalSearchId: results.data.productID}, () => {
          window.dispatchEvent(new CustomEvent('updateProdId', {detail: this.state.finalSearchId}))
        })
      })
      .catch(err => console.log('error', err));
    }
  }

  handleEnter(e) {
    if (e.keyCode === 13) {
      this.handleSearch(e);
    }
  }

  render() {
    return(
      <div className='navBar'>
        <h1 id='yeeHawEh'>Yee-Haw Eh!</h1>
        <div className="searchField">
          <input 
            className='search' autoComplete='off' 
            list='search' name='search' type='text' 
            placeholder='Search...' default='none'
            onChange={this.handleSearchChange.bind(this)} 
            onKeyDown={this.handleEnter.bind(this)}>
          </input>
          <datalist id='search' list='search'>
            {this.state.searchResults.map(item => (
              <option value={item.name}></option>
            ))}
          </datalist>
            <button className='submitSearch' type='submit'>
              <i className="fas fa-search fa-2x" onClick={this.handleSearch.bind(this)}></i>
            </button>
        </div>
        <ShoppingCart shoppingCart={this.state.shoppingCart}/>
      </div>
    )
  }
}
