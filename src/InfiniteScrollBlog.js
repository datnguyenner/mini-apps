import React, { Component } from 'react';
import './InfiniteScrollBlog.css';

class InfiniteScrollBlog extends Component {

  constructor() {
    super();
    this.state = {
      limit: 3,
      page: 1,
      posts: [],
      filteredText: '',
      isLoading: true
    }
  }

  async componentDidMount() {
    await this.loadPosts();
    window.addEventListener('scroll', this.handleScroll, true);
  }

  loadPosts = async () => {
    let { limit, page, posts } = this.state;
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=' + limit + '&_page=' + page);
    const newPosts = await response.json();
    posts = [...posts, ...newPosts];
    setTimeout(this.setState.bind(this, { posts, isLoading: false, page: page + 1 }), 500);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  renderPosts = () => {

    const { filteredText, posts } = this.state;
    const filteredPosts = posts.filter(post => post.title.indexOf(filteredText) > -1 || post.body.indexOf(filteredText) > -1);

    return filteredPosts.map((post, i) => {
      return (
        <div key={i} className='post'>
          <label className='post-id'>{post.id}</label>
          <h3 className='post-title'>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      )
    });

  }

  handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      this.setState({ isLoading: true });
      this.loadPosts();
    }
  }

  filterPosts = (e) => {
    e.preventDefault();
    this.setState({ filteredText: e.target.value });
  }


  render() {
    return (
      <div className='infinite-scroll-container'>
        <h1>My Blog</h1>
        <input className='filter' type='text' onChange={this.filterPosts} placeholder='Filter post...' />
        <div className='posts-container' >
          {this.renderPosts()}
        </div>
        {this.state.isLoading ?
          <div className='loader'>
            <div className='circle'></div>
            <div className='circle'></div>
            <div className='circle'></div>
          </div> :
          ''
        }
      </div>
    );
  }
}

export default InfiniteScrollBlog;