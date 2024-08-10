// uncomment logs to understand the flow of your requests


import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from 'next-auth/providers/credentials';
import pool from "@/lib/db";
import bcrypt from "bcrypt"

export const options = {
  providers: [
    GoogleProvider({
      // Provide your google or other Provider OAuth client id and client secret
      // from your personal account check the docs. https://next-auth.js.org/configuration/providers/oauth
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: async (profile) => {
        // console.log("GoogleProvider Runing profile: ", profile)

        // Change this line or remove it add your own logic
        // I like to have my users data in my own Database so I insert goolges data to my database
        const role = profile.email.startsWith('test@email.com') ? 'admin' : 'user';
        const connection = await pool.getConnection()
        try {
          // if user exist with that email
          const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?",[profile.email])
          // if user doesn't exist insert it to my Database
          if(rows.length === 0){
            await connection.execute("INSERT INTO users(email, name, image, role, provider_id) VALUES(?, ?, ?, ?, ?)",[profile.email, profile.name, profile.picture, role, profile.sub])     
          }
          connection.release()
          return { ...profile, role,id:profile.sub };
        } catch (error) {
          console.log("database query have error")
          connection.release()
          throw new error
        }

    }}),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "Email Address",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        try {
          // console.log("authorize Runed!")
          const { email, password } = credentials;
          const connection = await pool.getConnection();
          
          const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
          
          if (rows.length === 0) {
            connection.release()
            throw new Error('No user found');
          }

          const user = rows[0];
          const isMatch = await bcrypt.compare(password, user.password);
        
          

          if (isMatch) {
            delete user.password
            connection.release();
            
            return user
          } else {
            connection.release();
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          console.error("Authorization failed:", error);
          throw new Error('Authentication failed');
        } 
      },
    }),
  ],
  session:{
    jwt: true
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {

    async signIn({ user }) {
      const {id, email, name, picture, role} = user;
      // console.log("signIn Callback user: ",user)
      const connection = await pool.getConnection();

      
      try {
        // check for user in database
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        // if user exist allow him/her
        if (rows.length > 0){
          connection.release();
          return true;
        }
        return false
      } 
      catch (error) {
        connection.release();
        console.error("Sign-in failed:", error);
        return false;
      } 
    },
    async redirect({ url, baseUrl }) {
      // console.log("redirect Callback!")
      return baseUrl; // Always redirect to home page after sign-in
    },
    async jwt({ token, user, account }) {
      // console.log("Before JWT callback: token:", token, "user:", user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.picture
      }
      // Uncomment if you need the access token from the account
      // if (account) {
      //   token.accessToken = account.access_token;
      // }
      // console.log("After JWT callback: token:", token, "user:", user);

      return token;
    },
    async session({ session, token }) {
      // console.log("Before Session callback: token:", token, "session:", session);
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture
        // session.accessToken = token.accessToken; // Uncomment if needed
      }
      // console.log("After Session callback: token:", token, "session:", session);

      return session;
    },
  },
};
