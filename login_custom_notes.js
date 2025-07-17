// Login Customizável com Firebase Authentication

// 1. Inclua Firebase Auth:
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js"></script>

// 2. Criar usuários (admin):
firebase.auth().createUserWithEmailAndPassword(email, senha)

// 3. Login:
firebase.auth().signInWithEmailAndPassword(email, senha)

// 4. Trocar senha:
firebase.auth().currentUser.updatePassword(novaSenha)
