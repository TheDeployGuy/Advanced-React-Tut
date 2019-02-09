import React from "react";
import gql from "graphql-tag";
import { Mutation, MutationFn } from "react-apollo";
import { ALL_ITEMS_QUERY } from "./Items";

interface DeleteItemProps {
  id: string;
  children: React.ReactNode;
}

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export default class DeleteItem extends React.Component<DeleteItemProps> {
  deleteItem = (e, deleteItemMutation: MutationFn) => {
    if (confirm("Are you sure you want to delete this item")) {
      deleteItemMutation();
    }
  };

  update = (cache, payload) => {
    // Manually update the cache on the client, so it matches the server, you could also re-fetch the data from gql server.
    // 1. Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    // 2. Filter the deleted item out of the page
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    // 3. Put the items back into the cache.
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{
          id: this.props.id
        }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button onClick={e => this.deleteItem(e, deleteItem)}>
            {this.props.children}
          </button>
        )}
      </Mutation>
    );
  }
}
