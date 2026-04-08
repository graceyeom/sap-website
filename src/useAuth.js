import { useState, useEffect } from 'react'
import { supabase, PRIVACY_VERSION } from './supabaseClient'

// Supabase 세션 + 프로필을 한 번에 관리하는 커스텀 훅
export function useAuth() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    // 초기 세션 로드
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (data.session) loadProfile(data.session.user.id)
      else setLoading(false)
    })

    // 세션 변화 구독
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
      if (sess) loadProfile(sess.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    setProfile(data || null)
    setLoading(false)
  }

  const signInWithGoogle = async () => {
    if (!supabase) return
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  // 카카오 로그인 — 비즈 앱 등록 제약으로 현재 보류. 추후 복구 가능.
  // const signInWithKakao = async () => {
  //   if (!supabase) return
  //   await supabase.auth.signInWithOAuth({
  //     provider: 'kakao',
  //     options: { redirectTo: window.location.origin },
  //   })
  // }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    window.location.hash = 'home'
  }

  const saveConsent = async (privacy, marketing) => {
    if (!supabase || !session) return { error: 'no session' }
    const now = new Date().toISOString()
    const { error } = await supabase.from('profiles').update({
      privacy_consent: privacy,
      privacy_consent_at: privacy ? now : null,
      privacy_consent_version: privacy ? PRIVACY_VERSION : null,
      marketing_consent: marketing,
      marketing_consent_at: marketing ? now : null,
      marketing_consent_method: marketing ? 'consent_form' : null,
      updated_at: now,
    }).eq('id', session.user.id)
    if (!error) await loadProfile(session.user.id)
    return { error }
  }

  return {
    session,
    user: session?.user || null,
    profile,
    loading,
    isLoggedIn: !!session,
    needsConsent: !!session && profile && !profile.privacy_consent,
    supabaseReady: !!supabase,
    signInWithGoogle,
    signOut,
    saveConsent,
  }
}
