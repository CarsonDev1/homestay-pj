import ErrorIcon from "@mui/icons-material/Error";
import { Link } from "react-router-dom";
import "./NotFound.Style.scss";

export default function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="error-title">404 - Page Not Found</h1>
      <ErrorIcon sx={{ fontSize: "40px" }} />
      <p className="error-description">
        Oops! The page you are looking for does not exist.
      </p>
      <p className="homepage">
        <Link to="/">Return to home page</Link>
      </p>
    </div>
  );
}
