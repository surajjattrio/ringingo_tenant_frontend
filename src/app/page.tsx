"use client"

// PROJECT IMPORT
import Layout from "@/components/layouts"
import Login from "./(auth)/login/page"
import { LAYOUT } from "@/config/constant"

const LoginPage = () => {
  return (
    <>
    <Layout variant={LAYOUT.minimal}>
    <Login />
    </Layout>
    </>
  )
}

export default LoginPage