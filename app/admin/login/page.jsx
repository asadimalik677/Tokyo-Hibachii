import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "../../../lib/auth";

export default async function LoginPage({ searchParams }) {
  if (await isAdminLoggedIn()) redirect("/admin");
  const params = await searchParams;

  return (
    <main className="admin-page">
      <section className="login-box admin-card">
        <p className="eyebrow">Tokyo Hibachi Admin</p>
        <h1>Admin Login</h1>
        <p>Use private credentials to manage live reservations.</p>
        {params?.error ? <p className="error-box">Incorrect username or password.</p> : null}
        <form action="/api/login" method="post">
          <label>Username<input name="username" autoComplete="username" required /></label>
          <label>Password<input type="password" name="password" autoComplete="current-password" required /></label>
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
      </section>
    </main>
  );
}
