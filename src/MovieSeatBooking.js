import React, { Component } from 'react';
import './MovieSeatBooking.css';

const getEmptySeats = (rows, cols) => {
  const emptySeats = [];
  for (let i = 0; i < rows; i++) {
    const arr = [];
    for (let j = 0; j < cols; j++) {
      arr.push('n/a')
    }
    emptySeats.push(arr);
  }

  return emptySeats;
};

function Rows({ seats, selectSeat }) {
  const newSeats = seats.map((row, i) => {
    const newRow = row.map((col, j) => {
      return <div key={j} className={'seat ' + col} onClick={selectSeat.bind(this, i, j)} disabled={col === 'occupied' ? true : false} />
    })
    return (
      <div key={i} className="row">
        {newRow}
      </div>
    )
  })
  return newSeats;

}

class MovieSeatBooking extends Component {

  constructor() {
    super();
    this.state = {
      seats: { select: getEmptySeats(6, 8) },
      selectedMovie: 'select',
    }
  }

  componentDidMount() {
    let savedSeats = JSON.parse(localStorage.getItem('movieData'));
    if (savedSeats) {
      for (let key in savedSeats) {
        savedSeats[key] = savedSeats[key].map((row) => {
          return row.map((col) => {
            return col === 'selected' ? 'occupied' : col;
          })
        })
      }
      this.setState({ seats: savedSeats });
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    const { seats } = this.state;
    const selectedMovie = e.target.value;
    if (!seats[selectedMovie]) {
      seats[selectedMovie] = getEmptySeats(6, 8);
      localStorage.setItem('movieData', JSON.stringify(seats));
      this.setState({ selectedMovie, seats });
    } else {
      this.setState({ selectedMovie });
    }
  }

  selectSeat = (row, col) => {
    const { selectedMovie, seats } = this.state;
    let checkSeat = seats[selectedMovie][row][col];
    if (checkSeat !== 'occupied') {
      seats[selectedMovie][row][col] = checkSeat === 'n/a' ? 'selected' : 'n/a';
      localStorage.setItem('movieData', JSON.stringify(seats));
      this.setState({ seats: { ...seats } });
    }
  }

  renderRows = () => {
    const { selectedMovie, seats } = this.state;
    return <Rows seats={seats[selectedMovie]} selectSeat={this.selectSeat} />
  }

  render() {
    return (
      <div className="MovieSeatBooking">
        <div className="movie-container">
          <label>Pick a movie:</label>
          <select id="movie" onChange={this.handleChange}>
            <option value="select">select...</option>
            <option value="Avengers">Avengers: Endgame ($10)</option>
            <option value="Joker">Joker ($12)</option>
            <option value="Toy">Toy Story 4 ($8)</option>
            <option value="LionKing">The Lion King ($9)</option>
          </select>
          <ul className="showcase">
            <li>
              <div className="seat"></div>
              <small>N/A</small>
            </li>
            <li>
              <div className="seat selected"></div>
              <small>Selected</small>
            </li>
            <li>
              <div className="seat occupied"></div>
              <small>Occupied</small>
            </li>
          </ul>

          <div className="container">
            <div className="screen"></div>
            {this.renderRows()}
          </div>
        </div>
      </div>
    );
  }
}

export default MovieSeatBooking;