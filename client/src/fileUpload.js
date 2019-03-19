import React from 'react'
import Dropzone from 'react-dropzone'

const baseStyle = {
    width: 400,
    height: 100,
    borderWidth: 2,
    borderColor: '#666',
    borderStyle: 'dashed',
    borderRadius: 5
  };
  const activeStyle = {
    borderStyle: 'solid',
    borderColor: '#6c6',
    backgroundColor: '#eee'
  };
  const rejectStyle = {
    borderStyle: 'solid',
    borderColor: '#c66',
    backgroundColor: '#eee'
  };

class MyDropzone extends React.Component {

  render() {
    return (
<Dropzone
  onDrop = {this.props.onDrop}>
  {({ getRootProps, getInputProps, isDragActive,  isDragReject }) => {
    let styles = {...baseStyle}
    styles = isDragActive ? {...styles, ...activeStyle} : styles
    styles = isDragReject ? {...styles, ...rejectStyle} : styles

    return (
      <div
        {...getRootProps()}
        style={styles}
      >
        <input {...getInputProps()} />
        <div>
          ファイルを選択してください
        </div>
      </div>
    )
  }}
</Dropzone>
    );
  }
}

export default MyDropzone;