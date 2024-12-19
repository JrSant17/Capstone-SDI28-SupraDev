import { Button, Typography } from '@mui/material';

const ProjectDetailHeader = ({ projectName, projectId }) => (
    <>
      <Typography
        variant="h4"
        gutterBottom
        style={{ fontWeight: "bold", marginBottom: "1.5rem" }}
      >
        {projectName}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component="a"
        href={`/projects/${projectId}/status`}
        style={{ marginBottom: "1rem" }}
      >
        View Project Status
      </Button>
    </>
  );

  export default ProjectDetailHeader;