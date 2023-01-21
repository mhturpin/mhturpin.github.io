function FileUpload(props) {
  return (
    <div>
      <label htmlFor={props.id}>{props.label}</label>
      <input type='file' accept={props.accept} id={props.id} name={props.id} onChange={props.onChange}/>
    </div>
  );
}

export default FileUpload;
