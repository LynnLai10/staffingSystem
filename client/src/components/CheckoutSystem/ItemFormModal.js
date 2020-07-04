import React from "react";
import { Mutation } from "@apollo/react-components";
import {
  schema_createItem,
  schema_updateItem,
  schema_items,
} from "../../schema/item";
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Modal,
  Button,
  Slider,
  Schema,
  IconButton,
  Icon,
  Loader,
  Alert,
  Uploader,
} from "rsuite";

const { StringType } = Schema.Types;
const model = Schema.Model({
  description_en: StringType().isRequired("This field is required."),
  description_cn: StringType().isRequired("This field is required."),
});

class CustomField extends React.PureComponent {
  render() {
    const { name, message, label, accepter, error, ...props } = this.props;
    return (
      <FormGroup className={error ? "has-error" : "staffForm__modal"}>
        <ControlLabel>{label} </ControlLabel>
        <FormControl
          name={name}
          accepter={accepter}
          errorMessage={error}
          {...props}
        />
        <HelpBlock>{message}</HelpBlock>
      </FormGroup>
    );
  }
}

class ItemFormModal extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      formValue: {
        description_en: "",
        description_cn: "",
        popularity: 3,
        category: this.props.category,
      },
      formError: {},
      show: false,
      id: "",
      uploadFile: this.props.isEdit
        ? [{ filekey: 1, url: this.props.imgURL }]
        : [],
    };
    this.state = Object.assign({}, this.initialState);
  }
  //modal function
  close = () => {
    this.setState(this.initialState);
  };
  open = () => {
    this.setState({ show: true });
    if (this.props.isEdit) {
      delete this.props.data.__typename;
      this.setState({
        id: this.props.data.id,
        formValue: this.props.data,
      });
    }
  };
  handleChange = (value) => {
    this.setState({
      formValue: value,
    });
  };
  handleSubmit = (mutate) => {
    if (!this.form.check()) {
      Alert.error("Error");
    } else {
      const { id, formValue } = this.state;
      console.log(formValue);
      const variables = this.props.isEdit
        ? formValue
        : {
            ...formValue,
            id,
          };
      mutate({
        variables,
        refetchQueries: [
          { query: schema_items, variables: { category: this.props.category } },
        ],
      }).then(() => {});
    }
  };
  //uplaod function
  handleUploaderChange = (value) => {
    console.log(value);
    this.setState({ uploadFile: value });
  };
  handleReupload = (file) => {
    this.uploader.start(file);
  };
  render() {
    const { isEdit, category } = this.props;
    const { formValue, show, formError, uploadFile } = this.state;
    const schema = isEdit ? schema_updateItem : schema_createItem;
    return (
      <div>
        {show && (
          <Modal show={show} onHide={this.close} size="xs">
            <Mutation
              mutation={schema}
              onCompleted={() => {
                //uploader must execute before modal closed
                this.uploader.start();
                this.close();
                Alert.success("Success.");
              }}
            >
              {(mutate, { loading, error, data }) => {
                return (
                  <div>
                    <Modal.Header>
                      <Modal.Title>{isEdit ? "Edit" : "New"} Item</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                      <Form
                        fluid
                        ref={(ref) => (this.form = ref)}
                        onChange={this.handleChange}
                        formValue={formValue}
                        model={model}
                        onCheck={(formError) => {
                          this.setState({ formError });
                        }}
                      >
                        <CustomField
                          name="description_en"
                          label={`${
                            category === "rice" ? "Brand Name" : "Description"
                          } in English`}
                          error={formError.description_en}
                        />
                        <CustomField
                          name="description_cn"
                          label={`${
                            category === "rice" ? "Brand Name" : "Description"
                          } in Chinese`}
                          error={formError.description_cn}
                        />
                        <CustomField
                          name="popularity"
                          label="Popularity"
                          accepter={Slider}
                          min={1}
                          setp={1}
                          max={5}
                          graduated
                          progress
                          renderMark={(mark) => {
                            switch (mark) {
                              case 5:
                                return "High";
                              case 3:
                                return "Middle";
                              case 1:
                                return "Low";
                              default:
                                return "";
                            }
                          }}
                          className="itemFormModal___slider"
                        ></CustomField>
                        <div>
                          <Uploader
                            autoUpload={false}
                            action={`/checkout/${category}`}
                            name="checkout"
                            onChange={this.handleUploaderChange}
                            data={{
                              id: isEdit
                                ? this.props.data.id
                                : data && data.createItem.id,
                            }}
                            defaultFileList={uploadFile}
                            accept="image/*"
                            listType="picture"
                            multiple={false}
                            disabled={uploadFile.length === 1}
                            ref={(ref) => {
                              this.uploader = ref;
                            }}
                          />
                        </div>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        appearance="primary"
                        onClick={() => {
                          this.handleSubmit(mutate);
                        }}
                        type="submit"
                        disabled={!uploadFile.length}
                      >
                        Confirm
                      </Button>
                      <Button onClick={this.close} appearance="subtle">
                        Cancel
                      </Button>
                    </Modal.Footer>
                    {loading && (
                      <Loader
                        backdrop
                        center
                        size="md"
                        content={`Saving...`}
                        vertical
                      />
                    )}
                    {error && Alert.error("Failed. Please try again.")}
                  </div>
                );
              }}
            </Mutation>
          </Modal>
        )}
        {isEdit ? (
          <IconButton
            appearance="subtle"
            onClick={this.open}
            icon={<Icon icon="edit2" />}
            className="staffList__btn"
          />
        ) : (
          <Button appearance="ghost" onClick={this.open}>
            New Item
          </Button>
        )}
      </div>
    );
  }
}

export default ItemFormModal;
