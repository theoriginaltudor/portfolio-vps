'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function loginUser(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string | null
  const password = formData.get('password') as string | null

  if (!email || !password) {
    redirect('/error?reason=missing-fields')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    redirect('/error?reason=invalid-email')
  }

  const data = {
    email,
    password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logoutUser(pathname: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  redirect(pathname)
}