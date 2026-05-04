import React, { useRef } from "react";
import ReactQuill from "react-quill";

function TextEditor({ value, onChange }) {
  const quillRef = useRef();

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      theme="snow"
      className="bg-white"
    />
  );
}

export default TextEditor;