const ProjectDetailInputs = ({ label, value, onChange, isVisible }) => {
    if (!isVisible) return null;
    return (
      <TextField
        fullWidth
        className="inputText"
        label={label}
        variant="outlined"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={label}
        size="small"
        margin="normal"
      />
    );
  };

  export default ProjectDetailInputs;