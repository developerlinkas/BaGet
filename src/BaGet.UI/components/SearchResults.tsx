import * as React from 'react';

interface SearchResultsProps {
  input: string;
  onSelect(value: string): void;
}

interface Package {
  id: string;
  authors: string;
  totalDownloads: number;
  latestVersion: string;
  tags: string[];
  description: string;
  iconUrl: string;
}

interface SearchResultsState {
  items: Package[];
}

export default class Search extends React.Component<SearchResultsProps, SearchResultsState> {

  constructor(props: SearchResultsProps) {
    super(props);

    this.state = {items: []};
  }

  componentDidMount() {
    this._loadItems(this.props.input);
  }

  componentWillReceiveProps(props: Readonly<SearchResultsProps>) {
    this._loadItems(props.input);
  }

  render() {
    return (
      <div>
        {this.state.items.map(value => (
          <div key={value.id}>
            <div>
              <img src={value.iconUrl} />
            </div>
            <div>
              <h2><a href="#" onClick={e => this.props.onSelect(value.id)}>{value.id}</a></h2>
              <span>by: {value.authors}</span>
            </div>
            <div>
              <span>{value.totalDownloads} total downloads</span>
              <span>Latest version: {value.latestVersion}</span>
              <span>{value.tags}</span>
            </div>
            <div>
              {value.description}
            </div>
          </div>
        ))}
      </div>
    );
  }

  private _loadItems(query: string): void {
    let url = (query && query.length != 0)
      ? `http://localhost:50557/v3/search?q=${encodeURIComponent(query)}`
      : `http://localhost:50557/v3/search`;

    fetch(url).then(response => {
      return response.json();
    }).then(results => {
      let items: Package[] = [];

      for (let entry of results["data"]) {
        items.push({
          id: entry["id"],
          authors: entry["authors"],
          totalDownloads: entry["totalDownloads"],
          latestVersion: entry["version"],
          tags: entry["tags"],
          description: entry["description"],
          iconUrl: entry["iconUrl"],
        });
      }

      this.setState({ items: items });
    });
  }
}