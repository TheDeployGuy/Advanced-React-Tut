import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Item from "../components/Item";
import Pagination from "../components/Pagination";

// GQL is a function that takes a GQL query, it is advised to keep the queries in the files they are used in, if they are going to be used anywhere else then it can be exported and imported.
export const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const Itemslist = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

export default class Items extends React.Component<{
  page: number;
}> {
  render() {
    return (
      <Center>
        <Pagination page={this.props.page} />
        {/* Query is a component that takes a query as props and will preform your query against the backend, it will then provide the payload via context in the data prop, it also provides error and loading states. */}
        <Query query={ALL_ITEMS_QUERY}>
          {({ data, error, loading }) => {
            // It is a good idea to check the loading and error states as the component may render and if you are trying to access a property on the data object that hasn't resolved you will get 'cannot read property X of undefined'
            if (loading) return <p>Loading</p>;
            if (error) return <p>Error: {error.message} </p>;
            return (
              <Itemslist>
                {data.items.map(item => (
                  <Item key={item.id} item={item} />
                ))}
              </Itemslist>
            );
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    );
  }
}
