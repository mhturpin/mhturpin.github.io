function FileUpload(props) {
  return (
    <div>
      <label>{props.label}</label>
      <input type='file' accept={props.accept} id={props.name} name={props.name}/>
    </div>
  );
}

export default FileUpload;
