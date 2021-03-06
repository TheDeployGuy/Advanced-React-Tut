import React from "react";
import { Mutation, MutationFn } from "react-apollo";
import gql from "graphql-tag";
import Router from "next/router";
import Form from "./styles/Form";
import Error from "../components/ErrorMessage";
import formatMoney from "../lib/formatMoney";

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      image: $image
      largeImage: $largeImage
      price: $price
    ) {
      id
    }
  }
`;

interface CreateItemState {
  title: string;
  description: string;
  image: string;
  largeImage: string;
  price: number;
  imageUploading: boolean;
}

export default class CreateItem extends React.Component<{}, CreateItemState> {
  state: CreateItemState = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0,
    imageUploading: false
  };

  handleInputChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;

    this.setState({ [name]: val } as any);
  };

  createItem = async (e, createItemMutation) => {
    e.preventDefault();
    const res = await createItemMutation();
    Router.push({
      pathname: "/item",
      query: { id: res.data.createItem.id }
    });
  };

  uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");

    this.setState({
      imageUploading: true
    });

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dbhba8phc/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const file = await res.json();
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
      imageUploading: false
    });
  };
  render() {
    const { imageUploading } = this.state;
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={e => this.createItem(e, createItem)}>
            <Error error={error} />
            {/* Disabled on fieldset allows us to disable the form while the form is being submitted, aria-busy allows for accessibility and we can use it to style */}
            <fieldset
              disabled={loading || imageUploading}
              aria-busy={loading || imageUploading}
            >
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.uploadFile}
                />
                {this.state.image && (
                  <img src={this.state.image} alt="Preview image" />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
                  onChange={this.handleInputChange}
                />
              </label>

              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  value={this.state.price}
                  onChange={this.handleInputChange}
                />
              </label>

              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter A Description"
                  required
                  value={this.state.description}
                  onChange={this.handleInputChange}
                />
              </label>

              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}
