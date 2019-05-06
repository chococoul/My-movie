import React from "react";
import axios from "axios";

const Loading = () => (
  <span className="is-size-4">
    <span className="fas fa-spinner fa-pulse" /> Loading...
  </span>
);

class ResultsList extends React.Component {
  constructor(props) {
    super(props);
    this.defaultPoster = "http://via.placeholder.com/300x424?text=No+cover";
    this.createImdbLink = this.createImdbLink.bind(this);
  }

  createImdbLink(id) {
    return `http://www.imdb.com/title/${id}`;
  }

  render() {
    const { results } = this.props;
    if (results.length === 0) {
      return (
        <div>
          <span className="is-size-4">{this.props.notFoundMessage}</span>
        </div>
      );
    }

    return (
      <div
        className="is-flex"
        style={{ flexWrap: "wrap", alignContent: "space-between" }}
      >
        {results.map(result => (
          <div
            key={result.imdbID}
            className="card"
            style={{ width: "20%", marginRight: "1em", marginTop: "1em" }}
          >
            <a href={this.createImdbLink(result.imdbID)}>
              <div className="card-image">
                <figure className="image">
                  <img
                    alt={`${result.Title}'s poster`}
                    src={
                      result.Poster === "N/A"
                        ? this.defaultPoster
                        : result.Poster
                    }
                  />
                </figure>
              </div>
              <div className="card-content">
                <div className="content">
                  <p className="title is-size-4">{result.Title}</p>
                  <p>
                    {result.Type}, {result.Year}
                  </p>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>
    );
  }
}

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: "",
      results: [],
      loading: false,
      didSearch: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState(
      Object.assign({}, this.state, { searchKey: event.target.value })
    );
  }

  handleClick(event) {
    event.preventDefault();
    this.setState(
      Object.assign({}, this.state, {
        loading: true,
        results: [],
        didSearch: true
      })
    );
    axios
      .get(
        `https://jsonmock.hackerrank.com/api/movies/search/?Title=${encodeURIComponent(
          this.state.searchKey
        )}`
      )
      .then(response => {
        const results = {};
        this.setState(
          Object.assign({}, this.state, {
            loading: false,
            results: response.data.data
          })
        );
      });
  }

  render() {
    return (
      <div>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Movie finder</h1>
              <h2 className="subtitle">Find your next favourite movie :)</h2>
            </div>
          </div>
        </section>
        <section style={{ marginTop: "1em" }}>
          <div className="container">
            <div className="field has-addons">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Search movies"
                  value={this.state.searchKey}
                  disabled={this.state.loading}
                  onChange={this.handleChange}
                />
              </div>
              <div className="control">
                <button
                  className="button is-info"
                  onClick={this.handleClick}
                  disabled={this.state.loading || !this.state.searchKey}
                >
                  Search
                </button>
              </div>
            </div>
            <div>
              {this.state.loading ? (
                <Loading />
              ) : (
                <ResultsList
                  results={this.state.results}
                  notFoundMessage={this.state.didSearch ? "No movie found" : ""}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default Movie;
