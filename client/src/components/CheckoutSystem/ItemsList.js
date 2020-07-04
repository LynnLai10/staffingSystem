import React from "react";
import { connect } from "react-redux";
import { Query } from "@apollo/react-components";
import { schema_items } from "../../schema/item";
import ItemFormModal from "./ItemFormModal";
import DeleteItem from "./DeleteItem";
import {
  Panel,
  FlexboxGrid,
  ButtonGroup,
  Divider,
  Loader,
  Alert,
  InputPicker,
} from "rsuite";

class ItemsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "popularity_DESC",
      sortList: [
        {
          label: "Popularity",
          value: "popularity_DESC",
        },
        {
          label: "Popularity",
          value: "popularity_ASC",
        },
        {
          label: "Description",
          value: "description_en_DESC",
        },
        {
          label: "Description",
          value: "description_en_ASC",
        },
      ],
    };
  }
  handleChange = (value) => {
    this.setState({ value });
  };
  renderItem = (item) => {
    return (
      <div>
        {item.label}{" "}
        <i
          className={`rs-icon rs-icon-arrow-circle-${
            item.value.split("_")[1] === "DESC" ? "down" : "up"
          }`}
        />
      </div>
    );
  };
  render() {
    const { category } = this.props;
    const { value, sortList } = this.state;
    return (
      <div>
        <Query
          query={schema_items}
          variables={{
            category: `${category}`,
            orderBy: `${value ? value : "id_ASC"}`,
          }}
        >
          {({ loading, error, data }) => {
            if (loading) {
              return (
                <Loader
                  backdrop
                  center
                  size="md"
                  content={`Loading...`}
                  vertical
                />
              );
            }
            if (error) {
              return Alert.error("Failed. Please try again.");
            }
            return (
              <div>
                <div className="itemsList__top">
                  <h3>{category === "melonFruit"? "Melon & Fruit" : `${category.charAt(0).toUpperCase() + category.slice(1)}`}</h3>
                  {this.props.user.accountType === "Admin" && (
                    <ItemFormModal category={category} />
                  )}
                  <InputPicker
                    value={value}
                    placeholder="Sort By"
                    onChange={this.handleChange}
                    data={sortList}
                    renderMenuItem={(label, item) => this.renderItem(item)}
                    renderValue={(value, item) => this.renderItem(item)}
                    className="itemsList__sortBy"
                  />
                </div>
                <Divider />
                <FlexboxGrid>
                  {data.items.map((item) => {
                    const { id, description_en, description_cn } = item;
                    const imgURL = `../../img/checkout/${category}/${id}.jpg`;
                    return (
                      <FlexboxGrid.Item key={id}>
                        <Panel
                          shaded
                          bordered
                          bodyFill
                          className="itemsList__panel"
                        >
                          <img src={imgURL} height="200" alt="rice" />
                          <div>
                            <div className="itemsList_description">
                              <h5>{description_en}</h5>
                              <h5>{description_cn}</h5>
                            </div>
                            <ButtonGroup className="itemsList__btn">
                              <ItemFormModal
                                category={category}
                                isEdit
                                data={item}
                                imgURL={imgURL}
                              />
                              <DeleteItem category={category} data={item} />
                            </ButtonGroup>
                          </div>
                        </Panel>
                      </FlexboxGrid.Item>
                    );
                  })}
                </FlexboxGrid>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return { user: user.user };
};

export default connect(mapStateToProps)(ItemsList);
