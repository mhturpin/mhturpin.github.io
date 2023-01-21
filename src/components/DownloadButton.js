function DownloadButton(props) {
  return (
    <div className={props.className}>
      <a href={window.URL.createObjectURL(new Blob([props.fileContents], {type: 'text/plain'}))} download={props.fileName}>Download Converted File</a>
    </div>
  );
}

export default DownloadButton;
