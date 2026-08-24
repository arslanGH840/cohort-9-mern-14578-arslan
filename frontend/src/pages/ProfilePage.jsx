import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Profile</h1>
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="mb-4">
          <p className="text-xs text-text-muted mb-1">Username</p>
          <p className="text-text-primary font-medium">{user?.username}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted mb-1">Email</p>
          <p className="text-text-primary font-medium">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
