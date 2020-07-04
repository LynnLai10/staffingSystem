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
} from "rsuite";

class ItemsList extends React.Component {
  render() {
    const { category } = this.props;
    return (
      <div>
        {this.props.user.accountType === "Admin" && (
          <ItemFormModal category={category} />
        )}
        <Divider />
        <Query query={schema_items} variables={{ category: `${category}` }}>
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
            console.log(data);
            return (
              <FlexboxGrid>
                {data.items.map((item) => {
                  const { id, description_en, description_cn } = item;
                  return (
                    <FlexboxGrid.Item key={id}>
                      <Panel
                        shaded
                        bordered
                        bodyFill
                        className="itemsList__panel"
                      >
                        <img
                          src={`../../img/${id}.jpeg`}
                          height="200"
                          alt="rice"
                        />
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
                            />
                            <DeleteItem category={category} data={item} />
                          </ButtonGroup>
                        </div>
                      </Panel>
                    </FlexboxGrid.Item>
                  );
                })}
              </FlexboxGrid>
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
