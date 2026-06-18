import { useEffect, useState } from "react";
import { db, auth } from "./firebaseConnection";
import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import "./App.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);

  // 🔥 LISTA EM TEMPO REAL
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor,
        });
      });

      setPosts(lista);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 LOGIN STATE
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true);
        setUserDetail({
          uid: user.uid,
          email: user.email,
        });
      } else {
        setUser(false);
        setUserDetail({});
      }
    });

    return () => unsub();
  }, []);

  // 🔥 ADICIONAR POST
  async function handleAdd() {
    await addDoc(collection(db, "posts"), {
      titulo,
      autor,
    });

    setTitulo("");
    setAutor("");
  }

  // 🔥 BUSCAR POSTS
  async function buscarPosts() {
    const postsRef = collection(db, "posts");

    const snapshot = await getDocs(postsRef);

    let lista = [];

    snapshot.forEach((doc) => {
      lista.push({
        id: doc.id,
        titulo: doc.data().titulo,
        autor: doc.data().autor,
      });
    });

    setPosts(lista);
  }

  // 🔥 EDITAR POST
  async function editarPost() {
    const docRef = doc(db, "posts", idPost);

    await updateDoc(docRef, {
      titulo,
      autor,
    });

    setIdPost("");
    setTitulo("");
    setAutor("");
  }

  // 🔥 DELETE
  async function excluirPost(id) {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  }

  // 🔥 REGISTO
  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha);

    setEmail("");
    setSenha("");
  }

  // 🔥 LOGIN
  async function logarUsuario() {
    const result = await signInWithEmailAndPassword(auth, email, senha);

    setUser(true);
    setUserDetail({
      uid: result.user.uid,
      email: result.user.email,
    });
  }

  // 🔥 LOGOUT
  async function FazerLogout() {
    await signOut(auth);
    setUser(false);
    setUserDetail({});
  }

  return (
    <div>
      <h1>React + Firebase :)</h1>

      {user && (
        <div>
          <strong>Bem-vindo, {userDetail.email}!</strong>
          <br />
          <button onClick={FazerLogout}>Sair</button>
        </div>
      )}

      {/* LOGIN */}
      <div className="container">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Login</button>
      </div>

      <hr />

      {/* POSTS */}
      <div className="container">
        <input
          placeholder="ID do post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />

        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Criar</button>
        <button onClick={buscarPosts}>Buscar</button>
        <button onClick={editarPost}>Atualizar</button>

        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <strong>{post.titulo}</strong> - {post.autor}
              <button onClick={() => excluirPost(post.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
