import {useEffect} from "react";
import {useState} from "react";
import { db, auth } from "./firebaseConnection";
import { doc,
   setDoc, 
   collection,  
   addDoc, 
   getDoc, 
   getDocs, 
   updateDoc, 
   deleteDoc,
   onSnapshot
  } from "firebase/firestore";
import { createUserWithEmailAndPassword, 
        signInWithEmailAndPassword,
          signOut,
          onAuthStateChanged
} from "firebase/auth";  

import './app.css';

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [idPost, setIdPost] = useState("");

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    async function loadPosts(){
      const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          })
        })

        setPosts(lista);
      });
    }
    loadPosts();
  }, [])

  useEffect(() => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          });
        }else{
          setUser(false);
          setUserDetail({});
        }
      });
    }

    checkLogin();

  }, [])

  async function handleAdd(){
    //await setDoc(doc(db, "posts", "12345"), {
    // titulo: titulo,
    //  autor: autor
    //})
    //.then(() => {
      //console.log("Cadastrado com sucesso!");
      //setTitulo("");
      //setAutor("");
   // })
    //.catch((error) => {
      //console.log("Erro ao cadastrar: " + error);
    //})

    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log("Cadastrado com sucesso!");
      setTitulo("");
      setAutor("");
    })
    .catch((error) => {
      console.log("Erro ao cadastrar: " + error);
    })

  }

  async function buscarPosts(){
   // alert("Buscando posts...");
    //const postRef = doc(db, "posts", "5PomNscfL5vVdVuUoAG6");

    //await getDoc(postRef)
    //.then((snapshot) => {
      //setAutor(snapshot.data().autor);
      //setTitulo(snapshot.data().titulo);  
    //})      
    //.catch((error) => {
      //console.log("Erro ao buscar: " + error);
   // })

   const postsRef = collection(db, "posts");
   await getDocs(postsRef)
   .then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        })
      })

      setPosts(lista);
      //console.log(lista);
   })
    .catch((error) => {
      console.log("Erro ao buscar: " + error);
    })
  }

   async function editarPost(){
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor
    })
    .then(() => {
      console.log("Atualizado com sucesso!");
      setIdPost("");
      setTitulo("");
      setAutor("");
    })
    .catch((error) => {
      console.log("Erro ao atualizar: " + error);
    })
  }

    async function excluirPost(id){
      const docRef = doc(db, "posts", id);
      await deleteDoc(docRef)
      .then(() => {
        alert("Excluído com sucesso!");
        console.log("Excluído com sucesso!");
      })
      .catch((error) => {
        alert("Erro ao excluir: " + error);
        console.log("Erro ao excluir: " + error);
      })
    }


    async function novoUsuario(){
      await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        console.log("Usuário criado com sucesso!");
        setEmail("");
        setSenha("");
      })
      .catch((error) => {
        if(error.code === "auth/weak-password"){
          alert("Senha deve conter no mínimo 6 caracteres!");
        }else if(error.code === "auth/email-already-in-use"){
          alert("Esse e-mail já está em uso!");
        }else{
          alert("Erro ao criar usuário: " + error);
        }
        
        //console.log("Erro ao criar usuário: " + error);
      })
    }

      async function logarUsuario(){
        await signInWithEmailAndPassword(auth, email, senha)
        .then((value) => {
          console.log("Usuaario logado com sucesso")
          console.log(value.user);

          setUserDetail({
            uid: value.user.uid,
            email: value.user.email
          });
          setUser(true);
        })
        .catch((error) => {
          console.log("Erro ao logar usuário: " + error);
          
          //console.log("Erro ao logar usuário: " + error);
        })
      }

      async function FazerLogout(){
        await signOut(auth)
        setUser(false);
        setUserDetail({});
      }
  return (
    <div>

      <h1>React + Firebase :) </h1>

      { user && (
        <div>
          <strong>Bem-vindo, {userDetail.email}!</strong>
          <span>Id: {userDetail.uid} - Email: {userDetail.email}</span><br/><br/>
          <button onClick={FazerLogout}>Sair</button>
          <br/><br/>
        </div>
      )}

      <div className="container">
        <h2>Faça seu login</h2>
        <label>E-mail:</label>
        <input 
          type="email" 
          placeholder="Digite seu e-mail..." 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br/>

        <label>Senha:</label>
        <input 
          type="senha" 
          placeholder="Digite sua senha..." 
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        /><br/>
        <button onClick={novoUsuario}>Cadastrar</button>
        <button onClick={logarUsuario}>Fazer Login</button>
      </div>

      <br/><br/>
      <hr/>

      <div className="container">

        <label>ID do Post:</label>
        <input 
        //type="text" 
        placeholder="Digite o ID do post..." 
        value={idPost}
        onChange={(e) => setIdPost(e.target.value)}
        /><br/><br/>

        <label>Titulo:</label>
        <textarea 
        type="text" 
        placeholder="Digite o título do post..." 
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        />
        <label>Autor:</label>
        <textarea 
        type="text" 
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
        placeholder="Digite o nome do autor..."/>

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPosts}>Buscar Posts</button> <br/><br/>

        <button onClick={editarPost}>Atualizar</button>

        <ul>
          {posts.map((post) => {
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br/>
                <span className="post-titulo">{post.titulo}</span><br/>
                <span className="post-autor">{post.autor}</span><br/>
                <button onClick={() => excluirPost(post.id)}>Excluir</button><br/><br/>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}
export default App;