import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const user = useSelector((state) => state.UserAuth.user);

  if (!user) {

    return <Navigate to="/login" replace />;
  }

  return children;
}
