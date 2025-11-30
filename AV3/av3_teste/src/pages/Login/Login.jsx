import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault(); 

    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha })
    });

    if (res.status === 401) {
      setErro("Usuário ou senha incorretos");
      return;
    }

    const data = await res.json();

    localStorage.setItem("usuario", data.usuario);
    localStorage.setItem("userRole", data.nivel);
    console.log(data.nivel)

    navigate("/dashboard");
  }

  return (
    <div className="login-conteudo">
      <h1>AEROCODE</h1>
      <h2>LOGIN</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuário"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="input-email"
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="input-senha"
        />

        {erro && <p className="error">{erro}</p>}

        <button className="btn-login">ENTRAR</button>
      </form>
    </div>
  );
}
