import {useState , useEffect} from "react";
import {useNavigate} from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (token) {
      if (user.role === "student") navigate("/student/exams");
      else if (user.role === "admin") navigate("/admin/dashboard");
    }
  }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser({ email, password });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if(data.user?.role === "student"){
                navigate("/student/exams");
            }
            else if (data.user?.role === "admin"){
                navigate("/admin/dashboard");
            }
            else{
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            alert("Connexion échoué");
        }
    };
    return (
        <div className="login-container">
            <div className="login-card">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>CONNEXION</h2>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="etudiant@exemple.com"
                    />
                </div>
                <div className="form-group">
                    <label>Mot de passe:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="********"
                    />
                </div>
                <button type="submit" className="login-btn">SE CONNECTER</button>
            </form>
            </div>
        </div>
    );
};

export default Login;       