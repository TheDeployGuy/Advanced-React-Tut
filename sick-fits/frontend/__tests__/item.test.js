import Item from "../components/Item";
import { shallow } from "enzyme";
import React from "react";

const fakeItem = {
  id: "ABC123",
  title: "A Cool Item",
  price: 5000,
  description: "This item is really cool!",
  image: "dog.jpg",
  largeImage: "largedog.jpg"
};

describe("<Item />", () => {
  it("Should render", () => {
    const wrapper = shallow(<Item item={fakeItem} />);
    const PriceTag = wrapper.find("PriceTag");
    // Shallow rendering only renders the parent component, if you want to go down another level you need to either fully mount the component or shallow render another level e.g:
    console.log(wrapper.debug());
    const priceTagText = PriceTag.children().text();
    expect(priceTagText).toBe("$51");
  });
});
