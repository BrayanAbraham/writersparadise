import React, { Component } from "react";
import ClassicEditor from "ClassicEditor";

class CKEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  bindChangeEvent = (editor, document) => {
    document.on("change", () => {
      if (document.differ.getChanges().length > 0) {
        this.props.onChange(editor.getData());
      }
    });
  };

  componentDidMount() {
    ClassicEditor.create(document.querySelector("#editor"))
      .then(editor => {
        editor.setData(this.props.data);
        this.bindChangeEvent(editor, editor.model.document);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return <div id={"editor"} className="ckheight" />;
  }
}

export default CKEditor;
